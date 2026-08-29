import bcrypt from "bcrypt";
import { findAdministradorByEmail } from "../repositories/administrador.repository";
import { clienteRepository, findClienteByEmail } from "../repositories/cliente.repository";
import { firmarToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { JwtPayload } from "../types/auth.types";

const SALT_ROUNDS = 10;

interface RegistroClienteInput {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
}

interface LoginResult {
  token: string;
  payload: JwtPayload;
}

export class AuthService {
  async registrarCliente(datos: RegistroClienteInput): Promise<LoginResult> {
    const existente = await findClienteByEmail(datos.email);
    if (existente) {
      throw new AppError("El email ya está registrado", 409);
    }

    const password_hash = await bcrypt.hash(datos.password, SALT_ROUNDS);
    const nuevoCliente = clienteRepository().create({
      nombre: datos.nombre,
      email: datos.email,
      password_hash,
      telefono: datos.telefono,
    });
    const cliente = await clienteRepository().save(nuevoCliente);

    const payload: JwtPayload = {
      id: cliente.id,
      rol: "cliente",
      email: cliente.email,
      nombre: cliente.nombre,
    };
    return { token: firmarToken(payload), payload };
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const administrador = await findAdministradorByEmail(email);
    if (administrador && (await bcrypt.compare(password, administrador.password_hash))) {
      const payload: JwtPayload = {
        id: administrador.id,
        rol: "administrador",
        email: administrador.email,
        nombre: administrador.nombre,
      };
      return { token: firmarToken(payload), payload };
    }

    const cliente = await findClienteByEmail(email);
    if (cliente && (await bcrypt.compare(password, cliente.password_hash))) {
      if (!cliente.activo) {
        throw new AppError("Cuenta desactivada, contactá al administrador", 403);
      }
      const payload: JwtPayload = {
        id: cliente.id,
        rol: "cliente",
        email: cliente.email,
        nombre: cliente.nombre,
      };
      return { token: firmarToken(payload), payload };
    }

    throw new AppError("Credenciales inválidas", 401);
  }
}
