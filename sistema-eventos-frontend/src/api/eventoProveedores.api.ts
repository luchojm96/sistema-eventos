import { apiFetch } from "./client";
import type { EstadoContrato } from "../types/enums";
import type { EventoProveedor } from "../types/entities";

export interface ContratarProveedorPayload {
  id_proveedor: number;
  descripcion_servicio?: string;
  costo_acordado: number;
  fecha_servicio: string;
  hora_inicio?: string;
  hora_fin?: string;
  cantidad?: number;
}

export interface ActualizarContratacionPayload {
  descripcion_servicio?: string;
  costo_acordado?: number;
  fecha_servicio?: string;
  hora_inicio?: string;
  hora_fin?: string;
  cantidad?: number;
  estado_contrato?: EstadoContrato;
}

export function listarPorEvento(idEvento: number) {
  return apiFetch<EventoProveedor[]>(`/eventos/${idEvento}/proveedores`);
}

export function contratar(idEvento: number, datos: ContratarProveedorPayload) {
  return apiFetch<EventoProveedor>(`/eventos/${idEvento}/proveedores`, { method: "POST", body: datos });
}

export function actualizar(idEvento: number, contratacionId: number, datos: ActualizarContratacionPayload) {
  return apiFetch<EventoProveedor>(`/eventos/${idEvento}/proveedores/${contratacionId}`, {
    method: "PUT",
    body: datos,
  });
}

export function cancelar(idEvento: number, contratacionId: number) {
  return apiFetch<EventoProveedor>(`/eventos/${idEvento}/proveedores/${contratacionId}`, { method: "DELETE" });
}
