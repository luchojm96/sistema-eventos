import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as planPagosApi from "../../../api/planPagos.api";
import { ApiError } from "../../../api/client";
import {
  crearNuevaCuotaSchema,
  type NuevaCuotaFormInput,
  type NuevaCuotaFormValues,
} from "../../../schemas/planPago.schema";
import { Modal } from "../../../components/ui/Modal";
import { TextField } from "../../../components/ui/TextField";
import { Button } from "../../../components/ui/Button";

interface Props {
  idEvento: number;
  presupuestoDisponible: number | null;
  onClose: () => void;
  onGuardado: () => void;
}

export function AgregarCuotaModal({ idEvento, presupuestoDisponible, onClose, onGuardado }: Props) {
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NuevaCuotaFormInput, unknown, NuevaCuotaFormValues>({
    resolver: zodResolver(crearNuevaCuotaSchema(presupuestoDisponible)),
  });

  async function onSubmit(values: NuevaCuotaFormValues) {
    setErrorServidor(null);
    try {
      await planPagosApi.agregarCuota(idEvento, values);
      onGuardado();
    } catch (err) {
      setErrorServidor(err instanceof ApiError ? err.message : "No se pudo agregar la cuota");
    }
  }

  return (
    <Modal title="Agregar cuota" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <p className="-mt-2 text-xs text-slate-500">El número de cuota se asigna automáticamente.</p>
        {presupuestoDisponible != null && (
          <p className="-mt-2 text-xs text-slate-500">
            Presupuesto disponible: Bs {presupuestoDisponible.toFixed(2)}
          </p>
        )}
        <TextField label="Monto" type="number" step="0.01" error={errors.monto?.message} {...register("monto")} />
        <TextField
          label="Fecha límite"
          type="date"
          error={errors.fecha_limite?.message}
          {...register("fecha_limite")}
        />

        {errorServidor && <p className="text-sm text-red-600">{errorServidor}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Agregar cuota
          </Button>
        </div>
      </form>
    </Modal>
  );
}
