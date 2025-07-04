import { Router, Request, Response } from "express"
import axios from "axios"
const router = Router()

// const apigateway = "gateway"
const apigateway = "localhost"

const user_test = "44444"

router.get('/', async (req: Request, res: Response) => {
    try {
        const userId = user_test // //const userId = req.query.userId  ->>> cambiar cuandoa se agregue auth
        const cart = await axios.get(`http://${apigateway}:80/api/cart/v1/cart/${userId}`)
        const items = Array.isArray(cart.data.response.items) ? cart.data.response.items : []

        const totalPrice = await items.reduce((sum: number, item: { price: number; quantity: number }) => {
            const price = item.price ?? 0
            return sum + price * item.quantity
        }, 0)
        // const items = cart.data.response.map((item: any) => item)
        const quantityItems = items.length || 0
        const shipment = 15000
        const taxes = 10.19
        const totalFinal = totalPrice + shipment + taxes

        // actualizar precio total en tabla cart

        res.render('partials/cart/cart', { items: items, totalPrice: totalPrice, quantityItems: quantityItems, shipment: shipment, taxes: taxes, totalFinal: totalFinal })
    } catch (error: Error | any) {
        console.log(error)
        const message = error.response?.data || error.message || 'Error desconocido'
        res.render('partials/main/error', { error: message })
    }
})

router.get('/addToCart/:productId', async (req: Request, res: Response) => {
    try {
        const cart = await axios.post(`http://${apigateway}:80/api/cart/v1/add`, {
            //userId: req.params.userId,
            userId: user_test,
            productId: req.params.productId,
        })
        if (cart.data.error === false) {
            // Mostrar notificación de éxito
        } else {
            // Mostrar notificación de error
        }
    } catch (error: Error | any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        // Mostrar notificación de error
    }
})

router.get('/update-quantity/:productId/:type', async (req: Request, res: Response) => {
    try {
        const cart = await axios.post(`http://${apigateway}:80/api/cart/v1/updateQuantity`, {
            //userId: req.params.userId,
            userId: user_test,
            productId: req.params.productId,
            type: req.params.type,
        })
        if (cart.data.error === false) {
            // Mostrar notificación de éxito
        } else {
            // Mostrar notificación de error
        }
    } catch (error: Error | any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        // Mostrar notificación de error
    }
})

router.get('/removeFromCart/:productId', async (req: Request, res: Response) => {
    try {
        const cart = await axios.delete(`http://${apigateway}:80/api/cart/v1/removeFromCart/${user_test}/${req.params.productId}`)
        if (cart.data.error === false) {
            // Mostrar notificación de éxito
        } else {
            // Mostrar notificación de error
        }
    } catch (error: Error | any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        // Mostrar notificación de error
    }
})

router.get('/clear', async (req: Request, res: Response) => {
    try {
        const cart = await axios.delete(`http://${apigateway}:80/api/cart/v1/clearCart/${user_test}`)
        if (cart.data.error === false) {
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