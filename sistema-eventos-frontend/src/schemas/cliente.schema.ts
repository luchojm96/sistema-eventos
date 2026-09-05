import { z } from "zod";
import { textoOpcional } from "./shared";

export const clientePerfilSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  telefono: textoOpcional(z.string()),
});

export type ClientePerfilFormValues = z.infer<typeof clientePerfilSchema>;

export const cambiarPasswordSchema = z
  .object({
    password_actual: z.string().min(6, "La contraseña actual debe tener al menos 6 caracteres"),
    password_nueva: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmar_password: z.string().min(6, "Confirmá la nueva contraseña"),
  })
  .refine((datos) => datos.password_nueva === datos.confirmar_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirmar_password"],
  });

export type CambiarPasswordFormValues = z.infer<typeof cambiarPasswordSchema>;
