import { Order, OrderDetail } from "./orderModel"
import { IOrder, IOrderDetail } from "./orderInterface"

export const createOrderDB = async (order: IOrder, orderDetails: IOrderDetail[]) => {
    const order_created = await Order.create(order)
    if (order_created) {
        const details_created = await OrderDetail.bulkCreate(orderDetails)
        if (details_created) return order_created
    }
}

export const getOrderDB = async (userId: string, orderId: string) => {
    return await Order.findOne({ where: { userId, orderId } })
}

export const getOrderAndDetailsDB = async (userId: string, orderId: string) => {
    return await Order.findOne({
        where: { userId, orderId },
        include: [
            {
                model: OrderDetail,
                as: 'orderDetails',
            },
        ],
    })
}

export const getAllOrderByIdDB = async (userId: string) => {
    return await Order.findAll({ where: { userId } })
}

export const getAllOrderAndDetailsByIdDB = async (userId: string) => {
    return await Order.findAll({
        where: { userId },
        include: [
            {
                model: OrderDetail,
                as: 'orderDetails',
            },
        ],
    })
}

export const getAllOrdersDB = async () => {
    return await Order.findAll()
}

export const getAllOrderAndDetailsDB = async () => {
    return await Order.findAll({
        include: [
            {
                model: OrderDetail,
                as: 'orderDetails',
            },
        ],
    })
}


export const updateOrderDB = async (userId: string, orderId: string, order: IOrder) => {
    return await Order.update(order, { where: { userId, orderId } })
}

export const updateOrderStatusDB = async (userId: string, orderId: string, status: string) => {
    return await Order.update({ status }, { where: { userId, orderId } })
}

export const deleteOrderDB = async (userId: string, orderId: string) => {
    return await Order.destroy({ where: { userId, orderId } })
}
