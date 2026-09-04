import { z } from "zod";
import { METODOS_PAGO } from "./pagoCliente.schema";

export const pagoProveedorSchema = z.object({
  id_evento_proveedor: z.coerce.number().int().min(1, "Seleccioná una contratación"),
  monto: z.coerce.number().positive("El monto debe ser mayor a 0"),
  fecha_pago: z.string().min(1, "La fecha de pago es obligatoria"),
  metodo_pago: z.enum(METODOS_PAGO),
});

export type PagoProveedorFormInput = z.input<typeof pagoProveedorSchema>;
export type PagoProveedorFormValues = z.output<typeof pagoProveedorSchema>;
