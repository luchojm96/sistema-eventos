import { apiFetch } from "./client";
import type { Invitado } from "../types/entities";

export interface CrearInvitadoPayload {
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  acompanantes_permitidos?: number;
  notas_especiales?: string;
}

export type ActualizarInvitadoPayload = Partial<CrearInvitadoPayload>;

export function listarPorEvento(idEvento: number) {
  return apiFetch<Invitado[]>(`/eventos/${idEvento}/invitados`);
}

export function crear(idEvento: number, datos: CrearInvitadoPayload) {
  return apiFetch<Invitado>(`/eventos/${idEvento}/invitados`, { method: "POST", body: datos });
}

export function importar(idEvento: number, archivo: File) {
  const formData = new FormData();
  formData.append("archivo", archivo);
  return apiFetch<{ creados: number; invitados: Invitado[] }>(`/eventos/${idEvento}/invitados/importar`, {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

export function actualizar(id: number, datos: ActualizarInvitadoPayload) {
  return apiFetch<Invitado>(`/invitados/${id}`, { method: "PUT", body: datos });
}

export function eliminar(id: number) {
  return apiFetch<void>(`/invitados/${id}`, { method: "DELETE" });
}

export function reenviarInvitacion(id: number) {
  return apiFetch<Invitado>(`/invitados/${id}/reenviar-invitacion`, { method: "POST" });
}
