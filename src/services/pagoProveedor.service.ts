import { pagoProveedorRepository } from "../repositories/pagoProveedor.repository";
import { eventoProveedorRepository } from "../repositories/eventoProveedor.repository";
import { eventoRepository } from "../repositories/evento.repository";
import { AppError } from "../utils/AppError";
import { EstadoContrato, MetodoPago } from "../entities/enums";

interface RegistrarEgresoInput {
  id_evento_proveedor: number;
  monto: string | number;
  fecha_pago: string;
  metodo_pago: MetodoPago;
}

async function recalcularEstadoContrato(idEventoProveedor: number) {
  const contratacion = await eventoProveedorRepository().findOneBy({ id: idEventoProveedor });
  if (!contratacion || contratacion.estado_contrato === EstadoContrato.CANCELADO) {
    return;
  }

  const pagos = await pagoProveedorRepository().findBy({ id_evento_proveedor: idEventoProveedor });
  const totalPagado = pagos.reduce((acc, p) => acc + Number(p.monto), 0);

  if (totalPagado >= Number(contratacion.costo_acordado) && contratacion.estado_contrato !== EstadoContrato.PAGADO) {
    contratacion.estado_contrato = EstadoContrato.PAGADO;
    await eventoProveedorRepository().save(contratacion);
  }
}

export class PagoProveedorService {
  async listarPorEvento(idEvento: number) {
    const evento = await eventoRepository().findOneBy({ id: idEvento });
    if (!evento) {
      throw new AppError("Evento no encontrado", 404);
    }

    return pagoProveedorRepository()
      .createQueryBuilder("pago")
      .innerJoin("pago.eventoProveedor", "eventoProveedor")
      .leftJoinAndSelect("pago.eventoProveedor", "contratacion")
      .leftJoinAndSelect("contratacion.proveedor", "proveedor")
      .where("eventoProveedor.id_evento = :idEvento", { idEvento })
      .orderBy("pago.created_at", "DESC")
      .getMany();
  }

  async registrar(idEvento: number, datos: RegistrarEgresoInput) {
    const contratacion = await eventoProveedorRepository().findOneBy({
      id: datos.id_evento_proveedor,
      id_evento: idEvento,
    });
    if (!contratacion) {
      throw new AppError("La contratación indicada no pertenece a este evento", 400);
    }

    const pago = pagoProveedorRepository().create({
      id_evento_proveedor: datos.id_evento_proveedor,
      monto: String(datos.monto),
      fecha_pago: datos.fecha_pago,
      metodo_pago: datos.metodo_pago,
    });
    const guardado = await pagoProveedorRepository().save(pago);
    await recalcularEstadoContrato(datos.id_evento_proveedor);
    return guardado;
  }
}
