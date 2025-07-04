import { Router, Request, Response } from "express"
import axios from "axios"
const router = Router()

// const apigateway = "gateway"
const apigateway = "localhost"

const user_test = "44444"

router.get('/', async (req: Request, res: Response) => {
    try {
        //const cart = await axios.get(`http://${apigateway}:80/api/cart/v1/cart/${user_test}`)
        //const items = Array.isArray(cart.data.response.items) ? cart.data.response.items : []
        //const totalPrice = await items.reduce((sum: number, item: { price: number; quantity: number }) => {
        //    const price = item.price ?? 0
        //    return sum + price * item.quantity
        //}, 0)

        res.render('partials/order/order', {
            items: [
                { name: 'Producto A', quantity: 2, price: 100 },
                { name: 'Producto A', quantity: 2, price: 100 },
                { name: 'Producto A', quantity: 2, price: 100 },
                { name: 'Producto A', quantity: 2, price: 100 },
                { name: 'Producto B', quantity: 1, price: 250 }
            ],
            totalAmount: 450
        })

        // res.render('partials/order/order', { items: items, totalPrice: totalPrice })
    } catch (error: Error | any) {
        console.log(error)
        const message = error.response?.data || error.message || 'Error desconocido'
        res.render('partials/main/error', { error: message })
    }
})

router.get('/checkout', async (req: Request, res: Response) => {
    console.log("checkout")

    try {
        const req = {
            "userId": "u-001",
            "email": "cliente@dominio.com",
            "phoneNumber": "+5491122334455",
            "totalAmount": 1499.50,
            "items": [
                {
                    "itemId": "prod-123",
                    "price": 999.99,
                    "quantity": 1
                },
                {
                    "itemId": "prod-456",
                    "price": 499.51,
                    "quantity": 1
                }
            ]
        }

        const order = await axios.post(`http://${apigateway}:80/api/order/v1/create`,
            req
        )
        if (order.data.error === false) {
            // Mostrar notificación de éxito
        } else {
            // Mostrar notificación de error
        }
    } catch (error: Error | any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        // Mostrar notificación de error
    }
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