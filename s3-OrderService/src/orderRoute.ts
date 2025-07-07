import { Router, Request, Response } from "express"
import axios from "axios"
const router = Router()
import { IOrder } from "./orderInterface"
import { createOrderService, getOrderService } from "./orderService"

// https://mermaid.live/view#pako:eNqFVcFu2kAQ_ZXVSpHaCkfYBpL40AttbklRaC8tFZp4B9jW3nXXdtQQ8TE99pBTP4Ef63jXNmBSygF5Zt6b2Zl5Xj_xWAvkEc8LKPCdhKWB1HsIZorR78ubr8zz3rIPRqCajw2CABexcDbjNsLqCGeQn8BOUAmJip4FsgkstSO07rn1HVLIwyZGx5hvfymhc6w55J87Pzh3lwZCM4-omIGpIOy9etg-65ZO8fkuekgnqKS4wzZGB1EYXO5hGvMANQYVY9KiWpM9Odw-9lazDHYZb_XcHfIYeYeY3uskJ4IbQMNpA8eca0gKqMaeFzr-7uBT-2ihmxemTpRECr0378ajHHp_0VYlh4tkEZsiW6JCA3RSXKBB6r86xM3EZegQbI7uYinNp7wEIzWLdZolSH1krU6O4XWSw_VSElsh1mohTVqt4NXQ84csler1fzK1fTdJDMYrWLerOS5WEWvVWM6PEq3m8wyIWdX2vZCJ7TPkdfEG7Zi1lva4VFLey6ai-z87Yx-pXi5jqRXm1VxjJ7BYbv-of064VRblH-8RWOnGfKqrnfQ6XBosHfJAfi9nsKIjdkeQp_uq9s0WjfrabTV7eVF7dyjJUgWYrlxO0saQ3kvipNvfhSZQXb1zwGupIJHrunmBCVsk5TfdLLNZYFWBrlDn3r39tZv3eIokRino-rU3wowXK0zpiovoUYChF3WmNoSDstDTRxXzqDAl9rjR5XLFIxpJTlaZid3d3UAyUJ-1bs2lqcrUbGoazViXquBRMPItmEdP_CeP_ODy3L8YBaNwMAjCi6tR0OOPPPLC4bnfDy8Hl4MhRYcDf9Pja5vfPw-G4UV41Q_CUdD3w4qBQhba3Lgvi_3AbP4C8X8cNg

router.post("/create", async (req: Request, res: Response) => {
    /** Orden Creada (created/pending_payment)
      *  Trigger: Usuario hace checkout
      *  Acción: Creación de orden en sistema
      *  Próximo estado: Pendiente de Pago
      */
    console.log("create order", req.body)
    const createorder = {
        userId: 'u-001',
        email: 'cliente@dominio.com',
        phoneNumber: '+5491122334455',
        totalAmount: 1499.5,
        items: [
            { itemId: 'prod-123', name: "teclado", price: 999.99, quantity: 1 },
            { itemId: 'prod-456', name: "mouse", price: 499.51, quantity: 1 }
        ],
        taxes: [
            { id: 'IVA', value: 0 },
            { id: 'total_tax', value: 0 }
        ],
        shipment: { mode: 'not_specified', cost: 0 },

    }

    const order = await createOrderService(req.body)
    console.log("order created", order)

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
router.patch("/update/:orderId/status", async (req: Request, res: Response) => {
    //const order = await updateOrderStatusDB(req.params.orderId, req.body.status)
    //res.send(order)
})





/**
 * 
 * Pendiente de Pago (payment_pending)
        Se genera link de pago MercadoPago
        Acciones disponibles:

            A[Ver link de pago] --> B[Mostrar URL]
            C[Cancelar] --> D[Estado: Cancelado - No pagado]

 */


/**
 * 
 * Pago Procesándose (payment_processing)
Tiempo estimado: 5-15 minutos
Dos posibles salidas:
✅ Confirmación → Preparando envío
❌ Rechazo → Pago fallido
 */

// Webhook para actualizaciones de pago(consumido por Payments MS)
// POST / orders / webhook / payment - update
// Request:
// json
// {
// "orderId": "ord_abc123",
// "paymentStatus": "approved",
// "mpPaymentId": "1234567890"
// }


/**
 * 

Pagado - Preparando Envío (paid/preparing)
Tiempo: 1-3 días hábiles
Riesgos de cancelación:
    Falta de stock → Cancelado
    Reembolso → Cancelado (con devolución)

Enviado (shipped)
Incluye:
Transportista
Número de tracking
Acción: Notificación al cliente

Estados finales
✅ Entregado (delivered)
❌ Cancelado (con sub-estados claros)
❌ Pago Fallido (con opciones de reintento)
 */

export default router