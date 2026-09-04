import { apiFetch } from "./client";
import type { MetodoPago } from "../types/enums";
import type { PagoCliente } from "../types/entities";

export interface RegistrarPagoPayload {
  id_cuota?: number;
  monto: number;
  fecha_pago: string;
  metodo_pago: MetodoPago;
}

export function listarPorEvento(idEvento: number) {
  return apiFetch<PagoCliente[]>(`/eventos/${idEvento}/pagos`);
}

export function registrar(idEvento: number, datos: RegistrarPagoPayload, comprobante?: File) {
  const formData = new FormData();
  if (datos.id_cuota !== undefined) formData.append("id_cuota", String(datos.id_cuota));
  formData.append("monto", String(datos.monto));
  formData.append("fecha_pago", datos.fecha_pago);
  formData.append("metodo_pago", datos.metodo_pago);
  if (comprobante) formData.append("comprobante", comprobante);

  return apiFetch<PagoCliente>(`/eventos/${idEvento}/pagos`, { method: "POST", body: formData, isFormData: true });
}

export function validar(id: number, decision: "Validado" | "Rechazado") {
  return apiFetch<PagoCliente>(`/pagos/${id}/validar`, { method: "PUT", body: { decision } });
}
