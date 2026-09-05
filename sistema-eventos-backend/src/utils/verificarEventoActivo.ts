import { Evento } from "../entities/Evento";
import { EstadoEvento } from "../entities/enums";
import { AppError } from "./AppError";

// Un evento Cancelado o Finalizado ya no admite altas, ediciones ni bajas sobre sus datos
// relacionados (invitados, proveedores, plan de pagos, ingresos, egresos) — solo consulta.
export function verificarEventoActivo(evento: Evento): void {
  if (evento.estado === EstadoEvento.CANCELADO || evento.estado === EstadoEvento.FINALIZADO) {
    throw new AppError(`No se puede modificar un evento en estado ${evento.estado}`, 400);
  }
}
