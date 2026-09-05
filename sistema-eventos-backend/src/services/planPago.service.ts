import { planPagoRepository } from "../repositories/planPago.repository";
import { pagoClienteRepository } from "../repositories/pagoCliente.repository";
import { eventoRepository } from "../repositories/evento.repository";
import { AppError } from "../utils/AppError";
import { EstadoPagoCliente } from "../entities/enums";
import { Rol } from "../types/auth.types";
import { verificarEventoActivo } from "../utils/verificarEventoActivo";

interface CuotaInput {
  numero_cuota: number;
  monto: string | number;
  fecha_limite: string;
}

export class PlanPagoService {
  async obtenerPorEvento(idEvento: number, actorRol: Rol, actorId: number) {
    const evento = await eventoRepository().findOneBy({ id: idEvento });
    if (!evento) {
      throw new AppError("Evento no encontrado", 404);
    }
    if (actorRol === "cliente" && evento.id_cliente !== actorId) {
      throw new AppError("No autorizado", 403);
    }

    const cuotas = await planPagoRepository().find({
      where: { id_evento: idEvento },
      order: { numero_cuota: "ASC" },
    });

    const pagos = await pagoClienteRepository().find({
      where: { id_evento: idEvento, estado: EstadoPagoCliente.VALIDADO },
    });
    const cuotasPagadas = new Set(pagos.map((p) => p.id_cuota).filter((id): id is number => id !== undefined));

    return cuotas.map((cuota) => ({ ...cuota, pagada: cuotasPagadas.has(cuota.id) }));
  }

  async crearPlan(idEvento: number, cuotas: CuotaInput[]) {
    const evento = await eventoRepository().findOneBy({ id: idEvento });
    if (!evento) {
      throw new AppError("Evento no encontrado", 404);
    }
    verificarEventoActivo(evento);

    const existentes = await planPagoRepository().countBy({ id_evento: idEvento });
    if (existentes > 0) {
      throw new AppError(
        "Este evento ya tiene un plan de pagos definido. Para editarlo, actualizá cada cuota individualmente.",
        409
      );
    }

    if (!Array.isArray(cuotas) || cuotas.length === 0) {
      throw new AppError("Debés enviar al menos una cuota", 400);
    }

    if (evento.presupuesto_estimado != null) {
      const totalPlan = cuotas.reduce((acc, cuota) => acc + Number(cuota.monto), 0);
      const presupuesto = Number(evento.presupuesto_estimado);
      if (totalPlan > presupuesto) {
        throw new AppError(
          `El total del plan (${totalPlan.toFixed(2)}) supera el presupuesto estimado del evento (${presupuesto.toFixed(2)})`,
          400
        );
      }
    }

    const nuevas = cuotas.map((cuota) =>
      planPagoRepository().create({
        id_evento: idEvento,
        numero_cuota: cuota.numero_cuota,
        monto: String(cuota.monto),
        fecha_limite: cuota.fecha_limite,
      })
    );
    return planPagoRepository().save(nuevas);
  }

  async agregarCuota(idEvento: number, datos: { monto: string | number; fecha_limite: string }) {
    const evento = await eventoRepository().findOneBy({ id: idEvento });
    if (!evento) {
      throw new AppError("Evento no encontrado", 404);
    }
    verificarEventoActivo(evento);

    const cuotas = await planPagoRepository().find({ where: { id_evento: idEvento } });
    if (cuotas.length === 0) {
      throw new AppError("Este evento todavía no tiene un plan de pagos definido. Definilo primero.", 400);
    }

    if (evento.presupuesto_estimado != null) {
      const totalActual = cuotas.reduce((acc, cuota) => acc + Number(cuota.monto), 0);
      const presupuesto = Number(evento.presupuesto_estimado);
      const disponible = presupuesto - totalActual;
      if (Number(datos.monto) > disponible) {
        throw new AppError(
          `El monto (${Number(datos.monto).toFixed(2)}) supera el presupuesto disponible (${disponible.toFixed(2)})`,
          400
        );
      }
    }

    const siguienteNumero = Math.max(...cuotas.map((c) => c.numero_cuota)) + 1;
    const nueva = planPagoRepository().create({
      id_evento: idEvento,
      numero_cuota: siguienteNumero,
      monto: String(datos.monto),
      fecha_limite: datos.fecha_limite,
    });
    return planPagoRepository().save(nueva);
  }

  async actualizarCuota(cuotaId: number, datos: Partial<CuotaInput>) {
    const cuota = await planPagoRepository().findOneBy({ id: cuotaId });
    if (!cuota) {
      throw new AppError("Cuota no encontrada", 404);
    }

    const evento = await eventoRepository().findOneBy({ id: cuota.id_evento });
    if (!evento) {
      throw new AppError("Evento no encontrado", 404);
    }
    verificarEventoActivo(evento);

    if (datos.monto !== undefined) {
      if (evento.presupuesto_estimado != null) {
        const otrasCuotas = await planPagoRepository().find({ where: { id_evento: cuota.id_evento } });
        const totalOtras = otrasCuotas
          .filter((c) => c.id !== cuotaId)
          .reduce((acc, c) => acc + Number(c.monto), 0);
        const presupuesto = Number(evento.presupuesto_estimado);
        const disponible = presupuesto - totalOtras;
        if (Number(datos.monto) > disponible) {
          throw new AppError(
            `El monto (${Number(datos.monto).toFixed(2)}) supera el presupuesto disponible (${disponible.toFixed(2)})`,
            400
          );
        }
      }
    }

    Object.assign(cuota, datos);
    if (datos.monto !== undefined) {
      cuota.monto = String(datos.monto);
    }
    return planPagoRepository().save(cuota);
  }
}
