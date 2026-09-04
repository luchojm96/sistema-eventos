import { apiFetch } from "./client";
import type { CategoriaProveedor } from "../types/entities";

export function listar() {
  return apiFetch<CategoriaProveedor[]>("/categorias-proveedor");
}

export function crear(nombre: string) {
  return apiFetch<CategoriaProveedor>("/categorias-proveedor", { method: "POST", body: { nombre } });
}

export function actualizar(id: number, datos: { nombre?: string; activo?: boolean }) {
  return apiFetch<CategoriaProveedor>(`/categorias-proveedor/${id}`, { method: "PUT", body: datos });
}
