import { AppDataSource } from "../config/data-source";
import { Proveedor } from "../entities/Proveedor";

export const proveedorRepository = () => AppDataSource.getRepository(Proveedor);
