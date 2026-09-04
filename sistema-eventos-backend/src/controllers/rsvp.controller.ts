import { Request, Response } from "express";
import { InvitadoService } from "../services/invitado.service";
import { ResponderRsvpDto } from "../dtos/rsvp.dto";

const invitadoService = new InvitadoService();

export async function obtener(req: Request, res: Response) {
  const { invitado, evento, finalizado } = await invitadoService.obtenerParaRsvp(String(req.params.token));

  res.json({
    finalizado,
    evento: {
      nombre: evento.nombre,
      fecha_inicio: evento.fecha_inicio,
      fecha_fin: evento.fecha_fin,
      ubicacion: evento.ubicacion,
    },
    invitado: {
      nombre: invitado.nombre,
      apellido: invitado.apellido,
      acompanantes_permitidos: invitado.acompanantes_permitidos,
      estado_confirmacion: invitado.estado_confirmacion,
      notas_especiales: invitado.notas_especiales,
    },
  });
}

export async function responder(req: Request, res: Response) {
  const { confirma, acompanantes, notas_especiales } = req.body as ResponderRsvpDto;

  const invitado = await invitadoService.responderRsvp(String(req.params.token), {
    confirma,
    acompanantes,
    notas_especiales,
  });

  res.json({
    estado_confirmacion: invitado.estado_confirmacion,
    acompanantes_confirmados: invitado.acompanantes_confirmados,
  });
}
