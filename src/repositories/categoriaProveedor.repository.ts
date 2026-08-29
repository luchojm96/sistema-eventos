import { AppDataSource } from "../config/data-source";
import { CategoriaProveedor } from "../entities/CategoriaProveedor";

export const categoriaProveedorRepository = () => AppDataSource.getRepository(CategoriaProveedor);
