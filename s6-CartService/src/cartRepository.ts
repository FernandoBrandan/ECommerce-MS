import { Cart, CartItem } from './cartModel'
import { ICart, ICartItem } from './cartInterface'

export const getUserCart = async (userId: string) => {
    return await Cart.findOne({ where: { userId: userId } })
}

export const getCartList = async (cartId: number) => {
    return await CartItem.findAll({ where: { cartId: cartId } })
}

export const getUserCartItems = async (userId: number) => {
    return await Cart.findOne({ where: { userId: userId }, include: [{ model: CartItem, as: 'items' }] })
}

export const createUserCart = async (userId: string) => {
    return await Cart.create({ userId: parseInt(userId), total_price: 0 })
}

export const updateItemFromList = async (cartId: number, product_id: number, quantity: number) => {
    const cartItem = await CartItem.findOne({ where: { cartId: cartId, productId: product_id } })
    if (cartItem) {
        cartItem.quantity = quantity
        return await cartItem.save()
    }
}

export const addOneProductToCart = async (cartItem: ICartItem) => {
    return await CartItem.create(cartItem)
}

export const removeItemFromCart = async (cartId: number, productId: number) => {
    return await CartItem.destroy({ where: { cartId: cartId, productId: productId } })
}

export const removeAllItemsFromCart = async (cartId: number) => {
    return await CartItem.destroy({ where: { cartId: cartId } })
}