import { Router, Request, Response } from "express"
const router = Router()
import {
    createUserCartService,
    getUserCartItemsService,
    updateQuantityService,
    removeFromCartService,
    removeCartService
} from "./cartService"
import { Cart } from "cartModel"


router.get('/cart/:userId', async (req: Request, res: Response) => {
    try {
        const cartId = await getUserCartItemsService(req.params.userId)
        res.status(200).json({
            error: cartId.error,
            message: cartId.message,
            response: cartId.res,
        })
    } catch (error: Error | any) {
        console.log(error)
        const status = error.statusCode || 500
        res.status(status).json({ message: error.message })
    }
})


router.post('/add', async (req: Request, res: Response) => {
    try {
        const cart = await createUserCartService(req.body)
        res.status(200).json({
            error: cart.error,
            message: cart.message,
            response: cart.res,
        })
    } catch (error: Error | any) {
        console.log(error)
        const status = error.statusCode || 500
        res.status(status).json({ message: error.message })
    }
})

router.post('/updateQuantity', async (req: Request, res: Response) => {
    try {
        const cart = await updateQuantityService(req.body)
        res.status(200).json({
            error: cart.error,
            message: cart.message,
            response: cart.res,
        })
    } catch (error: Error | any) {
        console.log(error)
        const status = error.statusCode || 500
        res.status(status).json({ message: error.message })
    }
})

router.delete('/removeFromCart/:userID/:productID', async (req: Request, res: Response) => {
    try {
        const cart = await removeFromCartService({
            userId: req.params.userID,
            productId: req.params.productID
        })
        res.status(200).json({
            error: cart.error,
            message: cart.message,
            response: cart.res,
        })
    } catch (error: Error | any) {
        console.log(error)
        const status = error.statusCode || 500
        res.status(status).json({ message: error.message })
    }
})

router.delete('/clearCart/:userId', async (req: Request, res: Response) => {
    try {
        const cart = await removeCartService(req.params.userId)
        console.log(cart)

        res.status(200).json({
            error: cart.error,
            message: cart.message,
            response: cart.res,
        })
    } catch (error: Error | any) {
        console.log(error)
        const status = error.statusCode || 500
        res.status(status).json({ message: error.message })
    }
})

/**
 * 6. Aplicar cupón de descuento

Frontend: Input de cupón + botón aplicar
Backend: POST /api/cart/coupon

Validar cupón en tabla coupons
Aplicar descuento
Actualizar totales
Responder con carrito actualizado
 */

/**
 * 7. Proceder al checkout

Frontend: Botón "Proceder al pago"
Backend: POST /api/cart/checkout

Validar stock de todos los productos
Crear orden en tabla orders
Crear items de orden en tabla order_items
Reservar stock (servicio producto)
Generar proceso de pago (servicio payment)
Enviar notificación (servicio notificación)
Vaciar carrito del usuario
Responder con orden creada
 */

/**
 * 8. Sincronización en tiempo real

Frontend: Polling o WebSocket para mantener carrito actualizado
Backend: Verificar cambios en stock/precios
Notificar cambios al usuario
 */

export default router