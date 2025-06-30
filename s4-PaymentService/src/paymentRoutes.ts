import { Router } from "express"
const router = Router()

import { createPayment, checkPayment, checkPreference, webhook } from './paymentController'

router.post('/create', createPayment)
router.post('/webhook', webhook)
router.get('/check/:paymentId', checkPayment)
router.get('/check/preference/:paymentId', checkPreference)

export default router

/**
 * PaymentController(createPayment) -> paymentService(createPreference)
 * PaymentController(handlePaymentSuccess) -> paymentService(waitForPaymentConfirmation) -> paymentService(checkPaymentStatus)
 * PaymentController(checkPayment) -> paymentService(checkPaymentStatus)
 * PaymentController(updateOrderStatus)
 */