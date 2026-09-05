import { z } from "zod";
import { numeroOpcional, textoOpcional } from "./shared";

export const contratacionSchema = z.object({
  id_proveedor: z.coerce.number().int().min(1, "Seleccioná un proveedor"),
  descripcion_servicio: textoOpcional(z.string()),
  costo_acordado: z.coerce.number().positive("El costo debe ser mayor a 0"),
  fecha_servicio: z.string().min(1, "La fecha de servicio es obligatoria"),
  hora_inicio: textoOpcional(z.string()),
  hora_fin: textoOpcional(z.string()),
  cantidad: numeroOpcional(z.number().int().min(1)),
  estado_contrato: textoOpcional(z.enum(["Cotizado", "Contratado"])),
});

// El schema usa coerce/preprocess (selects e inputs numéricos llegan como string),
// por lo que el tipo de entrada (antes de validar) difiere del de salida (después).
export type ContratacionFormInput = z.input<typeof contratacionSchema>;
export type ContratacionFormValues = z.output<typeof contratacionSchema>;
