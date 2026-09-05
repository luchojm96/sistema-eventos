import { useApiData } from "../../hooks/useApiData";
import * as reportesApi from "../../api/reportes.api";

interface Props {
  idEvento: number;
  // Se incrementa desde el padre cada vez que algo que afecta a estos números
  // cambia (plan de pagos, ingresos, egresos, invitados) para forzar el refetch.
  refreshKey?: number;
}

export function ReporteEventoSection({ idEvento, refreshKey = 0 }: Props) {
  const { data: asistencia, loading: cargandoAsistencia } = useApiData(
    () => reportesApi.asistencia(idEvento),
    [idEvento, refreshKey],
  );
  const { data: financiero, loading: cargandoFinanciero } = useApiData(
    () => reportesApi.financiero(idEvento),
    [idEvento, refreshKey],
  );

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-slate-900">Reportes</h2>

      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-900">Asistencia</h3>
          {cargandoAsistencia && <p className="mt-2 text-sm text-slate-500">Cargando...</p>}
          {asistencia && (
            <dl className="mt-2 grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-slate-500">Total invitados</dt>
              <dd className="text-right text-slate-900">{asistencia.resumen.total}</dd>
              <dt className="text-slate-500">Confirmados</dt>
              <dd className="text-right text-slate-900">{asistencia.resumen.confirmados}</dd>
              <dt className="text-slate-500">Pendientes</dt>
              <dd className="text-right text-slate-900">{asistencia.resumen.pendientes}</dd>
              <dt className="text-slate-500">Rechazados</dt>
              <dd className="text-right text-slate-900">{asistencia.resumen.rechazados}</dd>
            </dl>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-900">Financiero — Ingresos</h3>
          {cargandoFinanciero && <p className="mt-2 text-sm text-slate-500">Cargando...</p>}
          {financiero && (
            <dl className="mt-2 grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-slate-500">Total del plan</dt>
              <dd className="text-right text-slate-900">Bs {financiero.ingresos.totalPlan}</dd>
              <dt className="text-slate-500">Validado</dt>
              <dd className="text-right text-slate-900">Bs {financiero.ingresos.totalValidado}</dd>
              <dt className="text-slate-500">Reportado (sin validar)</dt>
              <dd className="text-right text-slate-900">Bs {financiero.ingresos.totalReportadoPendienteValidacion}</dd>
              <dt className="text-slate-500">Saldo pendiente</dt>
              <dd className="text-right text-slate-900">Bs {financiero.ingresos.saldoPendiente}</dd>
            </dl>
          )}
        </div>

        {financiero?.egresos && (
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900">Financiero — Egresos</h3>
            <dl className="mt-2 grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-slate-500">Costo acordado total</dt>
              <dd className="text-right text-slate-900">Bs {financiero.egresos.totalCostoAcordado}</dd>
              <dt className="text-slate-500">Pagado</dt>
              <dd className="text-right text-slate-900">Bs {financiero.egresos.totalPagado}</dd>
              <dt className="text-slate-500">Saldo pendiente</dt>
              <dd className="text-right text-slate-900">Bs {financiero.egresos.saldoPendiente}</dd>
            </dl>
          </div>
        )}

        {financiero?.rentabilidad !== undefined && (
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900">Rentabilidad</h3>
            <p className="mt-2 text-2xl font-semibold text-slate-900">Bs {financiero.rentabilidad}</p>
            <p className="mt-1 text-xs text-slate-500">Ingresos validados − egresos a proveedores.</p>
          </div>
        )}
      </div>
    </section>
  );
}
