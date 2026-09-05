import type { PagoProveedor } from "../../types/entities";

export function PagosProveedorTable({ pagos }: { pagos: PagoProveedor[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Proveedor</th>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Monto</th>
            <th className="px-4 py-3">Método</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {pagos.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                Todavía no hay egresos registrados.
              </td>
            </tr>
          )}
          {pagos.map((pago) => (
            <tr key={pago.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-900">
                {pago.eventoProveedor?.proveedor?.nombre_empresa ?? "—"}
              </td>
              <td className="px-4 py-3 text-slate-600">{pago.fecha_pago}</td>
              <td className="px-4 py-3 text-slate-600">Bs {pago.monto}</td>
              <td className="px-4 py-3 text-slate-600">{pago.metodo_pago}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
