import { apiFetch } from "./client";
import type { Proveedor } from "../types/entities";

export interface CrearProveedorPayload {
  nombre_empresa: string;
  id_categoria: number;
  contacto_nombre?: string;
  telefono?: string;
  email?: string;
}

export type ActualizarProveedorPayload = Partial<CrearProveedorPayload> & { activo?: boolean };

export function listar() {
  return apiFetch<Proveedor[]>("/proveedores");
}

export function crear(datos: CrearProveedorPayload) {
  return apiFetch<Proveedor>("/proveedores", { method: "POST", body: datos });
}

export function actualizar(id: number, datos: ActualizarProveedorPayload) {
  return apiFetch<Proveedor>(`/proveedores/${id}`, { method: "PUT", body: datos });
}
