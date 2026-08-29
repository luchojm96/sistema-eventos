import { AppDataSource } from "../config/data-source";
import { Administrador } from "../entities/Administrador";

export const administradorRepository = () => AppDataSource.getRepository(Administrador);

export const findAdministradorByEmail = (email: string) =>
  administradorRepository()
    .createQueryBuilder("administrador")
    .addSelect("administrador.password_hash")
    .where("administrador.email = :email", { email })
    .getOne();
