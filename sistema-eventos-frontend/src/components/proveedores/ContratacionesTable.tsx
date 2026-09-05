import type { ReactNode } from "react";
import type { EventoProveedor } from "../../types/entities";
import { Badge } from "../ui/Badge";
import { COLOR_ESTADO_CONTRATO } from "../../utils/estadoContrato";

interface Props {
  contrataciones: EventoProveedor[];
  renderAcciones?: (contratacion: EventoProveedor) => ReactNode;
}

export function ContratacionesTable({ contrataciones, renderAcciones }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Proveedor</th>
            <th className="px-4 py-3">Servicio</th>
            <th className="px-4 py-3">Costo</th>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Estado</th>
            {renderAcciones && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {contrataciones.length === 0 && (
            <tr>
              <td colSpan={renderAcciones ? 6 : 5} className="px-4 py-6 text-center text-slate-500">
                Todavía no hay proveedores contratados.
              </td>
            </tr>
          )}
          {contrataciones.map((contratacion) => (
            <tr key={contratacion.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-900">
                {contratacion.proveedor?.nombre_empresa ?? "—"}
                <div className="text-xs font-normal text-slate-500">{contratacion.proveedor?.categoria?.nombre}</div>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {contratacion.descripcion_servicio ?? "—"}
                {contratacion.cantidad ? ` · x${contratacion.cantidad}` : ""}
              </td>
              <td className="px-4 py-3 text-slate-600">Bs {contratacion.costo_acordado}</td>
              <td className="px-4 py-3 text-slate-600">
                {contratacion.fecha_servicio}
                {contratacion.hora_inicio ? ` ${contratacion.hora_inicio}` : ""}
                {contratacion.hora_fin ? ` – ${contratacion.hora_fin}` : ""}
              </td>
              <td className="px-4 py-3">
                <Badge color={COLOR_ESTADO_CONTRATO[contratacion.estado_contrato]}>
                  {contratacion.estado_contrato}
                </Badge>
              </td>
              {renderAcciones && <td className="px-4 py-3 text-right">{renderAcciones(contratacion)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
