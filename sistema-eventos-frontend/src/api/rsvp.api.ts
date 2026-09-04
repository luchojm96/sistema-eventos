import { apiFetch } from "./client";
import type { EstadoConfirmacionInvitado } from "../types/enums";

export interface RsvpData {
  finalizado: boolean;
  evento: {
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    ubicacion: string;
  };
  invitado: {
    nombre: string;
    apellido: string;
    acompanantes_permitidos: number;
    estado_confirmacion: EstadoConfirmacionInvitado;
    notas_especiales?: string;
  };
}

export interface ResponderRsvpPayload {
  confirma: boolean;
  acompanantes?: number;
  notas_especiales?: string;
}

export interface ResponderRsvpResult {
  estado_confirmacion: EstadoConfirmacionInvitado;
  acompanantes_confirmados?: number;
}

export function obtener(token: string) {
  return apiFetch<RsvpData>(`/rsvp/${token}`);
}

export function responder(token: string, datos: ResponderRsvpPayload) {
  return apiFetch<ResponderRsvpResult>(`/rsvp/${token}`, { method: "POST", body: datos });
}
