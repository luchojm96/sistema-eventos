import { proveedorRepository } from "../repositories/proveedor.repository";
import { AppError } from "../utils/AppError";

interface ProveedorInput {
  nombre_empresa: string;
  id_categoria: number;
  contacto_nombre?: string;
  telefono?: string;
  email?: string;
}

export class ProveedorService {
  listar() {
    return proveedorRepository().find({ relations: ["categoria"], order: { nombre_empresa: "ASC" } });
  }

  async obtenerPorId(id: number) {
    const proveedor = await proveedorRepository().findOne({ where: { id }, relations: ["categoria"] });
    if (!proveedor) {
      throw new AppError("Proveedor no encontrado", 404);
    }
    return proveedor;
  }

  crear(datos: ProveedorInput) {
    const proveedor = proveedorRepository().create(datos);
    return proveedorRepository().save(proveedor);
  }

  async actualizar(id: number, datos: Partial<ProveedorInput> & { activo?: boolean }) {
    const proveedor = await this.obtenerPorId(id);
    Object.assign(proveedor, datos);
    return proveedorRepository().save(proveedor);
  }
}
