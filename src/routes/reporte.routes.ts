import { Router } from "express";
import * as ReporteController from "../controllers/reporte.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * /reportes/asistencia/{idEvento}:
 *   get:
 *     summary: Reporte de asistencia del evento (confirmados, pendientes, rechazados)
 *     tags: [Reportes]
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Resumen de asistencia + listado de invitados }
 *       403: { description: No autorizado }
 *       404: { description: Evento no encontrado }
 */
router.get("/asistencia/:idEvento", ReporteController.asistencia);

/**
 * @swagger
 * /reportes/financiero/{idEvento}:
 *   get:
 *     summary: >
 *       Reporte financiero del evento. El Administrador ve el detalle completo
 *       (ingresos + egresos + rentabilidad); el Cliente ve solo el bloque de
 *       ingresos (sus propios pagos y plan de cuotas), sin egresos a proveedores.
 *     tags: [Reportes]
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Reporte financiero }
 *       403: { description: No autorizado }
 *       404: { description: Evento no encontrado }
 */
router.get("/financiero/:idEvento", ReporteController.financiero);

/**
 * @swagger
 * /reportes/proveedores:
 *   get:
 *     summary: Ranking de proveedores más contratados
 *     tags: [Reportes]
 *     responses:
 *       200: { description: Lista de proveedores con cantidad de contrataciones }
 *       403: { description: No autorizado (solo Administrador) }
 */
router.get("/proveedores", requireRole("administrador"), ReporteController.proveedores);

export default router;
