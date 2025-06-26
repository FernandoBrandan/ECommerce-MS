import { Router, Request, Response, response } from "express"
const router = Router()

import { createProductService, getAllProductsService, getProductService, updateProductService, deleteProductService } from "./productService"


/**
 * @swagger
 * /product:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Zapatilla Deportiva"
 *               description:
 *                 type: string
 *                 example: "Zapatilla cómoda para correr"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 89.99
 *               stock:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       201:
 *         description: Producto creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Error de validación o datos incorrectos
 */
router.post("/product", async (req: Request, res: Response) => {
    try {
        const newProduct = await createProductService(req.body)
        res.status(201).json({
            message: newProduct.message,
            response: newProduct.newProduct,
        })
    } catch (error: Error | any) {
        res.status(400).json({ message: error.message })
    }
})


/**
 * @swagger 
 * /product:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Error en la solicitud
 */
router.get("/product", async (req: Request, res: Response) => {
    try {
        const products = await getAllProductsService()
        res.status(200).json({
            message: products.message,
            response: products.res,
        })
    } catch (error: Error | any) {
        res.status(400).json({ message: error.message })
    }
})


/**
 * @swagger
 * /product/{name}:
 *   get:
 *     summary: Obtener un producto por nombre
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del producto a buscar
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 */
router.get("/product/:name", async (req: Request, res: Response) => {
    try {
        const product = await getProductService(req.params.name)
        res.status(200).json({
            message: product.message,
            response: product.res,
        })
    } catch (error: Error | any) {
        res.status(400).json({ message: error.message })
    }
})


/**
 * @swagger
 * /product:
 *   put:
 *     summary: Actualizar un producto existente
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Zapatilla Deportiva"
 *               description:
 *                 type: string
 *                 example: "Zapatilla actualizada para correr"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 95.99
 *               stock:
 *                 type: integer
 *                 example: 150
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product updated"
 *                 res:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Error de validación o producto no encontrado
 */
router.put("/product", async (req: Request, res: Response) => {
    try {
        const product = await updateProductService(req.body)
        res.status(200).json({
            message: product.message,
            response: product.res,
        })
    } catch (error: Error | any) {
        res.status(400).json({ message: error.message })
    }
})


/**
 * @swagger
 * /product:
 *   delete:
 *     summary: Eliminar un producto por nombre
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Zapatilla Deportiva"
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted"
 *       400:
 *         description: Producto no encontrado o error en la solicitud
 */
router.delete("/product", async (req: Request, res: Response) => {
    try {
        const product = await deleteProductService(req.body.name)
        res.status(200).json({
            message: product.message,
            response: product.res,
        })
    } catch (error: Error | any) {
        res.status(400).json({ message: error.message })
    }
})


export default router