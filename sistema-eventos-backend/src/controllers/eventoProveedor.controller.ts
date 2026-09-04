import { Request, Response } from "express";
import { EventoProveedorService } from "../services/eventoProveedor.service";
import { EventoService } from "../services/evento.service";
import { AppError } from "../utils/AppError";
import { ContratarProveedorDto, ActualizarContratacionDto } from "../dtos/eventoProveedor.dto";

const eventoProveedorService = new EventoProveedorService();
const eventoService = new EventoService();

export async function listar(req: Request, res: Response) {
  const idEvento = Number(req.params.id);
  const evento = await eventoService.obtenerPorId(idEvento);
  if (req.user!.rol === "cliente" && evento.id_cliente !== req.user!.id) {
    throw new AppError("No autorizado", 403);
  }
  res.json(await eventoProveedorService.listarPorEvento(idEvento));
}

export async function contratar(req: Request, res: Response) {
  const contratacion = await eventoProveedorService.contratar(
    Number(req.params.id),
    req.body as ContratarProveedorDto
  );
  res.status(201).json(contratacion);
}

export async function actualizar(req: Request, res: Response) {
  const contratacion = await eventoProveedorService.actualizar(
    Number(req.params.contratacionId),
    req.body as ActualizarContratacionDto
  );
  res.json(contratacion);
}

export async function cancelar(req: Request, res: Response) {
  const contratacion = await eventoProveedorService.cancelar(Number(req.params.contratacionId));
  res.json(contratacion);
}
