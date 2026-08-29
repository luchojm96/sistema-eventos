import { tipoEventoRepository } from "../repositories/tipoEvento.repository";
import { AppError } from "../utils/AppError";

export class TipoEventoService {
  listar() {
    return tipoEventoRepository().find({ order: { id: "ASC" } });
  }

  crear(nombre: string) {
    const tipo = tipoEventoRepository().create({ nombre, activo: true });
    return tipoEventoRepository().save(tipo);
  }

  async actualizar(id: number, datos: { nombre?: string; activo?: boolean }) {
    const tipo = await tipoEventoRepository().findOneBy({ id });
    if (!tipo) {
      throw new AppError("Tipo de evento no encontrado", 404);
    }
    Object.assign(tipo, datos);
    return tipoEventoRepository().save(tipo);
  }
}
