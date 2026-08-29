import { AppDataSource } from "../config/data-source";
import { EventoProveedor } from "../entities/EventoProveedor";

export const eventoProveedorRepository = () => AppDataSource.getRepository(EventoProveedor);
