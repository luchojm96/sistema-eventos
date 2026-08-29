import bcrypt from "bcrypt";
import { clienteRepository, findAllClientes, findClienteById } from "../repositories/cliente.repository";
import { AppError } from "../utils/AppError";

const SALT_ROUNDS = 10;

function sinIndefinidos<T extends object>(datos: T): Partial<T> {
  return Object.fromEntries(Object.entries(datos).filter(([, valor]) => valor !== undefined)) as Partial<T>;
}

export class ClienteService {
  listar() {
    return findAllClientes();
  }

  async obtenerPorId(id: number) {
    const cliente = await findClienteById(id);
    if (!cliente) {
      throw new AppError("Cliente no encontrado", 404);
    }
    return cliente;
  }

  async actualizarPerfil(id: number, datos: { nombre?: string; telefono?: string }) {
    const cliente = await this.obtenerPorId(id);
    Object.assign(cliente, sinIndefinidos(datos));
    return clienteRepository().save(cliente);
  }

  async cambiarPassword(id: number, passwordActual: string, passwordNueva: string) {
    const cliente = await clienteRepository()
      .createQueryBuilder("cliente")
      .addSelect("cliente.password_hash")
      .where("cliente.id = :id", { id })
      .getOne();
    if (!cliente) {
      throw new AppError("Cliente no encontrado", 404);
    }

    const coincide = await bcrypt.compare(passwordActual, cliente.password_hash);
    if (!coincide) {
      throw new AppError("La contraseña actual es incorrecta", 400);
    }

    cliente.password_hash = await bcrypt.hash(passwordNueva, SALT_ROUNDS);
    await clienteRepository().save(cliente);
  }

  async actualizarComoAdministrador(
    id: number,
    datos: { nombre?: string; telefono?: string; activo?: boolean }
  ) {
    const cliente = await this.obtenerPorId(id);
    Object.assign(cliente, sinIndefinidos(datos));
    return clienteRepository().save(cliente);
  }
}
