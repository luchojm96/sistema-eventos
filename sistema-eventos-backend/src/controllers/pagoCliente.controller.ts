import { Request, Response } from "express";
import { PagoClienteService } from "../services/pagoCliente.service";
import { urlComprobante } from "../middlewares/uploadComprobante.middleware";
import { RegistrarPagoDto, ValidarPagoDto } from "../dtos/pago.dto";

const pagoClienteService = new PagoClienteService();

export async function listar(req: Request, res: Response) {
  const pagos = await pagoClienteService.listarPorEvento(Number(req.params.id), req.user!.rol, req.user!.id);
  res.json(pagos);
}

export async function registrar(req: Request, res: Response) {
  const { id_cuota, monto, fecha_pago, metodo_pago } = req.body as RegistrarPagoDto;
  const comprobante_url = req.file ? urlComprobante(req.file.filename) : undefined;

  const pago = await pagoClienteService.registrar(Number(req.params.id), req.user!.rol, req.user!.id, {
    id_cuota,
    monto,
    fecha_pago,
    metodo_pago,
    comprobante_url,
  });
  res.status(201).json(pago);
}

export async function validar(req: Request, res: Response) {
  const { decision } = req.body as ValidarPagoDto;
  res.json(await pagoClienteService.validar(Number(req.params.id), decision));
}
