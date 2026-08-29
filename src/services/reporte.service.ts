import { AppDataSource } from "../config/data-source";
import { Invitado } from "../entities/Invitado";
import { PagoCliente } from "../entities/PagoCliente";
import { PagoProveedor } from "../entities/PagoProveedor";
import { EventoProveedor } from "../entities/EventoProveedor";
import { eventoRepository } from "../repositories/evento.repository";
import { planPagoRepository } from "../repositories/planPago.repository";
import { AppError } from "../utils/AppError";
import { EstadoConfirmacionInvitado, EstadoPagoCliente } from "../entities/enums";
import { Rol } from "../types/auth.types";
import { Evento } from "../entities/Evento";

async function obtenerEventoOFallar(idEvento: number): Promise<Evento> {
  const evento = await eventoRepository().findOneBy({ id: idEvento });
  if (!evento) {
    throw new AppError("Evento no encontrado", 404);
  }
  return evento;
}

function verificarAcceso(evento: Evento, actorRol: Rol, actorId: number): void {
  if (actorRol === "cliente" && evento.id_cliente !== actorId) {
    throw new AppError("No autorizado", 403);
  }
}

export class ReporteService {
  async asistencia(idEvento: number, actorRol: Rol, actorId: number) {
    const evento = await obtenerEventoOFallar(idEvento);
    verificarAcceso(evento, actorRol, actorId);

    const invitadoRepo = AppDataSource.getRepository(Invitado);
    const invitados = await invitadoRepo.find({ where: { id_evento: idEvento }, order: { apellido: "ASC" } });

    const resumen = {
      total: invitados.length,
      confirmados: invitados.filter((i) => i.estado_confirmacion === EstadoConfirmacionInvitado.CONFIRMADO).length,
      pendientes: invitados.filter((i) => i.estado_confirmacion === EstadoConfirmacionInvitado.PENDIENTE).length,
      rechazados: invitados.filter((i) => i.estado_confirmacion === EstadoConfirmacionInvitado.RECHAZADO).length,
    };

    return { resumen, invitados };
  }

  async financiero(idEvento: number, actorRol: Rol, actorId: number) {
    const evento = await obtenerEventoOFallar(idEvento);
    verificarAcceso(evento, actorRol, actorId);

    const pagoClienteRepo = AppDataSource.getRepository(PagoCliente);
    const pagos = await pagoClienteRepo.find({ where: { id_evento: idEvento }, order: { fecha_pago: "ASC" } });
    const totalValidado = pagos
      .filter((p) => p.estado === EstadoPagoCliente.VALIDADO)
      .reduce((acc, p) => acc + Number(p.monto), 0);
    const totalReportado = pagos
      .filter((p) => p.estado === EstadoPagoCliente.REPORTADO)
      .reduce((acc, p) => acc + Number(p.monto), 0);

    const plan = await planPagoRepository().find({ where: { id_evento: idEvento }, order: { numero_cuota: "ASC" } });
    const totalPlan = plan.reduce((acc, c) => acc + Number(c.monto), 0);

    const ingresos = {
      totalPlan,
      totalValidado,
      totalReportadoPendienteValidacion: totalReportado,
      saldoPendiente: totalPlan - totalValidado,
      planPagos: plan,
      pagos,
    };

    if (actorRol === "cliente") {
      return { ingresos };
    }

    const eventoProveedorRepo = AppDataSource.getRepository(EventoProveedor);
    const contrataciones = await eventoProveedorRepo.find({
      where: { id_evento: idEvento },
      relations: ["proveedor"],
    });
    const totalCostoAcordado = contrataciones.reduce((acc, c) => acc + Number(c.costo_acordado), 0);

    const idsContrataciones = contrataciones.map((c) => c.id);
    const pagoProveedorRepo = AppDataSource.getRepository(PagoProveedor);
    const egresos = idsContrataciones.length
      ? await pagoProveedorRepo
          .createQueryBuilder("pago")
          .where("pago.id_evento_proveedor IN (:...ids)", { ids: idsContrataciones })
          .getMany()
      : [];
    const totalEgresos = egresos.reduce((acc, p) => acc + Number(p.monto), 0);

    return {
      ingresos,
      egresos: {
        totalCostoAcordado,
        totalPagado: totalEgresos,
        saldoPendiente: totalCostoAcordado - totalEgresos,
        contrataciones,
        pagos: egresos,
      },
      rentabilidad: totalValidado - totalEgresos,
    };
  }

  async proveedoresMasContratados() {
    const eventoProveedorRepo = AppDataSource.getRepository(EventoProveedor);
    const resultado = await eventoProveedorRepo
      .createQueryBuilder("ep")
      .innerJoin("ep.proveedor", "proveedor")
      .select("proveedor.id", "id_proveedor")
      .addSelect("proveedor.nombre_empresa", "nombre_empresa")
      .addSelect("COUNT(ep.id)", "vecesContratado")
      .groupBy("proveedor.id")
      .addGroupBy("proveedor.nombre_empresa")
      .orderBy("vecesContratado", "DESC")
      .getRawMany();

    return resultado.map((r) => ({
      id_proveedor: Number(r.id_proveedor),
      nombre_empresa: r.nombre_empresa as string,
      vecesContratado: Number(r.vecesContratado),
    }));
  }
}
