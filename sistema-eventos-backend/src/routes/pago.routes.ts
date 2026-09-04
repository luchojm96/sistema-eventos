import { Router } from "express";
import * as PlanPagoController from "../controllers/planPago.controller";
import * as PagoClienteController from "../controllers/pagoCliente.controller";
import * as PagoProveedorController from "../controllers/pagoProveedor.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { uploadComprobante } from "../middlewares/uploadComprobante.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { CrearPlanPagoDto, ActualizarCuotaDto, RegistrarPagoDto, ValidarPagoDto, RegistrarEgresoDto } from "../dtos/pago.dto";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * /eventos/{id}/plan-pagos:
 *   get:
 *     summary: Consulta el plan de cuotas del evento (incluye campo derivado `pagada` por cuota)
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Cuotas del plan
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/PlanPago' } }
 *       403: { description: "No autorizado (el Cliente solo puede ver el plan de su propio evento)" }
 *       404: { description: Evento no encontrado }
 */
router.get("/eventos/:id/plan-pagos", PlanPagoController.obtener);

/**
 * @swagger
 * /eventos/{id}/plan-pagos:
 *   post:
 *     summary: Define el plan de cuotas del evento (solo si el evento no tiene uno todavía)
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cuotas]
 *             properties:
 *               cuotas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [numero_cuota, monto, fecha_limite]
 *                   properties:
 *                     numero_cuota: { type: integer }
 *                     monto: { type: number }
 *                     fecha_limite: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Plan creado
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/PlanPago' } }
 *       400: { description: Body inválido }
 *       403: { description: No autorizado (solo Administrador) }
 *       409: { description: El evento ya tiene un plan de pagos definido }
 */
router.post(
  "/eventos/:id/plan-pagos",
  requireRole("administrador"),
  validateBody(CrearPlanPagoDto),
  PlanPagoController.crear
);

/**
 * @swagger
 * /plan-pagos/{cuotaId}:
 *   put:
 *     summary: Actualiza una cuota del plan
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: cuotaId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero_cuota: { type: integer }
 *               monto: { type: number }
 *               fecha_limite: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Cuota actualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PlanPago' }
 *       403: { description: No autorizado (solo Administrador) }
 *       404: { description: Cuota no encontrada }
 */
router.put(
  "/plan-pagos/:cuotaId",
  requireRole("administrador"),
  validateBody(ActualizarCuotaDto),
  PlanPagoController.actualizarCuota
);

/**
 * @swagger
 * /eventos/{id}/pagos:
 *   get:
 *     summary: Lista los pagos (ingresos) del evento
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de pagos
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/PagoCliente' } }
 *       403: { description: No autorizado }
 *       404: { description: Evento no encontrado }
 */
router.get("/eventos/:id/pagos", PagoClienteController.listar);

/**
 * @swagger
 * /eventos/{id}/pagos:
 *   post:
 *     summary: >
 *       Registra un pago del Cliente. Si lo registra el Cliente queda en estado
 *       Reportado (pendiente de validación); si lo registra el Administrador queda
 *       Validado de inmediato.
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [monto, fecha_pago, metodo_pago]
 *             properties:
 *               id_cuota: { type: integer }
 *               monto: { type: number }
 *               fecha_pago: { type: string, format: date }
 *               metodo_pago: { type: string, enum: [Efectivo, Transferencia, Tarjeta, QR] }
 *               comprobante: { type: string, format: binary, description: Opcional, PDF/JPG/PNG }
 *     responses:
 *       201:
 *         description: Pago registrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PagoCliente' }
 *       400: { description: Faltan campos obligatorios, o la cuota no pertenece a este evento }
 *       403: { description: No autorizado }
 */
router.post(
  "/eventos/:id/pagos",
  uploadComprobante.single("comprobante"),
  validateBody(RegistrarPagoDto),
  PagoClienteController.registrar
);

/**
 * @swagger
 * /pagos/{id}/validar:
 *   put:
 *     summary: Valida o rechaza un pago reportado por el Cliente
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [decision]
 *             properties:
 *               decision: { type: string, enum: [Validado, Rechazado] }
 *     responses:
 *       200:
 *         description: Pago actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PagoCliente' }
 *       400: { description: "decision inválida, o el pago no está en estado Reportado" }
 *       403: { description: No autorizado (solo Administrador) }
 *       404: { description: Pago no encontrado }
 */
router.put(
  "/pagos/:id/validar",
  requireRole("administrador"),
  validateBody(ValidarPagoDto),
  PagoClienteController.validar
);

/**
 * @swagger
 * /eventos/{id}/egresos:
 *   get:
 *     summary: Consulta los pagos (egresos) a proveedores del evento
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de egresos
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/PagoProveedor' } }
 *       403: { description: No autorizado (solo Administrador) }
 *       404: { description: Evento no encontrado }
 */
router.get("/eventos/:id/egresos", requireRole("administrador"), PagoProveedorController.listar);

/**
 * @swagger
 * /eventos/{id}/egresos:
 *   post:
 *     summary: >
 *       Registra un pago a un proveedor contratado. Al registrarlo se recalcula
 *       automáticamente el estado_contrato de la contratación a Pagado si el total
 *       pagado alcanza el costo_acordado.
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_evento_proveedor, monto, fecha_pago, metodo_pago]
 *             properties:
 *               id_evento_proveedor: { type: integer }
 *               monto: { type: number }
 *               fecha_pago: { type: string, format: date }
 *               metodo_pago: { type: string, enum: [Efectivo, Transferencia, Tarjeta, QR] }
 *     responses:
 *       201:
 *         description: Egreso registrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PagoProveedor' }
 *       400: { description: Faltan campos obligatorios, o la contratación no pertenece a este evento }
 *       403: { description: No autorizado (solo Administrador) }
 */
router.post(
  "/eventos/:id/egresos",
  requireRole("administrador"),
  validateBody(RegistrarEgresoDto),
  PagoProveedorController.registrar
);

export default router;
