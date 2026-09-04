import { apiFetch } from "./client";
import type { ProveedorRanking, ReporteAsistencia, ReporteFinanciero } from "../types/reportes";

export function asistencia(idEvento: number) {
  return apiFetch<ReporteAsistencia>(`/reportes/asistencia/${idEvento}`);
}

export function financiero(idEvento: number) {
  return apiFetch<ReporteFinanciero>(`/reportes/financiero/${idEvento}`);
}

export function proveedoresMasContratados() {
  return apiFetch<ProveedorRanking[]>("/reportes/proveedores");
}
