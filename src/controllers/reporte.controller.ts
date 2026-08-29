import { Request, Response } from "express";
import { ReporteService } from "../services/reporte.service";

const reporteService = new ReporteService();

export async function asistencia(req: Request, res: Response) {
  const reporte = await reporteService.asistencia(Number(req.params.idEvento), req.user!.rol, req.user!.id);
  res.json(reporte);
}

export async function financiero(req: Request, res: Response) {
  const reporte = await reporteService.financiero(Number(req.params.idEvento), req.user!.rol, req.user!.id);
  res.json(reporte);
}

export async function proveedores(_req: Request, res: Response) {
  res.json(await reporteService.proveedoresMasContratados());
}
