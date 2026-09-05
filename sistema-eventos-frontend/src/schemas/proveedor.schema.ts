import { z } from "zod";
import { textoOpcional } from "./shared";

export const proveedorSchema = z.object({
  nombre_empresa: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  id_categoria: z.coerce.number().int().min(1, "Seleccioná una categoría"),
  contacto_nombre: textoOpcional(z.string()),
  telefono: textoOpcional(z.string()),
  email: textoOpcional(z.email("Email inválido")),
});

export type ProveedorFormInput = z.input<typeof proveedorSchema>;
export type ProveedorFormValues = z.output<typeof proveedorSchema>;
