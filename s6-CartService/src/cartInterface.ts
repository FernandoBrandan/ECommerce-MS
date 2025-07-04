export interface ICart {
    id?: number
    userId: number
    total_price: number
    createdAt?: Date
    updatedAt?: Date
}

export interface ICartItem {
    id?: number
    productId: number
    name: string
    price?: number
    quantity?: number
    cartId: number
    createdAt?: Date
    updatedAt?: Date
}

