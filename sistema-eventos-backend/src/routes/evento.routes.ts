import { Router } from "express";
import * as EventoController from "../controllers/evento.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { CrearEventoDto, ActualizarEventoDto } from "../dtos/evento.dto";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * /eventos:
 *   get:
 *     summary: Lista todos los eventos
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Evento' } }
 *       401: { description: No autenticado }
 *       403: { description: No autorizado (solo Administrador) }
 */
router.get("/eventos", requireRole("administrador"), EventoController.listar);

/**
 * @swagger
 * /mis-eventos:
 *   get:
 *     summary: Lista los eventos del Cliente autenticado
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos del cliente
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Evento' } }
 *       403: { description: No autorizado (solo Cliente) }
 */
router.get("/mis-eventos", requireRole("cliente"), EventoController.misEventos);

/**
 * @swagger
 * /eventos/{id}:
 *   get:
 *     summary: Detalle de un evento (el Cliente solo puede ver el suyo)
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Evento
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Evento' }
 *       403: { description: No autorizado }
 *       404: { description: Evento no encontrado }
 */
router.get("/eventos/:id", EventoController.obtener);

/**
 * @swagger
 * /eventos:
 *   post:
 *     summary: Crea un evento y lo asocia a un Cliente
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, id_tipo_evento, id_cliente, fecha_inicio, fecha_fin, ubicacion]
 *             properties:
 *               nombre: { type: string }
 *               id_tipo_evento: { type: integer }
 *               id_cliente: { type: integer }
 *               fecha_inicio: { type: string, format: date }
 *               fecha_fin: { type: string, format: date }
 *               ubicacion: { type: string }
 *               capacidad_estimada: { type: integer }
 *               presupuesto_estimado: { type: number }
 *               descripcion: { type: string }
 *               dias_anticipacion_recordatorio: { type: integer }
 *     responses:
 *       201:
 *         description: Evento creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Evento' }
 *       400: { description: Faltan campos obligatorios }
 *       403: { description: No autorizado (solo Administrador) }
 */
router.post(
  "/eventos",
  requireRole("administrador"),
  validateBody(CrearEventoDto),
  EventoController.crear
);

/**
 * @swagger
 * /eventos/{id}:
 *   put:
 *     summary: Actualiza datos del evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Evento' }
 *     responses:
 *       200:
 *         description: Evento actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Evento' }
 *       400: { description: "El evento está cancelado, o se intentó pasar a estado Cancelado por esta vía" }
 *       403: { description: No autorizado (solo Administrador) }
 *       404: { description: Evento no encontrado }
 */
router.put(
  "/eventos/:id",
  requireRole("administrador"),
  validateBody(ActualizarEventoDto),
  EventoController.actualizar
);

/**
 * @swagger
 * /eventos/{id}/cancelar:
 *   post:
 *     summary: Cancela un evento (no se elimina; solo permitido desde Planificado, Confirmado o En curso)
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Evento cancelado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Evento' }
 *       400: { description: No se puede cancelar un evento Finalizado o ya Cancelado }
 *       403: { description: No autorizado (solo Administrador) }
 *       404: { description: Evento no encontrado }
 */
router.post("/eventos/:id/cancelar", requireRole("administrador"), EventoController.cancelar);

/**
 * @swagger
 * /eventos/{id}/resumen:
 *   get:
 *     summary: Resumen agregado del evento (invitados por estado, proveedores contratados, total pagado validado)
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Resumen del evento }
 *       403: { description: No autorizado }
 *       404: { description: Evento no encontrado }
 */
router.get("/eventos/:id/resumen", EventoController.resumen);

export default router;
