import { AppDataSource } from "../config/data-source";
import { eventoRepository } from "../repositories/evento.repository";
import { Invitado } from "../entities/Invitado";
import { EventoProveedor } from "../entities/EventoProveedor";
import { PagoCliente } from "../entities/PagoCliente";
import { EstadoEvento, EstadoConfirmacionInvitado, EstadoPagoCliente } from "../entities/enums";
import { AppError } from "../utils/AppError";

interface CrearEventoInput {
  nombre: string;
  id_tipo_evento: number;
  id_cliente: number;
  fecha_inicio: string;
  fecha_fin: string;
  ubicacion: string;
  capacidad_estimada?: number;
  presupuesto_estimado?: number | string;
  descripcion?: string;
  dias_anticipacion_recordatorio?: number;
}

type ActualizarEventoInput = Partial<CrearEventoInput> & { estado?: EstadoEvento };

export class EventoService {
  listarTodos() {
    return eventoRepository().find({
      relations: ["tipoEvento", "cliente"],
      order: { created_at: "DESC" },
    });
  }

  listarPorCliente(idCliente: number) {
    return eventoRepository().find({
      where: { id_cliente: idCliente },
      relations: ["tipoEvento"],
      order: { created_at: "DESC" },
    });
  }

  async obtenerPorId(id: number) {
    const evento = await eventoRepository().findOne({
      where: { id },
      relations: ["tipoEvento", "cliente"],
    });
    if (!evento) {
      throw new AppError("Evento no encontrado", 404);
    }
    return evento;
  }

  crear(datos: CrearEventoInput) {
    const evento = eventoRepository().create({
      ...datos,
      presupuesto_estimado: datos.presupuesto_estimado !== undefined ? String(datos.presupuesto_estimado) : undefined,
    });
    return eventoRepository().save(evento);
  }

  async actualizar(id: number, datos: ActualizarEventoInput) {
    const evento = await this.obtenerPorId(id);
    if (evento.estado === EstadoEvento.CANCELADO) {
      throw new AppError("No se puede modificar un evento cancelado", 400);
    }
    if (datos.estado === EstadoEvento.CANCELADO) {
      throw new AppError("Usá el endpoint de cancelación para cancelar un evento", 400);
    }
    Object.assign(evento, datos);
    if (datos.presupuesto_estimado !== undefined) {
      evento.presupuesto_estimado = String(datos.presupuesto_estimado);
    }
    return eventoRepository().save(evento);
  }

  async cancelar(id: number) {
    const evento = await this.obtenerPorId(id);
    if (evento.estado === EstadoEvento.FINALIZADO || evento.estado === EstadoEvento.CANCELADO) {
      throw new AppError(`No se puede cancelar un evento en estado ${evento.estado}`, 400);
    }
    evento.estado = EstadoEvento.CANCELADO;
    return eventoRepository().save(evento);
  }

  async resumen(id: number) {
    const invitadoRepo = AppDataSource.getRepository(Invitado);
    const [total, confirmados, pendientes, rechazados] = await Promise.all([
      invitadoRepo.countBy({ id_evento: id }),
      invitadoRepo.countBy({ id_evento: id, estado_confirmacion: EstadoConfirmacionInvitado.CONFIRMADO }),
      invitadoRepo.countBy({ id_evento: id, estado_confirmacion: EstadoConfirmacionInvitado.PENDIENTE }),
      invitadoRepo.countBy({ id_evento: id, estado_confirmacion: EstadoConfirmacionInvitado.RECHAZADO }),
    ]);

    const proveedorRepo = AppDataSource.getRepository(EventoProveedor);
    const totalProveedores = await proveedorRepo.countBy({ id_evento: id });

    const pagoRepo = AppDataSource.getRepository(PagoCliente);
    const pagos = await pagoRepo.findBy({ id_evento: id });
    const totalValidado = pagos
      .filter((p) => p.estado === EstadoPagoCliente.VALIDADO)
      .reduce((acc, p) => acc + Number(p.monto), 0);

    return {
      invitados: { total, confirmados, pendientes, rechazados },
      proveedoresContratados: totalProveedores,
      pagos: { totalValidado, cantidadRegistros: pagos.length },
    };
  }
}
