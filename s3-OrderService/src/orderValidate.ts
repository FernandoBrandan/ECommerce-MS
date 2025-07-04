import joi from "joi"
import { IOrder, IOrderDetail } from "./orderInterface"

const orderSchema = joi.object<IOrder>({
    userId: joi.string().required(),
    email: joi.string().email().required(),
    phoneNumber: joi.string().required(),
    totalAmount: joi.number().required(),
    status: joi.string()
        .valid('created',
            'payment_pending',
            'payment_processing',
            'paid',
            'shipped',
            'delivered',
            'cancelled',
            'payment_failed').required(),
    cancellationReason: joi.string().valid('user_cancelled', 'payment_failed', 'other').optional()
})

export const validateOrderData = (order: IOrder) => {
    const { error } = orderSchema.validate(order)
    if (error) return error.message
    return null
}

const orderDetailSchema = joi.object<IOrderDetail>({
    orderId: joi.string().required(),
    itemId: joi.string().required(), // array de items ????
    price: joi.number().required(),
    quantity: joi.number().required()
})

const orderDetailsArraySchema = joi.array().items(orderDetailSchema)

export const validateOrderDetailData = (orderDetail: IOrderDetail[]) => {
    const { error } = orderDetailsArraySchema.validate(orderDetail)
    if (error) return error.message
    return null
}