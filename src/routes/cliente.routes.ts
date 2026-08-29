import { Router } from "express";
import * as ClienteController from "../controllers/cliente.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { ActualizarClienteDto, ActualizarPerfilClienteDto, CambiarPasswordDto } from "../dtos/cliente.dto";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Lista todos los clientes registrados
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Cliente' } }
 *       403: { description: Solo Administrador, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.get("/", requireRole("administrador"), ClienteController.listar);

/**
 * @swagger
 * /clientes/me:
 *   put:
 *     summary: El Cliente autenticado edita sus propios datos (nombre, teléfono)
 *     tags: [Clientes]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: { type: string }
 *               telefono: { type: string }
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Cliente' }
 *       403: { description: Solo Cliente, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.put(
  "/me",
  requireRole("cliente"),
  validateBody(ActualizarPerfilClienteDto),
  ClienteController.actualizarPerfil
);

/**
 * @swagger
 * /clientes/me/password:
 *   put:
 *     summary: El Cliente autenticado cambia su contraseña
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password_actual, password_nueva]
 *             properties:
 *               password_actual: { type: string, format: password }
 *               password_nueva: { type: string, format: password }
 *     responses:
 *       200: { description: Contraseña actualizada }
 *       400: { description: La contraseña actual es incorrecta, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       403: { description: Solo Cliente, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.put(
  "/me/password",
  requireRole("cliente"),
  validateBody(CambiarPasswordDto),
  ClienteController.cambiarPassword
);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Detalle de un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Cliente' }
 *       403: { description: Solo Administrador, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       404: { description: No encontrado, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.get("/:id", requireRole("administrador"), ClienteController.obtener);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: El Administrador corrige datos de un cliente o lo desactiva
 *     tags: [Clientes]
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
 *               telefono: { type: string }
 *               activo: { type: boolean }
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Cliente' }
 *       403: { description: Solo Administrador, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       404: { description: No encontrado, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.put("/:id", requireRole("administrador"), validateBody(ActualizarClienteDto), ClienteController.actualizar);

export default router;
