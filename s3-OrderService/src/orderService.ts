import axios from "axios"
import { IOrder, IOrderDetail } from "./orderInterface"
import { validateOrderData, validateOrderDetailData } from "./orderValidate"
import { createOrderDB, getOrderDB, updateOrderStatusDB } from "./orderRepository"

export const createOrderService = async (data: any) => {
    const order_string = `ORDER-${data.user.id}-${Date.now()}`
    const order: IOrder = {
        orderId: order_string,
        userId: data.user.id.toString(),
        email: data.user.email,
        phoneNumber: data.user.phoneNumber,
        totalAmount: data.cart.totalPrice,
        status: "created",
    }

    const others = {
        shipment: data.cart.shipment,
        taxes: data.cart.taxes,
        totalFinal: data.cart.totalFinal
    }

    const orderDetails: IOrderDetail[] = data.cart.items.map((item: any) => ({
        orderId: order_string,
        itemId: item.productId.toString(),
        name: item.name,
        quantity: item.quantity,
        price: item.price,
    }))

    const validated = validateOrderData(order)
    if (validated) return { error: true, message: validated, res: [] }

    const validateDetails = validateOrderDetailData(orderDetails)
    if (validateDetails) return { error: true, message: validateDetails, res: [] }

    const orderCreated = await createOrderDB(order, orderDetails)
    if (!orderCreated) return { error: true, message: "Error creating order ", res: [] }

    // Generate preference (api payment)
    const preference = await axios.post(`http://payment-service:5004/v1/create`, { orderCreated, orderDetails })
    if (preference.data.error === true) return { error: true, message: `Error generating preference: ${preference.data.message}`, res: [] }

    // Update order status to payment_pending
    const updated_order = await updateOrderStatusDB(orderCreated.orderId, "payment_pending")
    if (!updated_order) return { error: true, message: "Error updating order status", res: [] }


    // console.log("::>>:: Order created : ", orderCreated)
    // console.log("::>>:: Preference : ", preference.data)
    // console.log("::>>:: Updated order : ", updated_order)

    return { error: false, message: "Orden created", res: preference.data }
}

export const getOrderService = async (userId: string, orderId: string) => {
    const order = await getOrderDB(userId, orderId)
    if (!order) return { error: true, message: "Order not found", res: [] }

    return { error: false, message: "Order found", res: order }
}
