import { Router } from "express";
import { login, registro, me, logout } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { LoginDto, RegistroDto } from "../dtos/auth.dto";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión (Administrador o Cliente) y setea la cookie JWT httpOnly
 *     tags: [Autenticación]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user: { $ref: '#/components/schemas/Usuario' }
 *       400: { description: Faltan campos obligatorios, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       401: { description: Credenciales inválidas, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.post("/login", validateBody(LoginDto), login);

/**
 * @swagger
 * /auth/registro:
 *   post:
 *     summary: Autorregistro de Cliente (sin verificación de email)
 *     tags: [Autenticación]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *               telefono: { type: string }
 *     responses:
 *       201:
 *         description: Cliente registrado y sesión iniciada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user: { $ref: '#/components/schemas/Usuario' }
 *       400: { description: Faltan campos obligatorios, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       409: { description: El email ya está registrado, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.post("/registro", validateBody(RegistroDto), registro);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Datos del usuario autenticado actual
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user: { $ref: '#/components/schemas/Usuario' }
 *       401: { description: No autenticado, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.get("/me", requireAuth, me);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cierra sesión (limpia la cookie JWT)
 *     tags: [Autenticación]
 *     responses:
 *       200: { description: Sesión cerrada }
 *       401: { description: No autenticado, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.post("/logout", requireAuth, logout);

export default router;
