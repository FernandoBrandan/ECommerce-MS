import { Router, Request, Response } from "express"
import axios from "axios"
const router = Router()
import { IOrder } from "./orderInterface"
import { createOrderService, getOrderService } from "./orderService"

router.post("/create", async (req: Request, res: Response) => {
    console.log(req.body)

    const order = await createOrderService(req.body)
    console.log(order)

    res.status(200).json(order)
    /** Orden Creada (created/pending_payment)
      *  Trigger: Usuario hace checkout
      *  Acción: Creación de orden en sistema
      *  Próximo estado: Pendiente de Pago
      */
    // {
    //     "userId": "usr_12345",
    //         "email": "cliente@example.com",
    //             "phoneNumber": "+5491123456789",
    //                 "items": [
    //                     {
    //                         "itemId": "prod_67890",
    //                         "price": 29.99,
    //                         "quantity": 2
    //                     }
    //                 ]
    // }
    // {
    //     "orderId": "ord_abc123",
    //         "status": "created",
    //             "totalAmount": 59.98,
    //                 "createdAt": "2023-10-05T12:00:00Z"
    // }
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

// Cancelar orden
// POST /orders/{orderId}/cancel
router.post("/cancel", async (req: Request, res: Response) => {
    //const order = await cancelOrderDB(req.params.orderId, req.body.reason)
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