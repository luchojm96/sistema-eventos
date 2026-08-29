import { Request, Response } from "express";
import { TipoEventoService } from "../services/tipoEvento.service";
import { CrearTipoEventoDto, ActualizarTipoEventoDto } from "../dtos/tipoEvento.dto";

const tipoEventoService = new TipoEventoService();

export async function listar(_req: Request, res: Response) {
  res.json(await tipoEventoService.listar());
}

export async function crear(req: Request, res: Response) {
  const { nombre } = req.body as CrearTipoEventoDto;
  res.status(201).json(await tipoEventoService.crear(nombre));
}

export async function actualizar(req: Request, res: Response) {
  const { nombre, activo } = req.body as ActualizarTipoEventoDto;
  res.json(await tipoEventoService.actualizar(Number(req.params.id), { nombre, activo }));
}
