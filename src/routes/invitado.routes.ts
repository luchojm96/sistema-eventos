import { Router } from "express";
import * as InvitadoController from "../controllers/invitado.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { uploadInvitados } from "../middlewares/upload.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { CrearInvitadoDto, ActualizarInvitadoDto } from "../dtos/invitado.dto";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * /eventos/{id}/invitados:
 *   get:
 *     summary: Lista invitados de un evento
 *     tags: [Invitados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de invitados
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Invitado' } }
 *       403: { description: No autorizado }
 */
router.get("/eventos/:id/invitados", InvitadoController.listar);

/**
 * @swagger
 * /eventos/{id}/invitados:
 *   post:
 *     summary: Registra un invitado (envía automáticamente el email con el enlace de confirmación)
 *     tags: [Invitados]
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
 *             required: [nombre, apellido]
 *             properties:
 *               nombre: { type: string }
 *               apellido: { type: string }
 *               email: { type: string }
 *               telefono: { type: string }
 *               acompanantes_permitidos: { type: integer }
 *               notas_especiales: { type: string }
 *     responses:
 *       201:
 *         description: Invitado creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Invitado' }
 *       400: { description: Faltan campos obligatorios }
 *       403: { description: "No autorizado (solo Cliente, y solo sobre su propio evento)" }
 */
router.post(
  "/eventos/:id/invitados",
  requireRole("cliente"),
  validateBody(CrearInvitadoDto),
  InvitadoController.crear
);

/**
 * @swagger
 * /eventos/{id}/invitados/importar:
 *   post:
 *     summary: Carga masiva de invitados vía archivo .csv o .xlsx
 *     tags: [Invitados]
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
 *             properties:
 *               archivo:
 *                 type: string
 *                 format: binary
 *                 description: Columnas esperadas nombre, apellido, email, telefono, acompanantes_permitidos, notas_especiales
 *     responses:
 *       201: { description: Invitados importados }
 *       400: { description: Archivo faltante o sin filas válidas }
 *       403: { description: No autorizado (solo Cliente) }
 */
router.post(
  "/eventos/:id/invitados/importar",
  requireRole("cliente"),
  uploadInvitados.single("archivo"),
  InvitadoController.importar
);

/**
 * @swagger
 * /invitados/{id}:
 *   put:
 *     summary: Actualiza datos de un invitado
 *     tags: [Invitados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Invitado' }
 *     responses:
 *       200:
 *         description: Invitado actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Invitado' }
 *       403: { description: No autorizado (solo Cliente dueño del evento) }
 *       404: { description: Invitado no encontrado }
 */
router.put(
  "/invitados/:id",
  requireRole("cliente"),
  validateBody(ActualizarInvitadoDto),
  InvitadoController.actualizar
);

/**
 * @swagger
 * /invitados/{id}:
 *   delete:
 *     summary: Elimina un invitado
 *     tags: [Invitados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Invitado eliminado }
 *       403: { description: No autorizado (solo Cliente dueño del evento) }
 *       404: { description: Invitado no encontrado }
 */
router.delete("/invitados/:id", requireRole("cliente"), InvitadoController.eliminar);

/**
 * @swagger
 * /invitados/{id}/reenviar-invitacion:
 *   post:
 *     summary: Reenvía manualmente el enlace de confirmación
 *     tags: [Invitados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Invitación reenviada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Invitado' }
 *       403: { description: No autorizado (solo Cliente dueño del evento) }
 *       404: { description: Invitado no encontrado }
 */
router.post("/invitados/:id/reenviar-invitacion", requireRole("cliente"), InvitadoController.reenviarInvitacion);

export default router;
