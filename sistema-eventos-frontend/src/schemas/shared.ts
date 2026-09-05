import { z } from "zod";

// Los campos opcionales llegan como "" (input vacío) o null (columna sin valor desde el
// backend, ej. al precargar un formulario de edición) — ambos deben tratarse como "sin dato".
function esVacio(val: unknown): boolean {
  return val === "" || val === null || val === undefined;
}

export function numeroOpcional(schema: z.ZodNumber) {
  return z.preprocess((val) => (esVacio(val) ? undefined : Number(val)), schema.optional());
}

export function textoOpcional<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((val) => (esVacio(val) ? undefined : val), schema.optional());
}
