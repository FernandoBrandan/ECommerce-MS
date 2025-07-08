// CONTROLLER DE MICROSERVICIO
import { Request, Response } from 'express'
import { createPreference, waitForPaymentConfirmation, checkPaymentStatus, checkPreferenceStatus } from './paymentService'
import { updatePaymentStatusDB } from './paymentRepository'

export const createPayment = async (req: Request, res: Response) => {
    try {
        const preference = await createPreference(req.body)

        if (preference.error || !preference.preference_created) {
            res.status(200).json({
                error: true,
                message: preference.message || "Error inesperado"
            })
            return
        }

        res.status(200).json({
            error: false,
            message: preference.message,
            preferenceId: preference.preference_created.id,
            preferenceInit_point: preference.preference_created.init_point,
            orderId: preference.preference_created.external_reference
        })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

import MercadoPago, { Payment } from 'mercadopago'
const accessToken = "TEST-932074593473716-103114-a21810c7fdc6f4a0b243b42e0054ef35-173869747"

export const webhook = async (req: any, res: any) => {
    console.log('webhook', req.body)
    const { type, data } = req.body
    if (type === 'payment') {
        const paymentId = data.id
        const payment = await checkPaymentStatus(paymentId)
        await updatePaymentStatusDB(paymentId, payment.status, payment.external_reference)
    }
    res.sendStatus(200)


    const client = new MercadoPago({ accessToken: accessToken })

    // Estructura del Webhook Recomendada    
    if (type === 'payment') {
        const payment_id = data.id
        // Obtener detalles del pago
        const payment = await client.Payment.get(payment_id)
        const order_id = payment.external_reference
        switch (payment.status) {
            case 'approved':
                // APRO (Approved) - Pago Aprobado  
                // Actualizar orden a 'paid' 
                updateOrderStatus(order_id, 'paid')
                // Iniciar proceso de fulfillment
                triggerShippingProcess(order_id)
                // Notificar al usuario
                sendConfirmationEmail(user_email)

                // handleApprovedPayment(order_id, payment); no sirve
                break

            case 'pending':
                // CONT (Pending) - Pendiente de Pago

                // Mantener en 'payment_pending'
                updateOrderStatus(order_id, 'payment_pending')
                // Opcional: notificar al usuario sobre el estado
                sendPendingNotification(user_email)

                // handlePendingPayment(order_id, payment); no sirve
                break

            case 'rejected':
                // Rechazos Específicos (OTHE, CALL, FUND, SECU, EXPI, FORM)

                // Actualizar orden a 'payment_failed'
                updateOrderStatus(order_id, 'payment_failed')
                // Permitir reintentos
                allowPaymentRetry(order_id)
                // Notificar al usuario con motivo específico
                sendRejectionNotification(user_email, payment.status_detail)


                // handleRejectedPayment(order_id, payment); no sirve
                break

            case 'in_process': // No entra
            // updateOrderStatus(order_id, 'payment_processing');
            // sendProcessingNotification(user_email);
            // break;

            case 'cancelled':
                handleCancelledPayment(order_id, payment)
                break

            case 'refunded':
                handleRefundedPayment(order_id, payment)
                break

            case 'in_process':
                handleProcessingPayment(order_id, payment)
                break

            default:
                // Log para estados no esperados
                console.warn(`Estado no manejado: ${payment.status}`, payment)
        }
    }

    // Timeouts y Reintentos
    // Para pagos pendientes
    setTimeout(() => {
        if (order.status === 'payment_pending') {
            // Verificar estado actual en MP
            checkPaymentStatus(payment_id)
        }
    }, 10 * 60 * 1000) // 10 minutos



}


// Endpoint: GET /payments/check/:paymentId
export const checkPayment = async (req: Request, res: Response) => {
    try {
        const { paymentId } = req.params
        const payment = await checkPaymentStatus(paymentId)
        res.json(payment)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

// Endpoint: GET /payments/check/preference/:paymentId
export const checkPreference = async (req: Request, res: Response) => {
    try {
        const { preferenceId } = req.params
        const preference = await checkPreferenceStatus(preferenceId)
        res.json(preference)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}



