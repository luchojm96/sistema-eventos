import { categoriaProveedorRepository } from "../repositories/categoriaProveedor.repository";
import { AppError } from "../utils/AppError";

export class CategoriaProveedorService {
  listar() {
    return categoriaProveedorRepository().find({ order: { id: "ASC" } });
  }

  crear(nombre: string) {
    const categoria = categoriaProveedorRepository().create({ nombre, activo: true });
    return categoriaProveedorRepository().save(categoria);
  }

  async actualizar(id: number, datos: { nombre?: string; activo?: boolean }) {
    const categoria = await categoriaProveedorRepository().findOneBy({ id });
    if (!categoria) {
      throw new AppError("Categoría de proveedor no encontrada", 404);
    }
    Object.assign(categoria, datos);
    return categoriaProveedorRepository().save(categoria);
  }
}
