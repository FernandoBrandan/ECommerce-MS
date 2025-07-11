import { Router, Request, Response } from "express"
const router = Router()
import { createOrderService, getOrderService } from "./orderService"
import { updateOrderStatusDB } from "./orderRepository"

// https://mermaid.live/view#pako:eNqFVcFu2kAQ_ZXVSpHaCkfYBpL40AttbklRaC8tFZp4B9jW3nXXdtQQ8TE99pBTP4Ef63jXNmBSygF5Zt6b2Zl5Xj_xWAvkEc8LKPCdhKWB1HsIZorR78ubr8zz3rIPRqCajw2CABexcDbjNsLqCGeQn8BOUAmJip4FsgkstSO07rn1HVLIwyZGx5hvfymhc6w55J87Pzh3lwZCM4-omIGpIOy9etg-65ZO8fkuekgnqKS4wzZGB1EYXO5hGvMANQYVY9KiWpM9Odw-9lazDHYZb_XcHfIYeYeY3uskJ4IbQMNpA8eca0gKqMaeFzr-7uBT-2ihmxemTpRECr0378ajHHp_0VYlh4tkEZsiW6JCA3RSXKBB6r86xM3EZegQbI7uYinNp7wEIzWLdZolSH1krU6O4XWSw_VSElsh1mohTVqt4NXQ84csler1fzK1fTdJDMYrWLerOS5WEWvVWM6PEq3m8wyIWdX2vZCJ7TPkdfEG7Zi1lva4VFLey6ai-z87Yx-pXi5jqRXm1VxjJ7BYbv-of064VRblH-8RWOnGfKqrnfQ6XBosHfJAfi9nsKIjdkeQp_uq9s0WjfrabTV7eVF7dyjJUgWYrlxO0saQ3kvipNvfhSZQXb1zwGupIJHrunmBCVsk5TfdLLNZYFWBrlDn3r39tZv3eIokRino-rU3wowXK0zpiovoUYChF3WmNoSDstDTRxXzqDAl9rjR5XLFIxpJTlaZid3d3UAyUJ-1bs2lqcrUbGoazViXquBRMPItmEdP_CeP_ODy3L8YBaNwMAjCi6tR0OOPPPLC4bnfDy8Hl4MhRYcDf9Pja5vfPw-G4UV41Q_CUdD3w4qBQhba3Lgvi_3AbP4C8X8cNg

router.post("/create", async (req: Request, res: Response) => {
    const order = await createOrderService(req.body)
    res.status(200).json(order.res)
})

// Cancelar orden
// POST /orders/{orderId}/cancel
router.post("/cancel", async (req: Request, res: Response) => {
    //const order = await cancelOrderDB(req.params.orderId, req.body.reason)
    //res.send(order)
})

router.get("/get/:userId/:orderId", async (req: Request, res: Response) => {
    const order = await getOrderService(req.params.userId, req.params.orderId)
    res.send(order)
})

// Listar órdenes por usuario
// GET /orders?userId={userId}&status={status}
router.get("/list/:userID/:status", async (req: Request, res: Response) => {
    //const order = await getAllOrderByIdDB(req.params.userId, req.params.status)
    //res.send(order)
})

//Actualizar estado de orden
//PATCH /orders/{orderId}/status
router.patch("/orders/:orderId", async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { status } = req.body

    const order = await updateOrderStatusDB(orderId, status)
    res.status(200).json({ error: false, message: "Order status updated successfully", order })
})

/**
 * Pendiente de Pago (payment_pending)
        Se genera link de pago MercadoPago
        Acciones disponibles:
            A[Ver link de pago] --> B[Mostrar URL]
            C[Cancelar] --> D[Estado: Cancelado - No pagado]
 */
/**
    - Pagado - Preparando Envío (paid/preparing)
                Tiempo: 1-3 días hábiles
                Riesgos de cancelación:
                    Falta de stock → Cancelado
                    Reembolso → Cancelado (con devolución)

    - Enviado (shipped)
                Incluye:
                - Transportista
                - Número de tracking
                Acción: Notificación al cliente

    Estados finales
    ✅ Entregado (delivered)
    ❌ Cancelado (con sub-estados claros)
    ❌ Pago Fallido (con opciones de reintento)
*/

export default router