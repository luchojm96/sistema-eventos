import { Request, Response } from "express";
import { ClienteService } from "../services/cliente.service";
import { ActualizarClienteDto, ActualizarPerfilClienteDto, CambiarPasswordDto } from "../dtos/cliente.dto";

const clienteService = new ClienteService();

export async function listar(_req: Request, res: Response) {
  res.json(await clienteService.listar());
}

export async function obtener(req: Request, res: Response) {
  res.json(await clienteService.obtenerPorId(Number(req.params.id)));
}

export async function obtenerPerfil(req: Request, res: Response) {
  res.json(await clienteService.obtenerPorId(req.user!.id));
}

export async function actualizarPerfil(req: Request, res: Response) {
  const { nombre, telefono } = req.body as ActualizarPerfilClienteDto;
  res.json(await clienteService.actualizarPerfil(req.user!.id, { nombre, telefono }));
}

export async function cambiarPassword(req: Request, res: Response) {
  const { password_actual, password_nueva } = req.body as CambiarPasswordDto;
  await clienteService.cambiarPassword(req.user!.id, password_actual, password_nueva);
  res.json({ message: "Contraseña actualizada" });
}

export async function actualizar(req: Request, res: Response) {
  const { nombre, telefono, activo } = req.body as ActualizarClienteDto;
  res.json(await clienteService.actualizarComoAdministrador(Number(req.params.id), { nombre, telefono, activo }));
}
