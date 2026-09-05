import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as pagosClienteApi from "../../api/pagosCliente.api";
import { ApiError } from "../../api/client";
import {
  pagoClienteSchema,
  type PagoClienteFormInput,
  type PagoClienteFormValues,
} from "../../schemas/pagoCliente.schema";
import { Modal } from "../ui/Modal";
import { TextField } from "../ui/TextField";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import type { PlanPago } from "../../types/entities";

interface Props {
  idEvento: number;
  cuotas: PlanPago[];
  onClose: () => void;
  onGuardado: () => void;
}

export function PagoClienteFormModal({ idEvento, cuotas, onClose, onGuardado }: Props) {
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PagoClienteFormInput, unknown, PagoClienteFormValues>({ resolver: zodResolver(pagoClienteSchema) });

  // Solo se pueden elegir cuotas todavía no pagadas; el monto queda atado a la
  // cuota elegida (no se puede cargar un monto distinto al definido en el plan).
  const cuotasDisponibles = useMemo(() => cuotas.filter((cuota) => !cuota.pagada), [cuotas]);

  const idCuotaSeleccionada = watch("id_cuota");
  const cuotaSeleccionada = cuotasDisponibles.find(
    (cuota) => idCuotaSeleccionada !== undefined && String(cuota.id) === String(idCuotaSeleccionada),
  );

  useEffect(() => {
    if (cuotaSeleccionada) {
      setValue("monto", Number(cuotaSeleccionada.monto), { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cuotaSeleccionada?.id]);

  async function onSubmit(values: PagoClienteFormValues) {
    setErrorServidor(null);
    try {
      await pagosClienteApi.registrar(idEvento, values, comprobante ?? undefined);
      onGuardado();
    } catch (err) {
      setErrorServidor(err instanceof ApiError ? err.message : "No se pudo registrar el pago");
    }
  }

  return (
    <Modal title="Registrar pago" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Select label="Cuota (opcional)" error={errors.id_cuota?.message} {...register("id_cuota")}>
          <option value="">Sin asociar a una cuota</option>
          {cuotasDisponibles.map((cuota) => (
            <option key={cuota.id} value={cuota.id}>
              Cuota #{cuota.numero_cuota} — Bs {cuota.monto} (vence {cuota.fecha_limite})
            </option>
          ))}
        </Select>

        <TextField
          label="Monto"
          type="number"
          step="0.01"
          readOnly={!!cuotaSeleccionada}
          error={errors.monto?.message}
          {...register("monto")}
        />
        {cuotaSeleccionada && (
          <p className="-mt-3 text-xs text-slate-500">El monto queda fijo en el de la cuota elegida.</p>
        )}

        <TextField label="Fecha de pago" type="date" error={errors.fecha_pago?.message} {...register("fecha_pago")} />

        <Select label="Método de pago" error={errors.metodo_pago?.message} {...register("metodo_pago")}>
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Tarjeta">Tarjeta</option>
          <option value="QR">QR</option>
        </Select>

        <div className="flex flex-col gap-1">
          <label htmlFor="comprobante" className="text-sm font-medium text-slate-700">
            Comprobante (opcional, PDF/JPG/PNG)
          </label>
          <input
            id="comprobante"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(event) => setComprobante(event.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </div>

        {errorServidor && <p className="text-sm text-red-600">{errorServidor}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Registrar pago
          </Button>
        </div>
      </form>
    </Modal>
  );
}
