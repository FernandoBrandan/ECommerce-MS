import axios from "axios"

import { getUserCart, createUserCart } from './cartRepository'

export const validateApiProducts = async (apiProduct: string, productId: string) => {
    /**
     * Validar que el producto existe (servicio producto)
     * Validar stock disponible
     */
    const existProduct = await axios.get(`${apiProduct}/v1/product/${productId}`)
    if (!existProduct) return { error: true, message: "Product not found or invalid format" }
    if (existProduct.data.error) return { error: true, message: existProduct.data.message }

    const stock = existProduct.data.response.stock
    if (typeof stock !== 'number' || stock < 1) return { error: true, message: "Not enough stock" }

    /** Campos agregados para el carrito */
    const price = existProduct.data.response.price
    if (typeof price !== 'number') return { error: true, message: "Invalid price" }
    const name = existProduct.data.response.name
    if (typeof name !== 'string') return { error: true, message: "Invalid name" }
    const description = existProduct.data.response.description
    if (typeof description !== 'string') return { error: true, message: "Invalid description" }


    return { error: false, message: "Product validated", stock, price, name, description }
}

export const validateUserCart = async (userId: string) => {
    // Usuario tiene carrito?
    // No: crear carrito
    let user = await getUserCart(userId as string)
    if (!user) {
        const createdCart = await createUserCart(userId as string)
        if (!createdCart) return { error: true, message: "Error creating cart", res: [] }
        const cartId: number = createdCart.id
        return { error: false, message: "Cart created", cartId }
    } else {
        const cartId: number = user.id
        return { error: false, message: "Cart validated", cartId }
    }

}