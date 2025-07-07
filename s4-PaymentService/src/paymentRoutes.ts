import { Router } from "express"
const router = Router()

import { createPayment, checkPayment, checkPreference, webhook } from './paymentController'

router.post('/create', createPayment)
router.post('/webhook', webhook)
router.get('/check/:paymentId', checkPayment)
router.get('/check/preference/:paymentId', checkPreference)


router.get('/success', (req, res) => { res.send('successUrl from Payment Service!') })
router.get('/failure', (req, res) => { res.send('failureUrl from Payment Service!') })
router.get('/pending', (req, res) => { res.send('pendingUrl from Payment Service!') })


export default router

/**
 * PaymentController(createPayment) -> paymentService(createPreference)
 * PaymentController(handlePaymentSuccess) -> paymentService(waitForPaymentConfirmation) -> paymentService(checkPaymentStatus)
 * PaymentController(checkPayment) -> paymentService(checkPaymentStatus)
 * PaymentController(updateOrderStatus)
 */