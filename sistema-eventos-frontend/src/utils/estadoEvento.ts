import type { EstadoEvento } from "../types/enums";

export const COLOR_ESTADO_EVENTO: Record<EstadoEvento, "slate" | "blue" | "green" | "amber" | "red"> = {
  Planificado: "slate",
  Confirmado: "blue",
  "En curso": "amber",
  Finalizado: "green",
  Cancelado: "red",
};
