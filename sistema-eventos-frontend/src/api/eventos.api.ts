import { apiFetch } from "./client";
import type { EstadoEvento } from "../types/enums";
import type { Evento, ResumenEvento } from "../types/entities";

export interface CrearEventoPayload {
  nombre: string;
  id_tipo_evento: number;
  id_cliente: number;
  fecha_inicio: string;
  fecha_fin: string;
  ubicacion: string;
  capacidad_estimada?: number;
  presupuesto_estimado?: number;
  descripcion?: string;
  dias_anticipacion_recordatorio?: number;
}

export type ActualizarEventoPayload = Partial<CrearEventoPayload> & { estado?: EstadoEvento };

export function listar() {
  return apiFetch<Evento[]>("/eventos");
}

export function misEventos() {
  return apiFetch<Evento[]>("/mis-eventos");
}

export function obtener(id: number) {
  return apiFetch<Evento>(`/eventos/${id}`);
}

export function crear(datos: CrearEventoPayload) {
  return apiFetch<Evento>("/eventos", { method: "POST", body: datos });
}

export function actualizar(id: number, datos: ActualizarEventoPayload) {
  return apiFetch<Evento>(`/eventos/${id}`, { method: "PUT", body: datos });
}

export function cancelar(id: number) {
  return apiFetch<Evento>(`/eventos/${id}/cancelar`, { method: "POST" });
}

export function resumen(id: number) {
  return apiFetch<ResumenEvento>(`/eventos/${id}/resumen`);
}
