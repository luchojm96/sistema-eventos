import { Request, Response } from "express";
import { PagoProveedorService } from "../services/pagoProveedor.service";
import { RegistrarEgresoDto } from "../dtos/pago.dto";

const pagoProveedorService = new PagoProveedorService();

export async function listar(req: Request, res: Response) {
  res.json(await pagoProveedorService.listarPorEvento(Number(req.params.id)));
}

export async function registrar(req: Request, res: Response) {
  const egreso = await pagoProveedorService.registrar(Number(req.params.id), req.body as RegistrarEgresoDto);
  res.status(201).json(egreso);
}
