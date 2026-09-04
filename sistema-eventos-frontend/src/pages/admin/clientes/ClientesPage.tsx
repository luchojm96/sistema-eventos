import { useState } from "react";
import * as clientesApi from "../../../api/clientes.api";
import { useApiData } from "../../../hooks/useApiData";
import { Badge } from "../../../components/ui/Badge";
import { ClienteFormModal } from "./ClienteFormModal";
import type { Cliente } from "../../../types/entities";

export function ClientesPage() {
  const { data: clientes, loading, error, refetch } = useApiData(() => clientesApi.listar());
  const [modal, setModal] = useState<Cliente | null>(null);

  async function toggleActivo(cliente: Cliente) {
    await clientesApi.actualizar(cliente.id, { activo: !cliente.activo });
    refetch();
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-slate-900">Clientes</h1>

      {loading && <p className="mt-6 text-sm text-slate-500">Cargando...</p>}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {clientes && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {clientes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Todavía no hay clientes registrados.
                  </td>
                </tr>
              )}
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{cliente.nombre}</td>
                  <td className="px-4 py-3 text-slate-600">{cliente.email}</td>
                  <td className="px-4 py-3 text-slate-600">{cliente.telefono ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge color={cliente.activo ? "green" : "slate"}>
                      {cliente.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3 text-sm">
                      <button
                        className="font-medium text-slate-600 hover:underline"
                        onClick={() => setModal(cliente)}
                      >
                        Editar
                      </button>
                      <button
                        className="font-medium text-slate-600 hover:underline"
                        onClick={() => toggleActivo(cliente)}
                      >
                        {cliente.activo ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <ClienteFormModal
          cliente={modal}
          onClose={() => setModal(null)}
          onGuardado={() => {
            setModal(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
