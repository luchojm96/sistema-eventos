import type { EstadoConfirmacionInvitado } from "../types/enums";

export const COLOR_ESTADO_INVITADO: Record<EstadoConfirmacionInvitado, "slate" | "blue" | "green" | "amber" | "red"> = {
  Pendiente: "amber",
  Confirmado: "green",
  Rechazado: "red",
};
