import { z } from "zod";
import { numeroOpcional, textoOpcional } from "./shared";

export const invitadoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  email: textoOpcional(z.email("Email inválido")),
  telefono: z.string().optional(),
  acompanantes_permitidos: numeroOpcional(z.number().int().min(0)),
  notas_especiales: z.string().optional(),
});

// El schema usa preprocess (campos vacíos → undefined), por lo que el tipo de
// entrada (antes de validar) difiere del de salida (después).
export type InvitadoFormInput = z.input<typeof invitadoSchema>;
export type InvitadoFormValues = z.output<typeof invitadoSchema>;
