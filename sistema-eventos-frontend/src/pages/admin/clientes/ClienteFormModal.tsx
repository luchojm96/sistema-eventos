import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as clientesApi from "../../../api/clientes.api";
import { ApiError } from "../../../api/client";
import { clientePerfilSchema, type ClientePerfilFormValues } from "../../../schemas/cliente.schema";
import { Modal } from "../../../components/ui/Modal";
import { TextField } from "../../../components/ui/TextField";
import { Button } from "../../../components/ui/Button";
import type { Cliente } from "../../../types/entities";

interface Props {
  cliente: Cliente;
  onClose: () => void;
  onGuardado: () => void;
}

export function ClienteFormModal({ cliente, onClose, onGuardado }: Props) {
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientePerfilFormValues>({
    resolver: zodResolver(clientePerfilSchema),
    defaultValues: { nombre: cliente.nombre, telefono: cliente.telefono },
  });

  async function onSubmit(values: ClientePerfilFormValues) {
    setErrorServidor(null);
    try {
      await clientesApi.actualizar(cliente.id, values);
      onGuardado();
    } catch (err) {
      setErrorServidor(err instanceof ApiError ? err.message : "No se pudo guardar el cliente");
    }
  }

  return (
    <Modal title="Editar cliente" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <p className="-mt-2 text-xs text-slate-500">Email: {cliente.email} (no editable).</p>
        <TextField label="Nombre" error={errors.nombre?.message} {...register("nombre")} />
        <TextField label="Teléfono" error={errors.telefono?.message} {...register("telefono")} />

        {errorServidor && <p className="text-sm text-red-600">{errorServidor}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
}
