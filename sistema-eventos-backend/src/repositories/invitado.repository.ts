import { AppDataSource } from "../config/data-source";
import { Invitado } from "../entities/Invitado";

export const invitadoRepository = () => AppDataSource.getRepository(Invitado);

export const findInvitadoByToken = (token: string) =>
  invitadoRepository().findOne({ where: { token_confirmacion: token }, relations: ["evento"] });

export const findInvitadoConEvento = (id: number) =>
  invitadoRepository().findOne({ where: { id }, relations: ["evento"] });
