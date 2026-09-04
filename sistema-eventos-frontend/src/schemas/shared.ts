import { z } from "zod";

export function numeroOpcional(schema: z.ZodNumber) {
  return z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), schema.optional());
}

export function textoOpcional<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((val) => (val === "" ? undefined : val), schema.optional());
}
