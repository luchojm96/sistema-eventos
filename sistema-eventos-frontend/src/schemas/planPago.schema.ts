import { z } from "zod";

export const cuotaSchema = z.object({
  numero_cuota: z.coerce.number().int().min(1, "Obligatorio"),
  monto: z.coerce.number().positive("Debe ser mayor a 0"),
  fecha_limite: z.string().min(1, "Obligatoria"),
});

export const planPagoSchema = z.object({
  cuotas: z.array(cuotaSchema).min(1, "Agregá al menos una cuota"),
});

export type PlanPagoFormInput = z.input<typeof planPagoSchema>;
export type PlanPagoFormValues = z.output<typeof planPagoSchema>;

export type CuotaFormInput = z.input<typeof cuotaSchema>;
export type CuotaFormValues = z.output<typeof cuotaSchema>;
