import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as pagosProveedorApi from "../../../api/pagosProveedor.api";
import { ApiError } from "../../../api/client";
import {
  pagoProveedorSchema,
  type PagoProveedorFormInput,
  type PagoProveedorFormValues,
} from "../../../schemas/pagoProveedor.schema";
import { Modal } from "../../../components/ui/Modal";
import { TextField } from "../../../components/ui/TextField";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import type { EventoProveedor } from "../../../types/entities";

interface Props {
  idEvento: number;
  contrataciones: EventoProveedor[];
  onClose: () => void;
  onGuardado: () => void;
}

export function EgresoFormModal({ idEvento, contrataciones, onClose, onGuardado }: Props) {
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PagoProveedorFormInput, unknown, PagoProveedorFormValues>({
    resolver: zodResolver(pagoProveedorSchema),
  });

  async function onSubmit(values: PagoProveedorFormValues) {
    setErrorServidor(null);
    try {
      await pagosProveedorApi.registrar(idEvento, values);
      onGuardado();
    } catch (err) {
      setErrorServidor(err instanceof ApiError ? err.message : "No se pudo registrar el egreso");
    }
  }

  return (
    <Modal title="Registrar egreso a proveedor" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Select
          label="Contratación"
          error={errors.id_evento_proveedor?.message}
          {...register("id_evento_proveedor")}
        >
          <option value="">Seleccioná una contratación</option>
          {contrataciones.map((contratacion) => (
            <option key={contratacion.id} value={contratacion.id}>
              {contratacion.proveedor?.nombre_empresa} — ${contratacion.costo_acordado} (
              {contratacion.estado_contrato})
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

        {errorServidor && <p className="text-sm text-red-600">{errorServidor}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Registrar egreso
          </Button>
        </div>
      </form>
    </Modal>
  );
}
