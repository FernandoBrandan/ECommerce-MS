// CONTROLLER DE MICROSERVICIO
import { Request, Response } from 'express'
import { createPreference, waitForPaymentConfirmation, checkPaymentStatus, checkPreferenceStatus, processWebhook } from './paymentService'

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

export const webhook = (req: Request, res: Response) => {
    res.status(200).json({ error: false, message: 'Webhook received and processed successfully' })
    try { processWebhook(req.body) }
    catch (error: any) { console.error('Error processing webhook:', error) }
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

