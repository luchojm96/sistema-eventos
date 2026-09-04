import type { EstadoPagoCliente } from "../types/enums";

export const COLOR_ESTADO_PAGO_CLIENTE: Record<EstadoPagoCliente, "slate" | "blue" | "green" | "amber" | "red"> = {
  Reportado: "amber",
  Validado: "green",
  Rechazado: "red",
};
