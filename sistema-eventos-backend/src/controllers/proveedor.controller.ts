import { Request, Response } from "express";
import { ProveedorService } from "../services/proveedor.service";
import { CrearProveedorDto, ActualizarProveedorDto } from "../dtos/proveedor.dto";

const proveedorService = new ProveedorService();

export async function listar(_req: Request, res: Response) {
  res.json(await proveedorService.listar());
}

export async function crear(req: Request, res: Response) {
  res.status(201).json(await proveedorService.crear(req.body as CrearProveedorDto));
}

export async function actualizar(req: Request, res: Response) {
  res.json(await proveedorService.actualizar(Number(req.params.id), req.body as ActualizarProveedorDto));
}
