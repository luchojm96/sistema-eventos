import crypto from "crypto";
import {
  invitadoRepository,
  findInvitadoByToken,
  findInvitadoConEvento,
} from "../repositories/invitado.repository";
import { eventoRepository } from "../repositories/evento.repository";
import { AppError } from "../utils/AppError";
import { enviarEmail } from "../utils/mailer";
import { EstadoConfirmacionInvitado } from "../entities/enums";
import { Evento } from "../entities/Evento";
import { Invitado } from "../entities/Invitado";
import { FilaInvitado } from "../utils/importInvitados";
import { verificarEventoActivo } from "../utils/verificarEventoActivo";

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

interface CrearInvitadoInput {
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  acompanantes_permitidos?: number;
  notas_especiales?: string;
}

interface RespuestaRsvpInput {
  confirma: boolean;
  acompanantes?: number;
  notas_especiales?: string;
}

function generarToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function construirLinkRsvp(token: string): string {
  return `${FRONTEND_URL}/rsvp/${token}`;
}

async function enviarInvitacion(invitado: Invitado, evento: Evento): Promise<void> {
  if (!invitado.email) return;
  const link = construirLinkRsvp(invitado.token_confirmacion);
  await enviarEmail({
    to: invitado.email,
    subject: `Invitación: ${evento.nombre}`,
    html: `<p>Hola ${invitado.nombre},</p><p>Estás invitado/a a <strong>${evento.nombre}</strong>. Por favor confirmá tu asistencia:</p><p><a href="${link}">${link}</a></p>`,
  });
}

async function obtenerEventoOFallar(idEvento: number): Promise<Evento> {
  const evento = await eventoRepository().findOneBy({ id: idEvento });
  if (!evento) {
    throw new AppError("Evento no encontrado", 404);
  }
  return evento;
}

function verificarPropiedad(evento: Evento, idClienteSolicitante: number): void {
  if (evento.id_cliente !== idClienteSolicitante) {
    throw new AppError("No autorizado", 403);
  }
}

export class InvitadoService {
  async listarPorEvento(idEvento: number, idClienteSolicitante: number | null): Promise<Invitado[]> {
    if (idClienteSolicitante !== null) {
      const evento = await obtenerEventoOFallar(idEvento);
      verificarPropiedad(evento, idClienteSolicitante);
    }
    return invitadoRepository().find({ where: { id_evento: idEvento }, order: { created_at: "DESC" } });
  }

  async crear(idEvento: number, idClienteSolicitante: number, datos: CrearInvitadoInput): Promise<Invitado> {
    const evento = await obtenerEventoOFallar(idEvento);
    verificarPropiedad(evento, idClienteSolicitante);
    verificarEventoActivo(evento);

    const invitado = invitadoRepository().create({
      ...datos,
      id_evento: idEvento,
      acompanantes_permitidos: datos.acompanantes_permitidos ?? 0,
      token_confirmacion: generarToken(),
    });
    const guardado = await invitadoRepository().save(invitado);
    await enviarInvitacion(guardado, evento);
    return guardado;
  }

  async importarMasivo(
    idEvento: number,
    idClienteSolicitante: number,
    filas: FilaInvitado[]
  ): Promise<Invitado[]> {
    const evento = await obtenerEventoOFallar(idEvento);
    verificarPropiedad(evento, idClienteSolicitante);
    verificarEventoActivo(evento);

    const creados: Invitado[] = [];
    for (const fila of filas) {
      const invitado = invitadoRepository().create({
        ...fila,
        id_evento: idEvento,
        acompanantes_permitidos: fila.acompanantes_permitidos ?? 0,
        token_confirmacion: generarToken(),
      });
      const guardado = await invitadoRepository().save(invitado);
      await enviarInvitacion(guardado, evento);
      creados.push(guardado);
    }
    return creados;
  }

  async actualizar(
    id: number,
    idClienteSolicitante: number,
    datos: Partial<CrearInvitadoInput>
  ): Promise<Invitado> {
    const invitado = await findInvitadoConEvento(id);
    if (!invitado) {
      throw new AppError("Invitado no encontrado", 404);
    }
    verificarPropiedad(invitado.evento, idClienteSolicitante);
    verificarEventoActivo(invitado.evento);

    Object.assign(invitado, datos);
    return invitadoRepository().save(invitado);
  }

  async eliminar(id: number, idClienteSolicitante: number): Promise<void> {
    const invitado = await findInvitadoConEvento(id);
    if (!invitado) {
      throw new AppError("Invitado no encontrado", 404);
    }
    verificarPropiedad(invitado.evento, idClienteSolicitante);
    verificarEventoActivo(invitado.evento);

    await invitadoRepository().remove(invitado);
  }

  async reenviarInvitacion(id: number, idClienteSolicitante: number): Promise<Invitado> {
    const invitado = await findInvitadoConEvento(id);
    if (!invitado) {
      throw new AppError("Invitado no encontrado", 404);
    }
    verificarPropiedad(invitado.evento, idClienteSolicitante);
    verificarEventoActivo(invitado.evento);

    await enviarInvitacion(invitado, invitado.evento);
    return invitado;
  }

  async obtenerParaRsvp(token: string): Promise<{ invitado: Invitado; evento: Evento; finalizado: boolean }> {
    const invitado = await findInvitadoByToken(token);
    if (!invitado) {
      throw new AppError("Enlace de confirmación inválido", 404);
    }

    const finalizado =
      invitado.estado_confirmacion === EstadoConfirmacionInvitado.PENDIENTE &&
      new Date(invitado.evento.fecha_fin) < new Date();

    return { invitado, evento: invitado.evento, finalizado };
  }

  async responderRsvp(token: string, respuesta: RespuestaRsvpInput): Promise<Invitado> {
    const invitado = await findInvitadoByToken(token);
    if (!invitado) {
      throw new AppError("Enlace de confirmación inválido", 404);
    }

    if (invitado.estado_confirmacion !== EstadoConfirmacionInvitado.PENDIENTE) {
      throw new AppError("Ya registraste tu respuesta para este evento", 400);
    }

    if (new Date(invitado.evento.fecha_fin) < new Date()) {
      throw new AppError("El evento ya finalizó", 400);
    }

    if (respuesta.confirma) {
      const acompanantes = respuesta.acompanantes ?? 0;
      if (acompanantes > invitado.acompanantes_permitidos) {
        throw new AppError(`El máximo de acompañantes permitido es ${invitado.acompanantes_permitidos}`, 400);
      }
      invitado.estado_confirmacion = EstadoConfirmacionInvitado.CONFIRMADO;
      invitado.acompanantes_confirmados = acompanantes;
    } else {
      invitado.estado_confirmacion = EstadoConfirmacionInvitado.RECHAZADO;
      invitado.acompanantes_confirmados = 0;
    }

    if (respuesta.notas_especiales !== undefined) {
      invitado.notas_especiales = respuesta.notas_especiales;
    }
    invitado.fecha_respuesta = new Date();

    return invitadoRepository().save(invitado);
  }
}
