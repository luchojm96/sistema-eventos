import { useState } from "react";
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
    formState: { errors, isSubmitting },
  } = useForm<PagoClienteFormInput, unknown, PagoClienteFormValues>({ resolver: zodResolver(pagoClienteSchema) });

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
          {cuotas.map((cuota) => (
            <option key={cuota.id} value={cuota.id}>
              Cuota #{cuota.numero_cuota} — ${cuota.monto} (vence {cuota.fecha_limite})
              {cuota.pagada ? " · pagada" : ""}
            </option>
          ))}
        </Select>

        <TextField label="Monto" type="number" step="0.01" error={errors.monto?.message} {...register("monto")} />
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
