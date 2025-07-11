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
    if (order && order.status !== status) {
        return await Payment.update(
            { status: status, payment_id: payment_id },
            { where: { external_reference: external_reference } }
        )
    }

    const msg = `Payment status is already updated or not founded - Check the order id: ${external_reference} - Check the payment id: ${payment_id}`
    return { error: true, message: msg }
}

export const getPaymentByExternalRef = async (external_reference: string) => {
    const payment = await Payment.findOne({ where: { external_reference: external_reference } })
    if (!payment) throw new Error('Payment not found')
    return payment
}

/**
 * 
 */
