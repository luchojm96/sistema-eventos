import { apiFetch } from "./client";
import type { Cliente } from "../types/entities";

export function listar() {
  return apiFetch<Cliente[]>("/clientes");
}

export function obtener(id: number) {
  return apiFetch<Cliente>(`/clientes/${id}`);
}

export function obtenerPerfil() {
  return apiFetch<Cliente>("/clientes/me");
}

export function actualizar(id: number, datos: { nombre?: string; telefono?: string; activo?: boolean }) {
  return apiFetch<Cliente>(`/clientes/${id}`, { method: "PUT", body: datos });
}

export function actualizarPerfil(datos: { nombre?: string; telefono?: string }) {
  return apiFetch<Cliente>("/clientes/me", { method: "PUT", body: datos });
}

export function cambiarPassword(datos: { password_actual: string; password_nueva: string }) {
  return apiFetch<{ message: string }>("/clientes/me/password", { method: "PUT", body: datos });
}
