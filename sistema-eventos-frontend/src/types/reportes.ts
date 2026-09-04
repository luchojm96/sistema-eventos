import type { EventoProveedor, Invitado, PagoCliente, PagoProveedor, PlanPago } from "./entities";

export interface ReporteAsistencia {
  resumen: { total: number; confirmados: number; pendientes: number; rechazados: number };
  invitados: Invitado[];
}

export interface IngresosFinanciero {
  totalPlan: number;
  totalValidado: number;
  totalReportadoPendienteValidacion: number;
  saldoPendiente: number;
  planPagos: PlanPago[];
  pagos: PagoCliente[];
}

export interface EgresosFinanciero {
  totalCostoAcordado: number;
  totalPagado: number;
  saldoPendiente: number;
  contrataciones: EventoProveedor[];
  pagos: PagoProveedor[];
}

export interface ReporteFinanciero {
  ingresos: IngresosFinanciero;
  egresos?: EgresosFinanciero;
  rentabilidad?: number;
}

export interface ProveedorRanking {
  id_proveedor: number;
  nombre_empresa: string;
  vecesContratado: number;
}
