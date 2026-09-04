import { Link } from "react-router-dom";
import * as eventosApi from "../../../api/eventos.api";
import { useApiData } from "../../../hooks/useApiData";
import { Badge } from "../../../components/ui/Badge";
import { COLOR_ESTADO_EVENTO } from "../../../utils/estadoEvento";

export function MisEventosPage() {
  const { data: eventos, loading, error } = useApiData(() => eventosApi.misEventos());

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-slate-900">Mis eventos</h1>

      {loading && <p className="mt-6 text-sm text-slate-500">Cargando...</p>}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {eventos && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Fechas</th>
                <th className="px-4 py-3">Ubicación</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {eventos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Todavía no tenés eventos asignados.
                  </td>
                </tr>
              )}
              {eventos.map((evento) => (
                <tr key={evento.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/cliente/eventos/${evento.id}`} className="font-medium text-slate-900 hover:underline">
                      {evento.nombre}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{evento.tipoEvento?.nombre ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {evento.fecha_inicio}
                    {evento.fecha_fin !== evento.fecha_inicio ? ` – ${evento.fecha_fin}` : ""}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{evento.ubicacion}</td>
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
