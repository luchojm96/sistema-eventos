import * as reportesApi from "../../../api/reportes.api";
import { useApiData } from "../../../hooks/useApiData";

export function ReportesPage() {
  const { data: ranking, loading, error } = useApiData(() => reportesApi.proveedoresMasContratados());

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-xl font-semibold text-slate-900">Proveedores más contratados</h1>
      <p className="mt-1 text-sm text-slate-500">Ranking general por cantidad de contrataciones, en todos los eventos.</p>

      {loading && <p className="mt-6 text-sm text-slate-500">Cargando...</p>}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {ranking && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Proveedor</th>
                <th className="px-4 py-3">Veces contratado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {ranking.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-slate-500">
                    Todavía no hay contrataciones registradas.
                  </td>
                </tr>
              )}
              {ranking.map((proveedor) => (
                <tr key={proveedor.id_proveedor} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{proveedor.nombre_empresa}</td>
                  <td className="px-4 py-3 text-slate-600">{proveedor.vecesContratado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
