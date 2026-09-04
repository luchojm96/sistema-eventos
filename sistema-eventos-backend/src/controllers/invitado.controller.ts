import { Request, Response } from "express";
import { InvitadoService } from "../services/invitado.service";
import { AppError } from "../utils/AppError";
import { parseInvitadosFile } from "../utils/importInvitados";
import { CrearInvitadoDto, ActualizarInvitadoDto } from "../dtos/invitado.dto";

const invitadoService = new InvitadoService();

function idClienteSolicitante(req: Request): number | null {
  return req.user!.rol === "cliente" ? req.user!.id : null;
}

export async function listar(req: Request, res: Response) {
  const invitados = await invitadoService.listarPorEvento(Number(req.params.id), idClienteSolicitante(req));
  res.json(invitados);
}

export async function crear(req: Request, res: Response) {
  const invitado = await invitadoService.crear(Number(req.params.id), req.user!.id, req.body as CrearInvitadoDto);
  res.status(201).json(invitado);
}

export async function importar(req: Request, res: Response) {
  if (!req.file) {
    throw new AppError("Debés adjuntar un archivo .csv o .xlsx válido", 400);
  }

  const filas = await parseInvitadosFile(req.file.buffer, req.file.originalname);
  if (filas.length === 0) {
    throw new AppError("El archivo no contiene filas válidas (se requieren al menos nombre y apellido)", 400);
  }

  const creados = await invitadoService.importarMasivo(Number(req.params.id), req.user!.id, filas);
  res.status(201).json({ creados: creados.length, invitados: creados });
}

export async function actualizar(req: Request, res: Response) {
  const invitado = await invitadoService.actualizar(
    Number(req.params.id),
    req.user!.id,
    req.body as ActualizarInvitadoDto
  );
  res.json(invitado);
}

export async function eliminar(req: Request, res: Response) {
  await invitadoService.eliminar(Number(req.params.id), req.user!.id);
  res.status(204).send();
}

export async function reenviarInvitacion(req: Request, res: Response) {
  const invitado = await invitadoService.reenviarInvitacion(Number(req.params.id), req.user!.id);
  res.json(invitado);
}
