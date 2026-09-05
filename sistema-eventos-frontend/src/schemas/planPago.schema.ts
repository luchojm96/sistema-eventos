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

// Para agregar una cuota a un plan ya existente: numero_cuota lo calcula el backend.
export const nuevaCuotaSchema = z.object({
  monto: z.coerce.number().positive("Debe ser mayor a 0"),
  fecha_limite: z.string().min(1, "Obligatoria"),
});

export type NuevaCuotaFormInput = z.input<typeof nuevaCuotaSchema>;
export type NuevaCuotaFormValues = z.output<typeof nuevaCuotaSchema>;

// Variantes con el monto tope-ado al presupuesto disponible del evento (si tiene uno
// definido) — usadas por AgregarCuotaModal, CuotaEditModal y PlanPagoFormModal para que
// no se pueda cargar un monto que deje el plan por encima del presupuesto estimado.
function limitarMonto(disponible: number | null) {
  const base = z.coerce.number().positive("Debe ser mayor a 0");
  return disponible == null
    ? base
    : base.max(disponible, `No puede superar el presupuesto disponible (Bs ${disponible.toFixed(2)})`);
}

export function crearNuevaCuotaSchema(disponible: number | null) {
  return z.object({
    monto: limitarMonto(disponible),
    fecha_limite: z.string().min(1, "Obligatoria"),
  });
}

export function crearCuotaEditSchema(disponible: number | null) {
  return z.object({
    numero_cuota: z.coerce.number().int().min(1, "Obligatorio"),
    monto: limitarMonto(disponible),
    fecha_limite: z.string().min(1, "Obligatoria"),
  });
}

export function crearPlanPagoSchema(presupuesto: number | null) {
  return planPagoSchema.superRefine((data, ctx) => {
    if (presupuesto == null) return;
    const total = data.cuotas.reduce((acc, cuota) => acc + cuota.monto, 0);
    if (total > presupuesto) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `El total del plan (Bs ${total.toFixed(2)}) supera el presupuesto estimado del evento (Bs ${presupuesto.toFixed(2)})`,
        path: ["cuotas"],
      });
    }
  });
}
