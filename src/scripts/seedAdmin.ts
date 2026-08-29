import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

import bcrypt from "bcrypt";
import { AppDataSource } from "../config/data-source";
import { administradorRepository, findAdministradorByEmail } from "../repositories/administrador.repository";

const SALT_ROUNDS = 10;

async function main() {
  const nombre = process.env.SEED_ADMIN_NOMBRE ?? "Administrador";
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Definí SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD (en .env o como variables de entorno) antes de correr este script.");
    process.exit(1);
  }

  await AppDataSource.initialize();

  const existente = await findAdministradorByEmail(email);
  if (existente) {
    console.log(`Ya existe un administrador con el email ${email}. No se creó ninguno nuevo.`);
    await AppDataSource.destroy();
    return;
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const admin = administradorRepository().create({ nombre, email, password_hash });
  await administradorRepository().save(admin);

  console.log(`Administrador creado: ${email}`);
  await AppDataSource.destroy();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
