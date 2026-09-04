import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as proveedoresApi from "../../../api/proveedores.api";
import { ApiError } from "../../../api/client";
import { proveedorSchema, type ProveedorFormInput, type ProveedorFormValues } from "../../../schemas/proveedor.schema";
import { Modal } from "../../../components/ui/Modal";
import { TextField } from "../../../components/ui/TextField";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import type { CategoriaProveedor, Proveedor } from "../../../types/entities";

interface Props {
  categorias: CategoriaProveedor[];
  proveedor?: Proveedor | null;
  onClose: () => void;
  onGuardado: () => void;
}

export function ProveedorFormModal({ categorias, proveedor, onClose, onGuardado }: Props) {
  const modoEdicion = Boolean(proveedor);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProveedorFormInput, unknown, ProveedorFormValues>({
    resolver: zodResolver(proveedorSchema),
    defaultValues: proveedor
      ? {
          nombre_empresa: proveedor.nombre_empresa,
          id_categoria: proveedor.id_categoria,
          contacto_nombre: proveedor.contacto_nombre,
          telefono: proveedor.telefono,
          email: proveedor.email,
        }
      : undefined,
  });

  // Una categoría inactiva asociada al proveedor que se está editando igual debe verse en el select.
  const categoriasDisponibles = categorias.filter((cat) => cat.activo || cat.id === proveedor?.id_categoria);

  async function onSubmit(values: ProveedorFormValues) {
    setErrorServidor(null);
    try {
      if (modoEdicion && proveedor) {
        await proveedoresApi.actualizar(proveedor.id, values);
      } else {
        await proveedoresApi.crear(values);
      }
      onGuardado();
    } catch (err) {
      setErrorServidor(err instanceof ApiError ? err.message : "No se pudo guardar el proveedor");
    }
  }

  return (
    <Modal title={modoEdicion ? "Editar proveedor" : "Nuevo proveedor"} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextField label="Nombre de la empresa" error={errors.nombre_empresa?.message} {...register("nombre_empresa")} />

        <Select label="Categoría" error={errors.id_categoria?.message} {...register("id_categoria")}>
          <option value="">Seleccioná una categoría</option>
          {categoriasDisponibles.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
              {!cat.activo ? " (inactiva)" : ""}
            </option>
          ))}
        </Select>

        <TextField label="Nombre de contacto" error={errors.contacto_nombre?.message} {...register("contacto_nombre")} />
        <TextField label="Teléfono" error={errors.telefono?.message} {...register("telefono")} />
        <TextField label="Email" type="email" error={errors.email?.message} {...register("email")} />

        {errorServidor && <p className="text-sm text-red-600">{errorServidor}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {modoEdicion ? "Guardar cambios" : "Crear proveedor"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
