import { apiFetch } from "./client";
import type { TipoEvento } from "../types/entities";

export function listar() {
  return apiFetch<TipoEvento[]>("/tipos-evento");
}

export function crear(nombre: string) {
  return apiFetch<TipoEvento>("/tipos-evento", { method: "POST", body: { nombre } });
}

export function actualizar(id: number, datos: { nombre?: string; activo?: boolean }) {
  return apiFetch<TipoEvento>(`/tipos-evento/${id}`, { method: "PUT", body: datos });
}
