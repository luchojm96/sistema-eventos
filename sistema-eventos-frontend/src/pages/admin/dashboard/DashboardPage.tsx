import { Link } from "react-router-dom";
import * as eventosApi from "../../../api/eventos.api";
import { useApiData } from "../../../hooks/useApiData";
import { Badge } from "../../../components/ui/Badge";
import { COLOR_ESTADO_EVENTO } from "../../../utils/estadoEvento";
import type { EstadoEvento } from "../../../types/enums";

const ESTADOS_ACTIVOS: EstadoEvento[] = ["Planificado", "Confirmado", "En curso"];

export function DashboardPage() {
  const { data: eventos, loading, error } = useApiData(() => eventosApi.listar());

  const eventosActivos = (eventos ?? []).filter((evento) => ESTADOS_ACTIVOS.includes(evento.estado));
  const proximosEventos = [...eventosActivos]
    .sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio))
    .slice(0, 5);

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>

      {loading && <p className="mt-6 text-sm text-slate-500">Cargando...</p>}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {eventos && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {ESTADOS_ACTIVOS.map((estado) => (
              <div key={estado} className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase text-slate-500">{estado}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {eventos.filter((evento) => evento.estado === estado).length}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Próximos eventos</h2>
              <Link to="/admin/eventos" className="text-sm font-medium text-slate-600 hover:underline">
                Ver todos
              </Link>
            </div>

            <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {proximosEventos.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                        No hay eventos activos.
                      </td>
                    </tr>
                  )}
                  {proximosEventos.map((evento) => (
                    <tr key={evento.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/eventos/${evento.id}`}
                          className="font-medium text-slate-900 hover:underline"
                        >
                          {evento.nombre}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{evento.cliente?.nombre ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{evento.fecha_inicio}</td>
                      <td className="px-4 py-3">
                        <Badge color={COLOR_ESTADO_EVENTO[evento.estado]}>{evento.estado}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
