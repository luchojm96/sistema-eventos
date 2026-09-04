import { z } from "zod";
import { numeroOpcional } from "./shared";

export const METODOS_PAGO = ["Efectivo", "Transferencia", "Tarjeta", "QR"] as const;

export const pagoClienteSchema = z.object({
  id_cuota: numeroOpcional(z.number().int().min(1)),
  monto: z.coerce.number().positive("El monto debe ser mayor a 0"),
  fecha_pago: z.string().min(1, "La fecha de pago es obligatoria"),
  metodo_pago: z.enum(METODOS_PAGO),
});

export type PagoClienteFormInput = z.input<typeof pagoClienteSchema>;
export type PagoClienteFormValues = z.output<typeof pagoClienteSchema>;
