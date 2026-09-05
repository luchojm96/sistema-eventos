import { z } from "zod";
import { numeroOpcional, textoOpcional } from "./shared";

// "Cancelado" queda afuera a propósito: esa transición tiene su propio botón/endpoint
// ("Cancelar evento"), con reglas de negocio propias, no se setea desde este formulario.
export const ESTADOS_EDITABLES = ["Planificado", "Confirmado", "En curso", "Finalizado"] as const;

export const eventoSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  id_tipo_evento: z.coerce.number().int().min(1, "Seleccioná un tipo de evento"),
  id_cliente: z.coerce.number().int().min(1, "Seleccioná un cliente"),
  fecha_inicio: z.string().min(1, "La fecha de inicio es obligatoria"),
  fecha_fin: z.string().min(1, "La fecha de fin es obligatoria"),
  ubicacion: z.string().min(2, "La ubicación debe tener al menos 2 caracteres"),
  capacidad_estimada: numeroOpcional(z.number().int().min(0)),
  presupuesto_estimado: numeroOpcional(z.number().min(0)),
  descripcion: textoOpcional(z.string()),
  dias_anticipacion_recordatorio: numeroOpcional(z.number().int().min(0)),
  estado: textoOpcional(z.enum(ESTADOS_EDITABLES)),
});

// El schema usa coerce/preprocess (selects e inputs numéricos llegan como string),
// por lo que el tipo de entrada (antes de validar) difiere del de salida (después).
export type EventoFormInput = z.input<typeof eventoSchema>;
export type EventoFormValues = z.output<typeof eventoSchema>;
