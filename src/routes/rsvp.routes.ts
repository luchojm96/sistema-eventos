import { Router } from "express";
import * as RsvpController from "../controllers/rsvp.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { ResponderRsvpDto } from "../dtos/rsvp.dto";

const router = Router();

/**
 * @swagger
 * /rsvp/{token}:
 *   get:
 *     summary: Muestra los datos del evento e invitado para confirmar asistencia (público, sin login)
 *     tags: [RSVP]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: >
 *           Datos del evento e invitado. `finalizado: true` si el evento ya pasó
 *           y el invitado nunca respondió (se debe mostrar "El evento ya finalizó").
 *       404: { description: Enlace de confirmación inválido }
 */
router.get("/:token", RsvpController.obtener);

/**
 * @swagger
 * /rsvp/{token}:
 *   post:
 *     summary: Registra la respuesta del invitado (fija, no editable después de enviada)
 *     tags: [RSVP]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [confirma]
 *             properties:
 *               confirma: { type: boolean }
 *               acompanantes: { type: integer, description: Solo si confirma = true; no puede superar acompanantes_permitidos }
 *               notas_especiales: { type: string }
 *     responses:
 *       200: { description: Respuesta registrada }
 *       400: { description: Ya respondió antes, el evento ya finalizó, o superó el máximo de acompañantes }
 *       404: { description: Enlace de confirmación inválido }
 */
router.post("/:token", validateBody(ResponderRsvpDto), RsvpController.responder);

export default router;
