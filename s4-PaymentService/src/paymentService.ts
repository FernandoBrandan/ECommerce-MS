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


    const now = new Date();
    const expirationDateFrom = now.toISOString();
    const expirationDateTo = new Date(now.getTime() + 15 * 60000).toISOString(); // +15 minutos


    const i = orderData.orderDetails.map((item: any) => {
        return {
            id: item.itemId,
            title: item.name,
            quantity: item.quantity,
            currency_id: 'ARS',
            unit_price: item.price
        }
    })

    const body = {
        items: [...i],
        payer: {
            email: orderData.orderCreated.email,
            phone: {
                number: orderData.orderCreated.phoneNumber
            },
        },
        shipment: {
            mode: 'not_specified',
            cost: 0,
        },
        taxes: [
            { id: 'IVA', value: 0 },
            { id: 'total_tax', value: 0 }
        ],
        external_reference: orderData.orderCreated.orderId,
        expires: true, 
        expiration_date_from: expirationDateFrom,
        expiration_date_to: expirationDateTo,
        back_urls: {
            success: urls.successUrl,
            failure: urls.failureUrl,
            pending: urls.pendingUrl,
        },
        notification_url: urls.notificationUrl || '',
        auto_return: 'approved'
    }

    const preference_created = await preference.create({ body })
    if (!preference_created) return { error: true, message: "Error creating preference", res: [] }
    if (!preference_created.id) return { error: true, message: "Preference ID not found", res: [] }
    if (!preference_created.external_reference) return { error: true, message: "External reference not found", res: [] }
    if (!preference_created.init_point) return { error: true, message: "Init point not found", res: [] }

    const preference_createdDB = await createPreferenceDB(preference_created.id, preference_created.external_reference, preference_created.init_point)
    if (!preference_createdDB) return { error: true, message: "Error creating preference in DB", res: [] }

    return {
        error: false,
        message: "Preference created successfully",
        preference_created
    }
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

