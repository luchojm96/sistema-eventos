import { useState } from "react";
import * as proveedoresApi from "../../../api/proveedores.api";
import * as categoriasProveedorApi from "../../../api/categoriasProveedor.api";
import { useApiData } from "../../../hooks/useApiData";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { ProveedorFormModal } from "./ProveedorFormModal";
import type { Proveedor } from "../../../types/entities";

export function ProveedoresPage() {
  const { data: proveedores, loading, error, refetch } = useApiData(() => proveedoresApi.listar());
  const { data: categorias } = useApiData(() => categoriasProveedorApi.listar());
  const [modal, setModal] = useState<"nuevo" | Proveedor | null>(null);

  async function toggleActivo(proveedor: Proveedor) {
    await proveedoresApi.actualizar(proveedor.id, { activo: !proveedor.activo });
    refetch();
  }

  return (
    <div className="p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Proveedores</h1>
        <Button onClick={() => setModal("nuevo")}>Nuevo proveedor</Button>
      </div>

      {loading && <p className="mt-6 text-sm text-slate-500">Cargando...</p>}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {proveedores && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {proveedores.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Todavía no hay proveedores.
                  </td>
                </tr>
              )}
              {proveedores.map((proveedor) => (
                <tr key={proveedor.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{proveedor.nombre_empresa}</td>
                  <td className="px-4 py-3 text-slate-600">{proveedor.categoria?.nombre ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {proveedor.contacto_nombre ?? "—"}
                    {proveedor.email ? ` · ${proveedor.email}` : ""}
                    {proveedor.telefono ? ` · ${proveedor.telefono}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={proveedor.activo ? "green" : "slate"}>
                      {proveedor.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3 text-sm">
                      <button
                        className="font-medium text-slate-600 hover:underline"
                        onClick={() => setModal(proveedor)}
                      >
                        Editar
                      </button>
                      <button
                        className="font-medium text-slate-600 hover:underline"
                        onClick={() => toggleActivo(proveedor)}
                      >
                        {proveedor.activo ? "Desactivar" : "Activar"}
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
        <ProveedorFormModal
          categorias={categorias ?? []}
          proveedor={modal === "nuevo" ? null : modal}
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
