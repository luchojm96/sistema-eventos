import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as eventoProveedoresApi from "../../../api/eventoProveedores.api";
import { ApiError } from "../../../api/client";
import {
  contratacionSchema,
  type ContratacionFormInput,
  type ContratacionFormValues,
} from "../../../schemas/contratacion.schema";
import { Modal } from "../../../components/ui/Modal";
import { TextField } from "../../../components/ui/TextField";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import type { EventoProveedor, Proveedor } from "../../../types/entities";

interface Props {
  idEvento: number;
  proveedoresActivos: Proveedor[];
  contratacion?: EventoProveedor | null;
  onClose: () => void;
  onGuardado: () => void;
}

export function ContratacionFormModal({ idEvento, proveedoresActivos, contratacion, onClose, onGuardado }: Props) {
  const modoEdicion = Boolean(contratacion);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContratacionFormInput, unknown, ContratacionFormValues>({
    resolver: zodResolver(contratacionSchema),
    defaultValues: contratacion
      ? {
          id_proveedor: contratacion.id_proveedor,
          descripcion_servicio: contratacion.descripcion_servicio,
          costo_acordado: Number(contratacion.costo_acordado),
          fecha_servicio: contratacion.fecha_servicio,
          hora_inicio: contratacion.hora_inicio,
          hora_fin: contratacion.hora_fin,
          cantidad: contratacion.cantidad,
          estado_contrato:
            contratacion.estado_contrato === "Cotizado" || contratacion.estado_contrato === "Contratado"
              ? contratacion.estado_contrato
              : undefined,
        }
      : undefined,
  });

  async function onSubmit(values: ContratacionFormValues) {
    setErrorServidor(null);
    try {
      if (modoEdicion && contratacion) {
        // El backend no acepta id_proveedor en la actualización (no se permite reasignar la contratación).
        const { id_proveedor: _idProveedor, ...datosActualizables } = values;
        await eventoProveedoresApi.actualizar(idEvento, contratacion.id, datosActualizables);
      } else {
        await eventoProveedoresApi.contratar(idEvento, values);
      }
      onGuardado();
    } catch (err) {
      setErrorServidor(err instanceof ApiError ? err.message : "No se pudo guardar la contratación");
    }
  }

  return (
    <Modal title={modoEdicion ? "Editar contratación" : "Contratar proveedor"} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Select
          label="Proveedor"
          error={errors.id_proveedor?.message}
          disabled={modoEdicion}
          {...register("id_proveedor")}
        >
          <option value="">Seleccioná un proveedor</option>
          {proveedoresActivos.map((proveedor) => (
            <option key={proveedor.id} value={proveedor.id}>
              {proveedor.nombre_empresa} ({proveedor.categoria?.nombre})
            </option>
          ))}
          {modoEdicion &&
            contratacion?.proveedor &&
            !proveedoresActivos.some((proveedor) => proveedor.id === contratacion.id_proveedor) && (
              <option value={contratacion.id_proveedor}>{contratacion.proveedor.nombre_empresa}</option>
            )}
        </Select>
        {modoEdicion && (
          <p className="-mt-3 text-xs text-slate-500">El proveedor de una contratación no se puede reasignar.</p>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="descripcion_servicio" className="text-sm font-medium text-slate-700">
            Descripción del servicio
          </label>
          <textarea
            id="descripcion_servicio"
            rows={2}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
            {...register("descripcion_servicio")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Costo acordado"
            type="number"
            step="0.01"
            error={errors.costo_acordado?.message}
            {...register("costo_acordado")}
          />
          <TextField label="Cantidad" type="number" error={errors.cantidad?.message} {...register("cantidad")} />
        </div>

        <TextField
          label="Fecha de servicio"
          type="date"
          error={errors.fecha_servicio?.message}
          {...register("fecha_servicio")}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField label="Hora de inicio" type="time" error={errors.hora_inicio?.message} {...register("hora_inicio")} />
          <TextField label="Hora de fin" type="time" error={errors.hora_fin?.message} {...register("hora_fin")} />
        </div>

        {modoEdicion && (
          <Select label="Estado" error={errors.estado_contrato?.message} {...register("estado_contrato")}>
            <option value="Cotizado">Cotizado</option>
            <option value="Contratado">Contratado</option>
          </Select>
        )}

        {errorServidor && <p className="text-sm text-red-600">{errorServidor}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {modoEdicion ? "Guardar cambios" : "Contratar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
