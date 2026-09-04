import { z } from "zod";

export const categoriaProveedorSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

export type CategoriaProveedorFormValues = z.infer<typeof categoriaProveedorSchema>;
