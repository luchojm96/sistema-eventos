import { apiFetch } from "./client";
import type { PlanPago } from "../types/entities";

export interface CuotaPayload {
  numero_cuota: number;
  monto: number;
  fecha_limite: string;
}

export function obtener(idEvento: number) {
  return apiFetch<PlanPago[]>(`/eventos/${idEvento}/plan-pagos`);
}

export function crear(idEvento: number, cuotas: CuotaPayload[]) {
  return apiFetch<PlanPago[]>(`/eventos/${idEvento}/plan-pagos`, { method: "POST", body: { cuotas } });
}

export function agregarCuota(idEvento: number, datos: { monto: number; fecha_limite: string }) {
  return apiFetch<PlanPago>(`/eventos/${idEvento}/plan-pagos/cuotas`, { method: "POST", body: datos });
}

export function actualizarCuota(cuotaId: number, datos: Partial<CuotaPayload>) {
  return apiFetch<PlanPago>(`/plan-pagos/${cuotaId}`, { method: "PUT", body: datos });
}
