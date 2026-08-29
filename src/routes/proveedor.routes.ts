import { Router } from "express";
import * as ProveedorController from "../controllers/proveedor.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { CrearProveedorDto, ActualizarProveedorDto } from "../dtos/proveedor.dto";

const router = Router();

router.use(requireAuth, requireRole("administrador"));

/**
 * @swagger
 * /proveedores:
 *   get:
 *     summary: Catálogo de proveedores
 *     tags: [Proveedores]
 *     responses:
 *       200:
 *         description: Lista de proveedores
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Proveedor' } }
 */
router.get("/", ProveedorController.listar);

/**
 * @swagger
 * /proveedores:
 *   post:
 *     summary: Crea un proveedor
 *     tags: [Proveedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre_empresa, id_categoria]
 *             properties:
 *               nombre_empresa: { type: string }
 *               id_categoria: { type: integer }
 *               contacto_nombre: { type: string }
 *               telefono: { type: string }
 *               email: { type: string }
 *     responses:
 *       201:
 *         description: Proveedor creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Proveedor' }
 *       400: { description: Faltan campos obligatorios }
 */
router.post("/", validateBody(CrearProveedorDto), ProveedorController.crear);

/**
 * @swagger
 * /proveedores/{id}:
 *   put:
 *     summary: Actualiza un proveedor
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Proveedor' }
 *     responses:
 *       200:
 *         description: Proveedor actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Proveedor' }
 *       404: { description: No encontrado }
 */
router.put("/:id", validateBody(ActualizarProveedorDto), ProveedorController.actualizar);

export default router;
