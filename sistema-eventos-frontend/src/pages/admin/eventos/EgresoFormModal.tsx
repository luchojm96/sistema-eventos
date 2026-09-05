import { useEffect, useMemo, useState } from "react";
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
import type { EventoProveedor, PagoProveedor } from "../../../types/entities";

interface Props {
  idEvento: number;
  contrataciones: EventoProveedor[];
  egresos: PagoProveedor[];
  onClose: () => void;
  onGuardado: () => void;
}

export function EgresoFormModal({ idEvento, contrataciones, egresos, onClose, onGuardado }: Props) {
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PagoProveedorFormInput, unknown, PagoProveedorFormValues>({
    resolver: zodResolver(pagoProveedorSchema),
  });

  // El monto de un egreso queda atado al saldo pendiente de la contratación elegida
  // (costo acordado menos lo ya pagado) — no se puede cargar cualquier cantidad.
  const contratacionesConSaldo = useMemo(
    () =>
      contrataciones
        .map((contratacion) => {
          const pagado = egresos
            .filter((egreso) => egreso.id_evento_proveedor === contratacion.id)
            .reduce((acc, egreso) => acc + Number(egreso.monto), 0);
          const saldoPendiente = Number(contratacion.costo_acordado) - pagado;
          return { contratacion, saldoPendiente };
        })
        .filter(({ saldoPendiente }) => saldoPendiente > 0),
    [contrataciones, egresos],
  );

  const idSeleccionado = watch("id_evento_proveedor");
  const seleccion = contratacionesConSaldo.find(
    ({ contratacion }) => String(contratacion.id) === String(idSeleccionado),
  );

  useEffect(() => {
    if (seleccion) {
      setValue("monto", seleccion.saldoPendiente, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seleccion?.contratacion.id]);

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
          {contratacionesConSaldo.map(({ contratacion, saldoPendiente }) => (
            <option key={contratacion.id} value={contratacion.id}>
              {contratacion.proveedor?.nombre_empresa} — saldo Bs {saldoPendiente} de Bs {contratacion.costo_acordado}
            </option>
          ))}
        </Select>
        {contratacionesConSaldo.length === 0 && (
          <p className="-mt-3 text-xs text-slate-500">No hay contrataciones con saldo pendiente.</p>
        )}

        <TextField
          label="Monto"
          type="number"
          step="0.01"
          readOnly
          error={errors.monto?.message}
          {...register("monto")}
        />
        {seleccion && (
          <p className="-mt-3 text-xs text-slate-500">
            El monto queda fijo en el saldo pendiente de la contratación elegida.
          </p>
        )}

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
