import { AppDataSource } from "../config/data-source";
import { TipoEvento } from "../entities/TipoEvento";

export const tipoEventoRepository = () => AppDataSource.getRepository(TipoEvento);
