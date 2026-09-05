import { eventoProveedorRepository } from "../repositories/eventoProveedor.repository";
import { eventoRepository } from "../repositories/evento.repository";
import { proveedorRepository } from "../repositories/proveedor.repository";
import { AppError } from "../utils/AppError";
import { EstadoContrato } from "../entities/enums";
import { verificarEventoActivo } from "../utils/verificarEventoActivo";

interface ContratacionInput {
  id_proveedor: number;
  descripcion_servicio?: string;
  costo_acordado: string | number;
  fecha_servicio: string;
  hora_inicio?: string;
  hora_fin?: string;
  cantidad?: number;
}

type ActualizarContratacionInput = Partial<ContratacionInput> & { estado_contrato?: EstadoContrato };

export class EventoProveedorService {
  async listarPorEvento(idEvento: number) {
    return eventoProveedorRepository().find({
      where: { id_evento: idEvento },
      relations: ["proveedor", "proveedor.categoria"],
      order: { fecha_servicio: "ASC" },
    });
  }

  async contratar(idEvento: number, datos: ContratacionInput) {
    const evento = await eventoRepository().findOneBy({ id: idEvento });
    if (!evento) {
      throw new AppError("Evento no encontrado", 404);
    }
    verificarEventoActivo(evento);

    const proveedor = await proveedorRepository().findOneBy({ id: datos.id_proveedor });
    if (!proveedor) {
      throw new AppError("Proveedor no encontrado", 404);
    }

    const contratacion = eventoProveedorRepository().create({
      ...datos,
      id_evento: idEvento,
      costo_acordado: String(datos.costo_acordado),
      estado_contrato: EstadoContrato.COTIZADO,
    });
    return eventoProveedorRepository().save(contratacion);
  }

  async obtenerContratacion(id: number) {
    const contratacion = await eventoProveedorRepository().findOne({
      where: { id },
      relations: ["proveedor"],
    });
    if (!contratacion) {
      throw new AppError("Contratación no encontrada", 404);
    }
    return contratacion;
  }

  async actualizar(id: number, datos: ActualizarContratacionInput) {
    const contratacion = await this.obtenerContratacion(id);
    await this.verificarEventoDeContratacionActivo(contratacion.id_evento);
    if (datos.estado_contrato === EstadoContrato.PAGADO) {
      throw new AppError("El estado Pagado se calcula automáticamente a partir de los pagos registrados", 400);
    }

    Object.assign(contratacion, datos);
    if (datos.costo_acordado !== undefined) {
      contratacion.costo_acordado = String(datos.costo_acordado);
    }
    return eventoProveedorRepository().save(contratacion);
  }

  async cancelar(id: number) {
    const contratacion = await this.obtenerContratacion(id);
    await this.verificarEventoDeContratacionActivo(contratacion.id_evento);
    contratacion.estado_contrato = EstadoContrato.CANCELADO;
    return eventoProveedorRepository().save(contratacion);
  }

  private async verificarEventoDeContratacionActivo(idEvento: number) {
    const evento = await eventoRepository().findOneBy({ id: idEvento });
    if (!evento) {
      throw new AppError("Evento no encontrado", 404);
    }
    verificarEventoActivo(evento);
  }
}
