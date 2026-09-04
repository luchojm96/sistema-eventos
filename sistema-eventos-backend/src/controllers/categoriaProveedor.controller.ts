import { Request, Response } from "express";
import { CategoriaProveedorService } from "../services/categoriaProveedor.service";
import { CrearCategoriaProveedorDto, ActualizarCategoriaProveedorDto } from "../dtos/categoriaProveedor.dto";

const categoriaProveedorService = new CategoriaProveedorService();

export async function listar(_req: Request, res: Response) {
  res.json(await categoriaProveedorService.listar());
}

export async function crear(req: Request, res: Response) {
  const { nombre } = req.body as CrearCategoriaProveedorDto;
  res.status(201).json(await categoriaProveedorService.crear(nombre));
}

export async function actualizar(req: Request, res: Response) {
  const { nombre, activo } = req.body as ActualizarCategoriaProveedorDto;
  res.json(await categoriaProveedorService.actualizar(Number(req.params.id), { nombre, activo }));
}
