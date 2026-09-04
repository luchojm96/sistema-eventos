import { Router } from "express";
import * as EventoProveedorController from "../controllers/eventoProveedor.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { ContratarProveedorDto, ActualizarContratacionDto } from "../dtos/eventoProveedor.dto";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * /eventos/{id}/proveedores:
 *   get:
 *     summary: Proveedores/servicios contratados para un evento (Cliente solo puede ver el suyo)
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de contrataciones
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/EventoProveedor' } }
 *       403: { description: No autorizado }
 */
router.get("/eventos/:id/proveedores", EventoProveedorController.listar);

/**
 * @swagger
 * /eventos/{id}/proveedores:
 *   post:
 *     summary: Contrata un proveedor para un evento
 *     tags: [Proveedores]
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
 *             required: [id_proveedor, costo_acordado, fecha_servicio]
 *             properties:
 *               id_proveedor: { type: integer }
 *               descripcion_servicio: { type: string }
 *               costo_acordado: { type: number }
 *               fecha_servicio: { type: string, format: date }
 *               hora_inicio: { type: string }
 *               hora_fin: { type: string }
 *               cantidad: { type: integer }
 *     responses:
 *       201:
 *         description: Contratación creada (estado_contrato Cotizado)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/EventoProveedor' }
 *       400: { description: Faltan campos obligatorios }
 *       403: { description: No autorizado (solo Administrador) }
 */
router.post(
  "/eventos/:id/proveedores",
  requireRole("administrador"),
  validateBody(ContratarProveedorDto),
  EventoProveedorController.contratar
);

/**
 * @swagger
 * /eventos/{id}/proveedores/{contratacionId}:
 *   put:
 *     summary: Actualiza una contratación (el estado Pagado no se puede setear manualmente)
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: contratacionId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/EventoProveedor' }
 *     responses:
 *       200:
 *         description: Contratación actualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/EventoProveedor' }
 *       400: { description: Se intentó setear estado_contrato en Pagado manualmente }
 *       403: { description: No autorizado (solo Administrador) }
 *       404: { description: Contratación no encontrada }
 */
router.put(
  "/eventos/:id/proveedores/:contratacionId",
  requireRole("administrador"),
  validateBody(ActualizarContratacionDto),
  EventoProveedorController.actualizar
);

/**
 * @swagger
 * /eventos/{id}/proveedores/{contratacionId}:
 *   delete:
 *     summary: Cancela una contratación (no se elimina el registro, pasa a estado_contrato Cancelado)
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: contratacionId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Contratación cancelada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/EventoProveedor' }
 *       403: { description: No autorizado (solo Administrador) }
 *       404: { description: Contratación no encontrada }
 */
router.delete(
  "/eventos/:id/proveedores/:contratacionId",
  requireRole("administrador"),
  EventoProveedorController.cancelar
);

export default router;
