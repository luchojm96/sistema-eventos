import { Router } from "express";
import * as CategoriaProveedorController from "../controllers/categoriaProveedor.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { CrearCategoriaProveedorDto, ActualizarCategoriaProveedorDto } from "../dtos/categoriaProveedor.dto";

const router = Router();

router.use(requireAuth, requireRole("administrador"));

/**
 * @swagger
 * /categorias-proveedor:
 *   get:
 *     summary: Catálogo de categorías de proveedor
 *     tags: [Catálogos]
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/CategoriaProveedor' } }
 */
router.get("/", CategoriaProveedorController.listar);

/**
 * @swagger
 * /categorias-proveedor:
 *   post:
 *     summary: Crea una categoría de proveedor
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
 *         description: Categoría creada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CategoriaProveedor' }
 *       400: { description: nombre es obligatorio }
 */
router.post("/", validateBody(CrearCategoriaProveedorDto), CategoriaProveedorController.crear);

/**
 * @swagger
 * /categorias-proveedor/{id}:
 *   put:
 *     summary: Actualiza una categoría de proveedor (nombre y/o activo)
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
 *         description: Categoría actualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CategoriaProveedor' }
 *       404: { description: No encontrada }
 */
router.put("/:id", validateBody(ActualizarCategoriaProveedorDto), CategoriaProveedorController.actualizar);

export default router;
