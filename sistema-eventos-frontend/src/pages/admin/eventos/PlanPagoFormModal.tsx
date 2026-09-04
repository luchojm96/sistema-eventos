import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as planPagosApi from "../../../api/planPagos.api";
import { ApiError } from "../../../api/client";
import {
  planPagoSchema,
  type PlanPagoFormInput,
  type PlanPagoFormValues,
} from "../../../schemas/planPago.schema";
import { Modal } from "../../../components/ui/Modal";
import { TextField } from "../../../components/ui/TextField";
import { Button } from "../../../components/ui/Button";

interface Props {
  idEvento: number;
  onClose: () => void;
  onGuardado: () => void;
}

export function PlanPagoFormModal({ idEvento, onClose, onGuardado }: Props) {
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlanPagoFormInput, unknown, PlanPagoFormValues>({
    resolver: zodResolver(planPagoSchema),
    defaultValues: { cuotas: [{ numero_cuota: 1, monto: undefined, fecha_limite: "" }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "cuotas" });

  async function onSubmit(values: PlanPagoFormValues) {
    setErrorServidor(null);
    try {
      await planPagosApi.crear(idEvento, values.cuotas);
      onGuardado();
    } catch (err) {
      setErrorServidor(err instanceof ApiError ? err.message : "No se pudo crear el plan de pagos");
    }
  }

  return (
    <Modal title="Definir plan de pagos" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {errors.cuotas?.root?.message && <p className="text-sm text-red-600">{errors.cuotas.root.message}</p>}

        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-wrap items-end gap-2 rounded-md border border-slate-200 p-3">
              <div className="w-20 min-w-0">
                <TextField
                  label="N° cuota"
                  type="number"
                  error={errors.cuotas?.[index]?.numero_cuota?.message}
                  {...register(`cuotas.${index}.numero_cuota`)}
                />
              </div>
              <div className="min-w-[110px] flex-1">
                <TextField
                  label="Monto"
                  type="number"
                  step="0.01"
                  error={errors.cuotas?.[index]?.monto?.message}
                  {...register(`cuotas.${index}.monto`)}
                />
              </div>
              <div className="min-w-[140px] flex-1">
                <TextField
                  label="Fecha límite"
                  type="date"
                  error={errors.cuotas?.[index]?.fecha_limite?.message}
                  {...register(`cuotas.${index}.fecha_limite`)}
                />
              </div>
              {fields.length > 1 && (
                <Button type="button" variant="secondary" onClick={() => remove(index)}>
                  Quitar
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => append({ numero_cuota: fields.length + 1, monto: undefined, fecha_limite: "" })}
        >
          Agregar cuota
        </Button>

        {errorServidor && <p className="text-sm text-red-600">{errorServidor}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Guardar plan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
