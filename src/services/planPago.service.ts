import { planPagoRepository } from "../repositories/planPago.repository";
import { pagoClienteRepository } from "../repositories/pagoCliente.repository";
import { eventoRepository } from "../repositories/evento.repository";
import { AppError } from "../utils/AppError";
import { EstadoPagoCliente } from "../entities/enums";

interface CuotaInput {
  numero_cuota: number;
  monto: string | number;
  fecha_limite: string;
}

export class PlanPagoService {
  async obtenerPorEvento(idEvento: number) {
    const evento = await eventoRepository().findOneBy({ id: idEvento });
    if (!evento) {
      throw new AppError("Evento no encontrado", 404);
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

  async actualizarCuota(cuotaId: number, datos: Partial<CuotaInput>) {
    const cuota = await planPagoRepository().findOneBy({ id: cuotaId });
    if (!cuota) {
      throw new AppError("Cuota no encontrada", 404);
    }

    Object.assign(cuota, datos);
    if (datos.monto !== undefined) {
      cuota.monto = String(datos.monto);
    }
    return planPagoRepository().save(cuota);
  }
}
