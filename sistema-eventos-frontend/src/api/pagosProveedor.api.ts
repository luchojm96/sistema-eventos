import { apiFetch } from "./client";
import type { MetodoPago } from "../types/enums";
import type { PagoProveedor } from "../types/entities";

export interface RegistrarEgresoPayload {
  id_evento_proveedor: number;
  monto: number;
  fecha_pago: string;
  metodo_pago: MetodoPago;
}

export function listarPorEvento(idEvento: number) {
  return apiFetch<PagoProveedor[]>(`/eventos/${idEvento}/egresos`);
}

export function registrar(idEvento: number, datos: RegistrarEgresoPayload) {
  return apiFetch<PagoProveedor>(`/eventos/${idEvento}/egresos`, { method: "POST", body: datos });
}
