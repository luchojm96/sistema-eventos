import { AppDataSource } from "../config/data-source";
import { PagoProveedor } from "../entities/PagoProveedor";

export const pagoProveedorRepository = () => AppDataSource.getRepository(PagoProveedor);
