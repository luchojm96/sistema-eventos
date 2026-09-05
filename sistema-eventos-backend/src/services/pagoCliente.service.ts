import { pagoClienteRepository } from "../repositories/pagoCliente.repository";
import { eventoRepository } from "../repositories/evento.repository";
import { planPagoRepository } from "../repositories/planPago.repository";
import { AppError } from "../utils/AppError";
import { EstadoPagoCliente, MetodoPago, RegistradoPor } from "../entities/enums";
import { Rol } from "../types/auth.types";
import { verificarEventoActivo } from "../utils/verificarEventoActivo";

interface RegistrarPagoInput {
  id_cuota?: number;
  monto: string | number;
  fecha_pago: string;
  metodo_pago: MetodoPago;
  comprobante_url?: string;
}

async function obtenerEventoOFallar(idEvento: number) {
  const evento = await eventoRepository().findOneBy({ id: idEvento });
  if (!evento) {
    throw new AppError("Evento no encontrado", 404);
  }
  return evento;
}

function verificarAcceso(idClienteEvento: number, actorRol: Rol, actorId: number) {
  if (actorRol === "cliente" && idClienteEvento !== actorId) {
    throw new AppError("No autorizado", 403);
  }
}

export class PagoClienteService {
  async listarPorEvento(idEvento: number, actorRol: Rol, actorId: number) {
    const evento = await obtenerEventoOFallar(idEvento);
    verificarAcceso(evento.id_cliente, actorRol, actorId);

    return pagoClienteRepository().find({
      where: { id_evento: idEvento },
      order: { created_at: "DESC" },
    });
  }

  async registrar(idEvento: number, actorRol: Rol, actorId: number, datos: RegistrarPagoInput) {
    const evento = await obtenerEventoOFallar(idEvento);
    verificarAcceso(evento.id_cliente, actorRol, actorId);
    verificarEventoActivo(evento);

    if (datos.id_cuota !== undefined) {
      const cuota = await planPagoRepository().findOneBy({ id: datos.id_cuota, id_evento: idEvento });
      if (!cuota) {
        throw new AppError("La cuota indicada no pertenece a este evento", 400);
      }
    }

    const esAdministrador = actorRol === "administrador";
    const pago = pagoClienteRepository().create({
      id_evento: idEvento,
      id_cuota: datos.id_cuota,
      monto: String(datos.monto),
      fecha_pago: datos.fecha_pago,
      metodo_pago: datos.metodo_pago,
      comprobante_url: datos.comprobante_url,
      registrado_por: esAdministrador ? RegistradoPor.ADMINISTRADOR : RegistradoPor.CLIENTE,
      estado: esAdministrador ? EstadoPagoCliente.VALIDADO : EstadoPagoCliente.REPORTADO,
    });
    return pagoClienteRepository().save(pago);
  }

  async validar(id: number, decision: "Validado" | "Rechazado") {
    const pago = await pagoClienteRepository().findOneBy({ id });
    if (!pago) {
      throw new AppError("Pago no encontrado", 404);
    }
    const evento = await obtenerEventoOFallar(pago.id_evento);
    verificarEventoActivo(evento);
    if (pago.estado !== EstadoPagoCliente.REPORTADO) {
      throw new AppError("Solo se pueden validar pagos en estado Reportado", 400);
    }

    pago.estado = decision === "Validado" ? EstadoPagoCliente.VALIDADO : EstadoPagoCliente.RECHAZADO;
    return pagoClienteRepository().save(pago);
  }
}
