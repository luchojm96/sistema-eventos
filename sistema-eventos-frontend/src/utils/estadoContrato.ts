import type { EstadoContrato } from "../types/enums";

export const COLOR_ESTADO_CONTRATO: Record<EstadoContrato, "slate" | "blue" | "green" | "amber" | "red"> = {
  Cotizado: "slate",
  Contratado: "blue",
  Pagado: "green",
  Cancelado: "red",
};
