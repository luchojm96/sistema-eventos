import { Request, Response } from "express";
import { EventoService } from "../services/evento.service";
import { AppError } from "../utils/AppError";
import { CrearEventoDto, ActualizarEventoDto } from "../dtos/evento.dto";

const eventoService = new EventoService();

function verificarAccesoCliente(req: Request, idClienteEvento: number) {
  if (req.user!.rol === "cliente" && idClienteEvento !== req.user!.id) {
    throw new AppError("No autorizado", 403);
  }
}

export async function listar(_req: Request, res: Response) {
  res.json(await eventoService.listarTodos());
}

export async function misEventos(req: Request, res: Response) {
  res.json(await eventoService.listarPorCliente(req.user!.id));
}

export async function obtener(req: Request, res: Response) {
  const evento = await eventoService.obtenerPorId(Number(req.params.id));
  verificarAccesoCliente(req, evento.id_cliente);
  res.json(evento);
}

export async function crear(req: Request, res: Response) {
  const evento = await eventoService.crear(req.body as CrearEventoDto);
  res.status(201).json(evento);
}

export async function actualizar(req: Request, res: Response) {
  const evento = await eventoService.actualizar(Number(req.params.id), req.body as ActualizarEventoDto);
  res.json(evento);
}

export async function cancelar(req: Request, res: Response) {
  const evento = await eventoService.cancelar(Number(req.params.id));
  res.json(evento);
}

export async function resumen(req: Request, res: Response) {
  const id = Number(req.params.id);
  const evento = await eventoService.obtenerPorId(id);
  verificarAccesoCliente(req, evento.id_cliente);
  res.json(await eventoService.resumen(id));
}
