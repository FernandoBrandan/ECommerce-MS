import { IPayment } from "paymentInterface"
import { Payment } from "./paymentModel"

export const createPreferenceDB = async (preference_id: string, external_reference: string, init_point_url: string) => {
    const newPayment: IPayment = {
        payment_id: undefined, // This will be set later when the payment is created
        status: "pending",
        preference_id: preference_id,
        external_reference: external_reference,
        init_point_url: init_point_url,
    }
    return await Payment.create(newPayment)
}

export const updatePaymentStatusDB = async (external_reference: string, payment_id: string, status: string) => {
    const order = await Payment.findOne({ where: { external_reference: external_reference } })
    if (!order) throw new Error('Order not found')

    if (order.status === status) return

    const updated = await order.update({ status })
    if (!updated) throw new Error('Order not updated')

}

export const getPaymentByExternalRef = async (external_reference: string) => {
    const payment = await Payment.findOne({ where: { external_reference: external_reference } })
    if (!payment) throw new Error('Payment not found')
    return payment
}
