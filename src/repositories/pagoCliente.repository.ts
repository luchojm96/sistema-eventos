import { AppDataSource } from "../config/data-source";
import { PagoCliente } from "../entities/PagoCliente";

export const pagoClienteRepository = () => AppDataSource.getRepository(PagoCliente);
