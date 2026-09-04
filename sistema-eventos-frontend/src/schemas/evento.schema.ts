import { z } from "zod";
import { numeroOpcional } from "./shared";

export const eventoSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  id_tipo_evento: z.coerce.number().int().min(1, "Seleccioná un tipo de evento"),
  id_cliente: z.coerce.number().int().min(1, "Seleccioná un cliente"),
  fecha_inicio: z.string().min(1, "La fecha de inicio es obligatoria"),
  fecha_fin: z.string().min(1, "La fecha de fin es obligatoria"),
  ubicacion: z.string().min(2, "La ubicación debe tener al menos 2 caracteres"),
  capacidad_estimada: numeroOpcional(z.number().int().min(0)),
  presupuesto_estimado: numeroOpcional(z.number().min(0)),
  descripcion: z.string().optional(),
  dias_anticipacion_recordatorio: numeroOpcional(z.number().int().min(0)),
});

// El schema usa coerce/preprocess (selects e inputs numéricos llegan como string),
// por lo que el tipo de entrada (antes de validar) difiere del de salida (después).
export type EventoFormInput = z.input<typeof eventoSchema>;
export type EventoFormValues = z.output<typeof eventoSchema>;
