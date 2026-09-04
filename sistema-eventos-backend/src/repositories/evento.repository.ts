import { AppDataSource } from "../config/data-source";
import { Evento } from "../entities/Evento";

export const eventoRepository = () => AppDataSource.getRepository(Evento);
