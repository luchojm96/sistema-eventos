import type { ReactNode } from "react";
import type { PlanPago } from "../../types/entities";
import { Badge } from "../ui/Badge";

interface Props {
  cuotas: PlanPago[];
  renderAcciones?: (cuota: PlanPago) => ReactNode;
}

export function PlanPagosTable({ cuotas, renderAcciones }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Cuota</th>
            <th className="px-4 py-3">Monto</th>
            <th className="px-4 py-3">Fecha límite</th>
            <th className="px-4 py-3">Estado</th>
            {renderAcciones && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {cuotas.length === 0 && (
            <tr>
              <td colSpan={renderAcciones ? 5 : 4} className="px-4 py-6 text-center text-slate-500">
                Todavía no hay un plan de pagos definido.
              </td>
            </tr>
          )}
          {cuotas.map((cuota) => (
            <tr key={cuota.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-900">#{cuota.numero_cuota}</td>
              <td className="px-4 py-3 text-slate-600">${cuota.monto}</td>
              <td className="px-4 py-3 text-slate-600">{cuota.fecha_limite}</td>
              <td className="px-4 py-3">
                <Badge color={cuota.pagada ? "green" : "amber"}>{cuota.pagada ? "Pagada" : "Pendiente"}</Badge>
              </td>
              {renderAcciones && <td className="px-4 py-3 text-right">{renderAcciones(cuota)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
