import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as invitadosApi from "../../../api/invitados.api";
import { ApiError } from "../../../api/client";
import { invitadoSchema, type InvitadoFormInput, type InvitadoFormValues } from "../../../schemas/invitado.schema";
import { Modal } from "../../../components/ui/Modal";
import { TextField } from "../../../components/ui/TextField";
import { Button } from "../../../components/ui/Button";
import type { Invitado } from "../../../types/entities";

interface Props {
  idEvento: number;
  invitado?: Invitado | null;
  onClose: () => void;
  onGuardado: () => void;
}

export function InvitadoFormModal({ idEvento, invitado, onClose, onGuardado }: Props) {
  const modoEdicion = Boolean(invitado);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvitadoFormInput, unknown, InvitadoFormValues>({
    resolver: zodResolver(invitadoSchema),
    defaultValues: invitado
      ? {
          nombre: invitado.nombre,
          apellido: invitado.apellido,
          email: invitado.email,
          telefono: invitado.telefono,
          acompanantes_permitidos: invitado.acompanantes_permitidos,
          notas_especiales: invitado.notas_especiales,
        }
      : undefined,
  });

  async function onSubmit(values: InvitadoFormValues) {
    setErrorServidor(null);
    try {
      if (modoEdicion && invitado) {
        await invitadosApi.actualizar(invitado.id, values);
      } else {
        await invitadosApi.crear(idEvento, values);
      }
      onGuardado();
    } catch (err) {
      setErrorServidor(err instanceof ApiError ? err.message : "No se pudo guardar el invitado");
    }
  }

  return (
    <Modal title={modoEdicion ? "Editar invitado" : "Agregar invitado"} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Nombre" error={errors.nombre?.message} {...register("nombre")} />
          <TextField label="Apellido" error={errors.apellido?.message} {...register("apellido")} />
        </div>
        <TextField label="Email" type="email" error={errors.email?.message} {...register("email")} />
        <TextField label="Teléfono" error={errors.telefono?.message} {...register("telefono")} />
        <TextField
          label="Acompañantes permitidos"
          type="number"
          error={errors.acompanantes_permitidos?.message}
          {...register("acompanantes_permitidos")}
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="notas_especiales" className="text-sm font-medium text-slate-700">
            Notas especiales
          </label>
          <textarea
            id="notas_especiales"
            rows={2}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
            {...register("notas_especiales")}
          />
        </div>

        {errorServidor && <p className="text-sm text-red-600">{errorServidor}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {modoEdicion ? "Guardar cambios" : "Agregar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
