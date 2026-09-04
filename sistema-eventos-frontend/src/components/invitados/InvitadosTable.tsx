import type { ReactNode } from "react";
import type { Invitado } from "../../types/entities";
import { Badge } from "../ui/Badge";
import { COLOR_ESTADO_INVITADO } from "../../utils/estadoInvitado";

interface Props {
  invitados: Invitado[];
  renderAcciones?: (invitado: Invitado) => ReactNode;
}

export function InvitadosTable({ invitados, renderAcciones }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Contacto</th>
            <th className="px-4 py-3">Acompañantes</th>
            <th className="px-4 py-3">Estado</th>
            {renderAcciones && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {invitados.length === 0 && (
            <tr>
              <td colSpan={renderAcciones ? 5 : 4} className="px-4 py-6 text-center text-slate-500">
                Todavía no hay invitados.
              </td>
            </tr>
          )}
          {invitados.map((invitado) => (
            <tr key={invitado.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-900">
                {invitado.nombre} {invitado.apellido}
              </td>
              <td className="px-4 py-3 text-slate-600">{invitado.email ?? invitado.telefono ?? "—"}</td>
              <td className="px-4 py-3 text-slate-600">
                {invitado.acompanantes_confirmados ?? 0}/{invitado.acompanantes_permitidos}
              </td>
              <td className="px-4 py-3">
                <Badge color={COLOR_ESTADO_INVITADO[invitado.estado_confirmacion]}>
                  {invitado.estado_confirmacion}
                </Badge>
              </td>
              {renderAcciones && <td className="px-4 py-3 text-right">{renderAcciones(invitado)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
