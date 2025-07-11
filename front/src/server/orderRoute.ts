import { Router, Request, Response } from "express"
import axios from "axios"
const router = Router()

// const apigateway = "gateway"
const apigateway = "localhost"
const user_test = "44444"

router.get('/checkout', async (req: Request, res: Response) => {
    console.log("checkout")
    try {
        const data = { user: req.session.user || null, cart: req.session.cart || null }
        const order = await axios.post(`http://${apigateway}:80/api/orders/v1/create`, data)
        console.log(order.data)
        if (order.data.error === false) {
            const url_payment = order.data.preferenceInit_point
            console.log("URL de pago:", url_payment)
            res.redirect(url_payment)
        } else {
            // Mostrar notificación de error
        }
    } catch (error: Error | any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        // Mostrar notificación de error
    }
})

router.get('/', async (req: Request, res: Response) => {
    res.render('partials/order/order')
})

router.get('/list', async (req: Request, res: Response) => {
    res.render('partials/order/list')
})




export default router


/**
 * Flujo Real de Estados de Orden
1. Orden Creada

Usuario hace checkout → se crea la orden
Estado: created / pending_payment
Descripción: "Esperando pago"

2. Pendiente de Pago

Se genera preference de MercadoPago
Estado: payment_pending
Descripción: "Link de pago enviado - Pendiente de pago"
Acciones: Ver link de pago, Cancelar

3. Pago Procesándose

Usuario completó el pago en MP
Estado: payment_processing
Descripción: "Pago en verificación"
Tiempo: 5-15 minutos

4. Pagado - Preparando Envío

Pago confirmado por MP
Estado: paid / preparing
Descripción: "Pago confirmado - Preparando envío"
Tiempo: 1-3 días hábiles

5. Enviado

Paquete despachado
Estado: shipped
Descripción: "Enviado por [transportista]"
Tracking disponible

6. Entregado

Paquete recibido
Estado: delivered
Descripción: "Entregado"

7. Cancelado

Puede cancelarse en varios momentos
Estado: cancelled
Subcasos:

"Cancelado - No pagado"
"Cancelado - Reembolso procesado"
"Cancelado - Falta de stock"

 
8. Pago Fallido

MP rechazó el pago
Estado: payment_failed
Descripción: "Pago rechazado"
Acciones: Reintentar pago, Cambiar método


¿Te parece que implemente este flujo más realista en el diseño? Incluiría:

Estados más específicos
Información de pago clara
Links de pago cuando corresponda
Diferenciación entre cancelaciones con/sin reembolso


*/