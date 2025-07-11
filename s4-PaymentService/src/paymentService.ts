// CONSULTA DIRECTA POST-PAGO
import MercadoPago, { Preference } from 'mercadopago'
import axios from 'axios'
import { IPayment } from 'paymentInterface'
import createUrls from './ngrokService'
import { createPreferenceDB, updatePaymentStatusDB } from './paymentRepository'
const accessToken = "TEST-932074593473716-103114-a21810c7fdc6f4a0b243b42e0054ef35-173869747"
const baseURL = 'https://api.mercadopago.com'
const apigateway = 'http://order-service:5004/v1'

// Crear preferencia y obtener payment_id del redirect
export const createPreference = async (orderData: any) => {

    const client = new MercadoPago({ accessToken: accessToken })
    const preference = new Preference(client)
    const urls = await createUrls()


    const now = new Date()
    const expirationDateFrom = now.toISOString()
    const expirationDateTo = new Date(now.getTime() + 15 * 60000).toISOString() // +15 minutos


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
            name: orderData.orderCreated.name,
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

/**
 * *********************************************************
 * *********************************************************
 * Procesar webhook de MercadoPago
 * *********************************************************
 * *********************************************************
 */

export const processWebhook = async (dataRequest: any) => {
    console.log('1 - webhook', dataRequest.body)
    const { type, data } = dataRequest.body

    const topic = dataRequest.query.topic || ""
    const orderId = dataRequest.query.id || ""
    if (topic === 'merchant_order') {
        // const merchantOrder = await getMerchantOrder(orderId)
        // console.log('Merchant Order Status:', merchantOrder.order_status)
        // console.log('Payments in order:', merchantOrder.payments.length)

        // Si ya tiene pagos, verificar estado
        // if (merchantOrder.payments.length > 0) {
        //  await processMerchantOrderPayments(merchantOrder)
        // }
    }

    // 
    // 1 - Order - Created --------------------------------------------- ok
    // 
    // 2 - Payment - pending --------------------------------------------- ok
    // Order - payment_pending --------------------------------------------- ok
    // 
    // 3 - Payment - in_process
    // Order - payment_processing
    // 
    // 4 - Payment - approved --------------------------------------------- ok
    // Order - paid --------------------------------------------- ok
    // 
    // if - Payment - rejected --------------------------------------------- ok
    // Order - payment_failed --------------------------------------------- ok
    // 
    // 5 - Order - shipped
    // 
    // 6 - Order - delivered
    // 

    if (type === 'payment') {
        const payment_id = data.id.toString()
        // Obtener detalles del pago
        const payment = await checkPaymentStatus(payment_id)
        if (!payment) return { error: true, message: 'Payment not found' }

        switch (payment.status) {
            case 'approved':
                // Payment status APRO (Approved) - Pago Aprobado
                console.log('Payment approved:', payment.status, payment.external_reference)
                const updatedPayment = await updatePaymentStatusDB(payment.external_reference, payment_id, payment.status)
                const updatedOrder = await axios.patch(`${apigateway}/orders/${payment.external_reference}`, { status: 'paid' })

                // Iniciar proceso de fulfillment
                // dev triggerShippingProcess(order_id)

                // Notificar al usuario
                // dev sendConfirmationEmail(user_email)

                break
            case 'pending':
                // Payment status CONT (Pending) - Pendiente de Pago
                console.log('Payment pending:', payment.status, payment.external_reference)
                const updatedPending = await updatePaymentStatusDB(payment.external_reference, payment_id, payment.status)
                const updatedOrderPending = await axios.patch(`${apigateway}/orders/${payment.external_reference}`, { status: 'payment_pending' })

                // Opcional: notificar al usuario sobre el estado
                // dev sendPendingNotification(user_email)
                break
            case 'rejected':
                // Payment status rejected - Rechazos Específicos (OTHE, CALL, FUND, SECU, EXPI, FORM)
                console.log('Payment pending:', payment.status, payment.external_reference)
                const updatedRejected = await updatePaymentStatusDB(payment.external_reference, payment_id, payment.status)
                const updatedOrderRejected = await axios.patch(`${apigateway}/orders/${payment.external_reference}`, { status: 'payment_failed' })

                // Opcional: notificar al usuario sobre el estado
                // dev sendRejectedNotification(user_email)
                break

            case 'in_process': // No entra
                // updateOrderStatus(order_id, 'payment_processing');
                // sendProcessingNotification(user_email);
                break
            case 'cancelled':
                // handleCancelledPayment(order_id, payment)
                break
            case 'refunded':
                // handleRefundedPayment(order_id, payment)
                break
            case 'in_process':
                // handleProcessingPayment(order_id, payment)
                break
            default:
                console.warn(`Estado no manejado: ${payment.status}`, payment)
        }
    }

    return { error: false, message: 'Webhook received' }

}

const processPendingPayment = async (payment: any) => {

    // 2. Identificar el tipo de pago y razón
    const paymentMethod = payment.payment_method_id
    const statusDetail = payment.status_detail

    console.log(`Payment pending - Method: ${paymentMethod}, Detail: ${statusDetail}`)

    /**
     * 
     *      Para Pagos en Efectivo:

            ✅ Enviar instrucciones claras (código de barras, lugares de pago)
            ✅ Recordatorio 24hs antes del vencimiento
            ✅ Notificar cuando expire
            ✅ Ofrecer generar nuevo cupón
            
            Para Tarjetas:
            
            ✅ Notificar que está en verificación
            ✅ Sugerir contactar al banco si demora mucho
            ✅ Ofrecer método alternativo después de cierto tiempo
            
            Para Transferencias:
            
            ✅ Enviar datos bancarios
            ✅ Explicar que puede tardar 1-3 días
            ✅ Pedir comprobante de transferencia
     */
    

    // 3. Acciones específicas según el tipo
    if (paymentMethod === 'rapipago' || paymentMethod === 'pagofacil') {
        // Pago en efectivo - enviar instrucciones de pago
        // // await sendPaymentInstructions(payment)

        // Programar recordatorio para antes del vencimiento
        // // await schedulePaymentReminder(payment)

    } else if (paymentMethod.includes('credit_card') || paymentMethod.includes('debit_card')) {
        // Tarjeta - puede resolverse automáticamente
        // // await sendPendingCardNotification(payment)

        // Programar seguimiento más frecuente
        // // await schedulePaymentCheck(payment, '30min')

    } else if (paymentMethod === 'bank_transfer') {
        // Transferencia bancaria
        // // await sendBankTransferInstructions(payment)
        // // await schedulePaymentCheck(payment, '24h')
    }
}

// const checkExpiredPayments = async () => {
//     const expiredPayments = await getExpiredPendingPayments();
    
//     for (const payment of expiredPayments) {
//         await updatePaymentStatusDB(payment.external_reference, payment.id, 'expired');
//         await axios.patch(`${apigateway}/orders/${payment.external_reference}`, { 
//             status: 'payment_expired' 
//         });
        
//         // Opcional: crear nuevo intento de pago
//         await createNewPaymentAttempt(payment.external_reference);
//     }
// };