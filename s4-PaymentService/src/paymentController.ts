// CONTROLLER DE MICROSERVICIO
import { Request, Response } from 'express'
import { createPreference, waitForPaymentConfirmation, checkPaymentStatus, checkPreferenceStatus } from './paymentService'
import { updatePaymentStatusDB } from './paymentRepository'

export const createPayment = async (req: Request, res: Response) => {
    try {
        const preference = await createPreference(req.body)
        res.status(201).json({
            preferenceId: preference.id,
            preferenceInit_point: preference.init_point,
            orderId: preference.external_reference
        })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export const webhook = async (req: any, res: any) => {
    console.log('webhook', req.body)
    const { type, data } = req.body
    if (type === 'payment') {
        const paymentId = data.id
        const payment = await checkPaymentStatus(paymentId)
        await updatePaymentStatusDB(paymentId, payment.status, payment.external_reference)
    }
    res.sendStatus(200)
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



