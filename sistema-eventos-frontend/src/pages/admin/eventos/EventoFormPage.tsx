import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import * as eventosApi from "../../../api/eventos.api";
import * as tiposEventoApi from "../../../api/tiposEvento.api";
import * as clientesApi from "../../../api/clientes.api";
import { useApiData } from "../../../hooks/useApiData";
import { ApiError } from "../../../api/client";
import { eventoSchema, type EventoFormInput, type EventoFormValues } from "../../../schemas/evento.schema";
import { TextField } from "../../../components/ui/TextField";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import type { Evento } from "../../../types/entities";

export function EventoFormPage() {
  const { id } = useParams();
  const modoEdicion = id !== undefined;
  const navigate = useNavigate();

  const { data: tipos } = useApiData(() => tiposEventoApi.listar());
  const { data: clientes } = useApiData(() => clientesApi.listar());
  const [eventoActual, setEventoActual] = useState<Evento | null>(null);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventoFormInput, unknown, EventoFormValues>({ resolver: zodResolver(eventoSchema) });

  useEffect(() => {
    if (!modoEdicion) return;
    eventosApi
      .obtener(Number(id))
      .then((evento) => {
        setEventoActual(evento);
        reset({
          nombre: evento.nombre,
          id_tipo_evento: evento.id_tipo_evento,
          id_cliente: evento.id_cliente,
          fecha_inicio: evento.fecha_inicio,
          fecha_fin: evento.fecha_fin,
          ubicacion: evento.ubicacion,
          capacidad_estimada: evento.capacidad_estimada,
          presupuesto_estimado: evento.presupuesto_estimado ? Number(evento.presupuesto_estimado) : undefined,
          descripcion: evento.descripcion,
          dias_anticipacion_recordatorio: evento.dias_anticipacion_recordatorio,
        });
      })
      .catch((err) => setErrorCarga(err instanceof ApiError ? err.message : "No se pudo cargar el evento"));
  }, [id, modoEdicion, reset]);

  async function onSubmit(values: EventoFormValues) {
    setErrorServidor(null);
    try {
      if (modoEdicion) {
        // El backend no acepta id_cliente en la actualización (no se permite reasignar el evento).
        const { id_cliente: _idCliente, ...datosActualizables } = values;
        await eventosApi.actualizar(Number(id), datosActualizables);
      } else {
        await eventosApi.crear(values);
      }
      navigate("/admin/eventos");
    } catch (err) {
      setErrorServidor(err instanceof ApiError ? err.message : "No se pudo guardar el evento");
    }
  }

  if (modoEdicion && errorCarga) {
    return <p className="p-8 text-sm text-red-600">{errorCarga}</p>;
  }

  // Un tipo/cliente inactivo asociado al evento que se está editando igual debe verse en el select.
  const tiposDisponibles = (tipos ?? []).filter(
    (tipo) => tipo.activo || tipo.id === eventoActual?.id_tipo_evento,
  );
  const clientesDisponibles = (clientes ?? []).filter(
    (cliente) => cliente.activo || cliente.id === eventoActual?.id_cliente,
  );

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="text-xl font-semibold text-slate-900">{modoEdicion ? "Editar evento" : "Nuevo evento"}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <TextField label="Nombre" error={errors.nombre?.message} {...register("nombre")} />

        <Select label="Tipo de evento" error={errors.id_tipo_evento?.message} {...register("id_tipo_evento")}>
          <option value="">Seleccioná un tipo</option>
          {tiposDisponibles.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
              {!tipo.activo ? " (inactivo)" : ""}
            </option>
          ))}
        </Select>

        <Select
          label="Cliente"
          error={errors.id_cliente?.message}
          disabled={modoEdicion}
          {...register("id_cliente")}
        >
          <option value="">Seleccioná un cliente</option>
          {clientesDisponibles.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre} ({cliente.email})
              {!cliente.activo ? " (inactivo)" : ""}
            </option>
          ))}
        </Select>
        {modoEdicion && (
          <p className="-mt-3 text-xs text-slate-500">El cliente de un evento no se puede reasignar.</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Fecha de inicio"
            type="date"
            error={errors.fecha_inicio?.message}
            {...register("fecha_inicio")}
          />
          <TextField label="Fecha de fin" type="date" error={errors.fecha_fin?.message} {...register("fecha_fin")} />
        </div>

        <TextField label="Ubicación" error={errors.ubicacion?.message} {...register("ubicacion")} />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Capacidad estimada"
            type="number"
            error={errors.capacidad_estimada?.message}
            {...register("capacidad_estimada")}
          />
          <TextField
            label="Presupuesto estimado"
            type="number"
            step="0.01"
            error={errors.presupuesto_estimado?.message}
            {...register("presupuesto_estimado")}
          />
        </div>

        <TextField
          label="Días de anticipación para recordatorio RSVP"
          type="number"
          error={errors.dias_anticipacion_recordatorio?.message}
          {...register("dias_anticipacion_recordatorio")}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="descripcion" className="text-sm font-medium text-slate-700">
            Descripción
          </label>
          <textarea
            id="descripcion"
            rows={3}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
            {...register("descripcion")}
          />
        </div>

        {errorServidor && <p className="text-sm text-red-600">{errorServidor}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {modoEdicion ? "Guardar cambios" : "Crear evento"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/admin/eventos")}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
