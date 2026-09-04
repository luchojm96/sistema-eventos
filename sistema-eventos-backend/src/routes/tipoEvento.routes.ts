import { Router } from "express";
import * as TipoEventoController from "../controllers/tipoEvento.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { CrearTipoEventoDto, ActualizarTipoEventoDto } from "../dtos/tipoEvento.dto";

const router = Router();

router.use(requireAuth, requireRole("administrador"));

/**
 * @swagger
 * /tipos-evento:
 *   get:
 *     summary: Catálogo de tipos de evento
 *     tags: [Catálogos]
 *     responses:
 *       200:
 *         description: Lista de tipos de evento
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/TipoEvento' } }
 *       403: { description: No autorizado (solo Administrador) }
 */
router.get("/", TipoEventoController.listar);

/**
 * @swagger
 * /tipos-evento:
 *   post:
 *     summary: Crea un tipo de evento
 *     tags: [Catálogos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre: { type: string }
 *     responses:
 *       201:
 *         description: Tipo de evento creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TipoEvento' }
 *       400: { description: nombre es obligatorio }
 */
router.post("/", validateBody(CrearTipoEventoDto), TipoEventoController.crear);

/**
 * @swagger
 * /tipos-evento/{id}:
 *   put:
 *     summary: Actualiza un tipo de evento (nombre y/o activo)
 *     tags: [Catálogos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: { type: string }
 *               activo: { type: boolean }
 *     responses:
 *       200:
 *         description: Tipo de evento actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TipoEvento' }
 *       404: { description: No encontrado }
 */
router.put("/:id", validateBody(ActualizarTipoEventoDto), TipoEventoController.actualizar);

export default router;
