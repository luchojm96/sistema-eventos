import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as planPagosApi from "../../../api/planPagos.api";
import { ApiError } from "../../../api/client";
import { cuotaSchema, type CuotaFormInput, type CuotaFormValues } from "../../../schemas/planPago.schema";
import { Modal } from "../../../components/ui/Modal";
import { TextField } from "../../../components/ui/TextField";
import { Button } from "../../../components/ui/Button";
import type { PlanPago } from "../../../types/entities";

interface Props {
  cuota: PlanPago;
  onClose: () => void;
  onGuardado: () => void;
}

export function CuotaEditModal({ cuota, onClose, onGuardado }: Props) {
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CuotaFormInput, unknown, CuotaFormValues>({
    resolver: zodResolver(cuotaSchema),
    defaultValues: {
      numero_cuota: cuota.numero_cuota,
      monto: Number(cuota.monto),
      fecha_limite: cuota.fecha_limite,
    },
  });

  async function onSubmit(values: CuotaFormValues) {
    setErrorServidor(null);
    try {
      await planPagosApi.actualizarCuota(cuota.id, values);
      onGuardado();
    } catch (err) {
      setErrorServidor(err instanceof ApiError ? err.message : "No se pudo actualizar la cuota");
    }
  }

  return (
    <Modal title={`Editar cuota #${cuota.numero_cuota}`} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextField label="N° cuota" type="number" error={errors.numero_cuota?.message} {...register("numero_cuota")} />
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
            Guardar cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
}
