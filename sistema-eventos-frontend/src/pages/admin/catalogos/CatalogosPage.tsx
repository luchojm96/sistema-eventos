import * as tiposEventoApi from "../../../api/tiposEvento.api";
import * as categoriasProveedorApi from "../../../api/categoriasProveedor.api";
import { CatalogoSimpleSection } from "../../../components/catalogos/CatalogoSimpleSection";

export function CatalogosPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 p-8">
      <CatalogoSimpleSection
        titulo="Tipos de evento"
        descripcion="Catálogo fijo usado al crear eventos. Un tipo desactivado deja de estar disponible para eventos nuevos, pero no afecta a los eventos que ya lo usan."
        labelNuevo="Nuevo tipo"
        listar={tiposEventoApi.listar}
        crear={tiposEventoApi.crear}
        actualizar={tiposEventoApi.actualizar}
      />
      <CatalogoSimpleSection
        titulo="Categorías de proveedor"
        descripcion="Catálogo fijo usado al registrar proveedores. Una categoría desactivada deja de estar disponible para proveedores nuevos."
        labelNuevo="Nueva categoría"
        listar={categoriasProveedorApi.listar}
        crear={categoriasProveedorApi.crear}
        actualizar={categoriasProveedorApi.actualizar}
      />
    </div>
  );
}
