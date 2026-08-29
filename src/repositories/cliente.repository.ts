import { AppDataSource } from "../config/data-source";
import { Cliente } from "../entities/Cliente";

export const clienteRepository = () => AppDataSource.getRepository(Cliente);

export const findClienteByEmail = (email: string) =>
  clienteRepository()
    .createQueryBuilder("cliente")
    .addSelect("cliente.password_hash")
    .where("cliente.email = :email", { email })
    .getOne();

export const findClienteById = (id: number) => clienteRepository().findOneBy({ id });

export const findAllClientes = () => clienteRepository().find({ order: { id: "ASC" } });
