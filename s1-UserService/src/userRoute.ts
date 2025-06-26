import Router, { Request, Response } from "express"

import { register, login } from "./userServices"

const router = Router()

/**
 * @swagger
 * /v1/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post("/register", async (req: Request, res: Response) => {
    try {
        const newUser = await register(req.body)
        res.status(201).json({
            message: newUser.message,
            user: newUser.user.name,
            email: newUser.user.email,
        })
    } catch (error: Error | any) {
        res.status(400).json({ message: error.message })
    }
})

/**
 * @swagger
 * /v1/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", async (req: Request, res: Response) => {
    try {
        const user = await login(req.body)
        res.status(201).json({
            message: user.message,
            email: user.email,
            token: user.token,
        })
    } catch (error: Error | any) {
        res.status(400).json({ message: error.message })
    }
})

router.get("/validate", async (req: Request, res: Response) => {
    res.status(200).json({ message: "profile" })
})

router.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ message: "User service is running" })
})

export default router