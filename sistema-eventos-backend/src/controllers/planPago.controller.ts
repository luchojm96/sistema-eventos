import { Request, Response } from "express";
import { PlanPagoService } from "../services/planPago.service";
import { CrearPlanPagoDto, ActualizarCuotaDto, AgregarCuotaDto } from "../dtos/pago.dto";

const planPagoService = new PlanPagoService();

export async function obtener(req: Request, res: Response) {
  res.json(
    await planPagoService.obtenerPorEvento(Number(req.params.id), req.user!.rol, req.user!.id)
  );
}

export async function crear(req: Request, res: Response) {
  const { cuotas } = req.body as CrearPlanPagoDto;
  res.status(201).json(await planPagoService.crearPlan(Number(req.params.id), cuotas));
}

export async function agregarCuota(req: Request, res: Response) {
  res.status(201).json(
    await planPagoService.agregarCuota(Number(req.params.id), req.body as AgregarCuotaDto)
  );
}

export async function actualizarCuota(req: Request, res: Response) {
  res.json(
    await planPagoService.actualizarCuota(Number(req.params.cuotaId), req.body as ActualizarCuotaDto)
  );
}
