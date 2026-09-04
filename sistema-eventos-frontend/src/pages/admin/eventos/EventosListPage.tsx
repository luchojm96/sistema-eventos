import { Link } from "react-router-dom";
import * as eventosApi from "../../../api/eventos.api";
import { useApiData } from "../../../hooks/useApiData";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { COLOR_ESTADO_EVENTO } from "../../../utils/estadoEvento";

export function EventosListPage() {
  const { data: eventos, loading, error } = useApiData(() => eventosApi.listar());

  return (
    <div className="p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Eventos</h1>
        <Link to="/admin/eventos/nuevo">
          <Button>Nuevo evento</Button>
        </Link>
      </div>

      {loading && <p className="mt-6 text-sm text-slate-500">Cargando...</p>}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {eventos && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Fechas</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {eventos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Todavía no hay eventos.
                  </td>
                </tr>
              )}
              {eventos.map((evento) => (
                <tr key={evento.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/eventos/${evento.id}`} className="font-medium text-slate-900 hover:underline">
                      {evento.nombre}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{evento.tipoEvento?.nombre ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{evento.cliente?.nombre ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {evento.fecha_inicio}
                    {evento.fecha_fin !== evento.fecha_inicio ? ` – ${evento.fecha_fin}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={COLOR_ESTADO_EVENTO[evento.estado]}>{evento.estado}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
