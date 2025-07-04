import axios from 'axios'
import { ICart, ICartItem } from 'cartInterface'

import { getUserCart, getCartList, getUserCartItems, updateItemFromList, addOneProductToCart, removeItemFromCart, removeAllItemsFromCart } from './cartRepository'

import { validateApiProducts, validateUserCart } from './cartUtils'

const apigateway = 'gateway'
const apiProduct = 'http://product-service:5001'

export const createUserCartService = async (data: { userId: string, productId: string }) => {
    const { userId, productId } = data
    if (!userId || !productId) return { error: true, message: 'Missing userId or productId', res: [] }


    const productId_toInt: number = parseInt(productId)

    const apiProducts = await validateApiProducts(apiProduct, productId)
    if (apiProducts.error) return { error: true, message: apiProducts.message, res: [] }

    const price: number = apiProducts.price || 0
    const name: string = apiProducts.name || ''

    const userCart = await validateUserCart(userId)
    if (userCart.error) return { error: true, message: userCart.message, res: [] }
    if (!userCart.cartId) return { error: true, message: 'Cart was created successfully, but the ID is not available', res: [] }
    const cartId: number = userCart.cartId

    // Si: verificar si el producto ya está en el carrito
    // Si: actualizar cantidad
    // No: agregar producto al carrito 
    const cartItems = await getCartList(cartId)// por usuario tambien por validacion

    const newCartItem: ICartItem = {
        cartId: cartId,
        productId: productId_toInt,
        quantity: 1,
        price: price,
        name: name
    }

    if (cartItems.length === 0) {
        const addcartitem = await addOneProductToCart(newCartItem)
        if (!addcartitem) return { error: true, message: 'Error adding product to cart', res: [] }

        return { error: false, message: 'Product added to cart - length === 0', res: addcartitem }
    }

    const findedItem = cartItems.find((item: any) => item.productId === productId_toInt)

    if (findedItem) {
        const newQuantity = findedItem.quantity + 1
        const updatecartitem = await updateItemFromList(cartId, productId_toInt, newQuantity)
        if (!updatecartitem) return { error: true, message: 'Error updating cart item', res: [] }

        return { error: false, message: 'Cart updated', res: updatecartitem }
    } else {
        const addcartitem = await addOneProductToCart(newCartItem)
        if (!addcartitem) return { error: true, message: 'Error adding product to cart', res: [] }

        return { error: false, message: 'Product added to cart', res: addcartitem }
    }
}

export const getUserCartItemsService = async (userId: string) => {
    /**
     * - Obtener carrito del usuario - 
     * Frontend: Cargar vista de carrito
     * Backend: GET /api/cart/:userId
     * 
     * Obtener items del carrito con JOIN a tabla productos
     * Calcular subtotales, impuestos, envío
     * Responder con carrito completo
     */

    if (!userId) return { error: true, message: 'Missing userId', res: [] }

    const userCart = await validateUserCart(userId)
    if (userCart.error) return { error: true, message: userCart.message, res: [] }
    if (!userCart.cartId) return { error: true, message: 'Cart was created successfully, but the ID is not available', res: [] }
    const cartMessage: string = userCart.message
    const cartId: number = userCart.cartId

    const userId_toInt: number = parseInt(userId)
    const cartItems: any = await getUserCartItems(userId_toInt)

    if (!cartItems) return { error: true, message: `Cart items not found - ${cartMessage}`, res: [] }

    return { error: false, message: `Cart items - ${cartMessage}`, res: cartItems }
}

export const updateQuantityService = async (data: { userId: string, productId: string, type: string }) => {
    /**
     * 2. Actualizar cantidad de producto
     * Frontend: Botones +/- en vista de carrito
     *
     * Body: user_id, product_id, quantity
     *
     * Validar stock disponible
     * Actualizar cantidad en tabla cart_items
     * Si cantidad = 0, eliminar item
     * Recalcular totales
     * Responder con carrito actualizado
     */

    type Action = 'increment' | 'decrement'
    let quantity: number = 0
    let stockAvailable: number = 0

    const { userId, productId, type } = data
    if (!userId || !productId || !type) return { error: true, message: 'Missing userId, productId or type', res: [] }
    if (!['increment', 'decrement'].includes(type)) return { error: true, message: 'Invalid type action', res: [] }

    const userCart = await getUserCart(userId)
    if (!userCart) return { error: true, message: 'Error: User does not have a cart', res: [] }
    const cartId: number = userCart.id
    const cartItems = await getCartList(cartId)

    const productId_toInt: number = parseInt(productId)
    const foundItem = cartItems.find((item: any) => item.productId === productId_toInt)

    if (foundItem) {
        const apiProducts = await validateApiProducts(apiProduct, foundItem.productId.toString())
        if (apiProducts.error) return { error: true, message: apiProducts.message, res: [] }
        stockAvailable = apiProducts.stock || 0
        quantity = foundItem.quantity
    } else return { error: true, message: 'Product not found in cart', res: [] }

    let new_quantity: number = 0
    if (type === 'increment') {
        new_quantity = quantity + 1
        if (new_quantity > stockAvailable) {
            return {
                error: true,
                message: `No hay suficiente stock. Disponible: ${stockAvailable}, solicitado: ${new_quantity}`,
                res: []
            }
        }
    }

    if (type === 'decrement') // quantity = -1
    {
        new_quantity = quantity - 1
        if (new_quantity <= 0) {
            // posible inicio de compra -> notify user
            const removed = await removeItemFromCart(cartId, productId_toInt)
            if (!removed) return { error: true, message: 'Error removing item from cart', res: [] }

            return { error: false, message: 'Item removed from cart', res: removed }
        }
    }

    const update_cart_item = await updateItemFromList(cartId, productId_toInt, new_quantity)
    if (!update_cart_item) return { error: true, message: `Error ${type} cart item. ${update_cart_item}`, res: [] }

    return { error: false, message: 'Cart updated', res: update_cart_item }
}



export const removeFromCartService = async (data: { userId: string, productId: string }) => {
    /**
     * 3. Eliminar producto del carrito
     * Frontend: Botón eliminar en item del carrito
     * Backend: DELETE /api/cart/remove/:productId
     * Body: user_id, product_id
     *
     * Eliminar registro de tabla cart_items
     * Responder con carrito actualizado
     */

    const { userId, productId } = data
    if (!userId || !productId) return { error: true, message: 'Missing userId or productId', res: [] }

    const userCart = await getUserCart(userId)
    if (!userCart) return { error: true, message: 'Error: User does not have a cart', res: [] }

    const cartId = userCart.id
    const productIdInt = parseInt(productId)

    const removed = await removeItemFromCart(cartId, productIdInt)
    if (!removed) return { error: true, message: 'Error removing item from cart', res: [] }

    const cartItems = await getCartList(cartId)
    if (cartItems.length === 0) return { error: true, message: 'Cart is empty', res: [] }

    return { error: false, message: 'Producto eliminado del carrito', res: cartItems }
}

export const removeCartService = async (userId: string) => {
    /**
     * 5. Vaciar carrito
     * 
     * Frontend: Botón "Vaciar carrito"
     * Backend: DELETE /api/cart/clear/:userId
     * 
     * Eliminar todos los items del usuario
     * Responder confirmación
     */
    console.log("removeCartService", userId)

    if (!userId) return { error: true, message: 'Missing userId', res: [] }

    const userCart = await getUserCart(userId)
    if (!userCart) return { error: true, message: 'Error: User does not have a cart', res: [] }

    const cartId = userCart.id

    const removed = await removeAllItemsFromCart(cartId)
    if (!removed) return { error: true, message: 'Error removing items from cart', res: [] }

    return {
        error: false,
        message: `Carrito vaciado (${removed} items eliminados)`,
        res: removed,
    }
}

