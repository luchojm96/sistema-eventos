import type { ReactNode } from "react";
import type { PagoCliente } from "../../types/entities";
import { Badge } from "../ui/Badge";
import { COLOR_ESTADO_PAGO_CLIENTE } from "../../utils/estadoPagoCliente";
import { API_ORIGIN } from "../../api/client";

interface Props {
  pagos: PagoCliente[];
  renderAcciones?: (pago: PagoCliente) => ReactNode;
}

export function PagosClienteTable({ pagos, renderAcciones }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Monto</th>
            <th className="px-4 py-3">Método</th>
            <th className="px-4 py-3">Registrado por</th>
            <th className="px-4 py-3">Comprobante</th>
            <th className="px-4 py-3">Estado</th>
            {renderAcciones && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {pagos.length === 0 && (
            <tr>
              <td colSpan={renderAcciones ? 7 : 6} className="px-4 py-6 text-center text-slate-500">
                Todavía no hay pagos registrados.
              </td>
            </tr>
          )}
          {pagos.map((pago) => (
            <tr key={pago.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-slate-600">{pago.fecha_pago}</td>
              <td className="px-4 py-3 font-medium text-slate-900">${pago.monto}</td>
              <td className="px-4 py-3 text-slate-600">{pago.metodo_pago}</td>
              <td className="px-4 py-3 text-slate-600">{pago.registrado_por}</td>
              <td className="px-4 py-3">
                {pago.comprobante_url ? (
                  <a
                    href={`${API_ORIGIN}${pago.comprobante_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-900 underline"
                  >
                    Ver
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3">
                <Badge color={COLOR_ESTADO_PAGO_CLIENTE[pago.estado]}>{pago.estado}</Badge>
              </td>
              {renderAcciones && <td className="px-4 py-3 text-right">{renderAcciones(pago)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
