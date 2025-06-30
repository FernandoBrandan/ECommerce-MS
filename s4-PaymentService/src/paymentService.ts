// CONSULTA DIRECTA POST-PAGO
import MercadoPago, { Preference } from 'mercadopago'
import { IPayment } from 'paymentInterface'
import createUrls from './ngrokService'
import { createPreferenceDB } from './paymentRepository'
const accessToken = "TEST-932074593473716-103114-a21810c7fdc6f4a0b243b42e0054ef35-173869747"
const baseURL = 'https://api.mercadopago.com'

// Crear preferencia y obtener payment_id del redirect
export const createPreference = async (orderData: any) => {
    const client = new MercadoPago({ accessToken: accessToken })
    const preference = new Preference(client)
    const urls = await createUrls()
    const body = {
        items: [{
            id: orderData.orderId,
            title: orderData.title,
            quantity: 1,
            currency_id: 'ARS',
            unit_price: orderData.amount
        }],
        external_reference: orderData.orderId,
        back_urls: {
            success: urls.successUrl,
            failure: urls.failureUrl,
            pending: urls.pendingUrl,
        },
        notification_url: urls.notificationUrl,
        auto_return: 'approved'
    }
    const preference_created = await preference.create({ body })

    createPreferenceDB(preference_created.id, preference_created.external_reference)

    return preference_created
}


// Polling sincrónico hasta obtener resultado final
export const waitForPaymentConfirmation = async (paymentId: string, maxAttempts = 12, intervalMs = 5000) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const payment = await checkPaymentStatus(paymentId)
        if (payment.status === 'approved' || payment.status === 'rejected') return payment
        if (payment.status === 'pending' && attempt < maxAttempts - 1) {
            await new Promise(resolve => setTimeout(resolve, intervalMs))
            continue
        }
        return { ...payment, timeout: true } // El pago sigue pendiente
    }
}

// MÉTODO SINCRÓNICO: Verificar estado del pago
export const checkPaymentStatus = async (paymentId: string) => {
    console.log("Search payment status - inicio")
    const response_payment = await fetch(`${baseURL}/v1/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    console.log("checkPaymentStatus", response_payment.status)
    console.log("checkPaymentStatusText", response_payment.statusText)
    console.log("checkPaymentBody", response_payment.body)
    return await response_payment.json() as IPayment
}

export const checkPreferenceStatus = async (preferenceId: string) => {
    const response_preference = await fetch(`${baseURL}/checkout/preferences/${preferenceId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    console.log("checkPreferenceStatus", response_preference.status)
    console.log("checkPreferenceStatusText", response_preference.statusText)
    console.log("checkPreferenceBody", response_preference.body)
    return {
        status: response_preference.status,
        statusText: response_preference.statusText,
        body: response_preference.body
    }
}

