import request from 'supertest'
const BASE_URL = 'http://localhost'
const PAYMENTE_CREATE_URL = '/api/payments/v1/create'
const PAYMENTE_SUCCESS_URL = '/api/payments/v1/success'
const PAYMENTE_CHECK_PAYMENT_URL = '/api/payments/v1/check'
const PAYMENTE_CHECK_PREFERENCE_URL = '/api/payments/v1/check/preference'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('Create Payment Preference', () => {

    let preferenceId: string
    let paymentId: string

    it('should create a payment preference', async () => {
        const orderData = {
            orderId: `ORDER-SUCCESS-${Date.now()}`,
            amount: 250,
            title: 'E2E Test Product - Success',
            email: 'success@test.com'
        }
        const createResponse = await request(BASE_URL).post(PAYMENTE_CREATE_URL).send(orderData)
        console.log('✅ Payment preference created successfully', createResponse.body)
        expect(createResponse.status).toBe(201)
        expect(createResponse.body).toHaveProperty('preferenceId', createResponse.body.preferenceId)
        expect(createResponse.body).toHaveProperty('preferenceInit_point', createResponse.body.preferenceInit_point)
        expect(createResponse.body).toHaveProperty('orderId', createResponse.body.orderId)

        // to next step
        preferenceId = createResponse.body.preferenceId
    })

    it('should check preference created', async () => {
        const checkResponse = await request(BASE_URL).get(`${PAYMENTE_CHECK_PREFERENCE_URL}/${preferenceId}`)
        console.log('checkResponse', checkResponse.body)
        expect(checkResponse.status).toBe(200)
        if (checkResponse.body.status === 200) paymentId = preferenceId
    })

    it('should check payment created', async () => {
        let paymentTest = false
        while (!paymentTest) {
            const checkResponse = await request(BASE_URL).get(`${PAYMENTE_CHECK_PAYMENT_URL}/${preferenceId}`)
            console.log('checkResponse', checkResponse.body)
            if (checkResponse.status === 200) {
                paymentTest = true
                expect(checkResponse.status).toBe(200)
                continue
            }
            console.log('waiting ....')
            await delay(5000)
        }
    })
})


/* 
describe('END-TO-END Payment System Tests', () => {
    describe.skip('Scenario 1: Complete Successful Payment Flow', () => {
        it('should handle the entire successful payment journey', async () => {

            // Step 1: Cliente inicia compra - POST /payments/create
            const orderData = {
                orderId: `ORDER-SUCCESS-${Date.now()}`,
                amount: 250,
                title: 'E2E Test Product - Success',
                email: 'success@test.com'
            }
            const createResponse = await request(BASE_URL).post('/payments/create').send(orderData)
            expect(createResponse.status).toBe(201)
            expect(createResponse.body).toHaveProperty('preferenceId', createResponse.body.preferenceId)
            expect(createResponse.body).toHaveProperty('preferenceInit_point', createResponse.body.preferenceInit_point)
            expect(createResponse.body).toHaveProperty('orderId', createResponse.body.orderId)

            // Step 2: Simulate MercadoPago processing (approved payment)

            // Step 3: Callback success with approved payment
            const successCallbackData = {
                payment_id: createResponse.body.preferenceId,
                external_reference: createResponse.body.orderId
            }
            const successResponse = await request(BASE_URL).post('/payments/success').send(successCallbackData)
            console.log(successResponse)

            console.log('✅ Payment processed successfully')
            console.log('🎉 Order status updated to: paid')

            // Step 4: 🔍 Verify payment status independently
            console.log('🔍 Step 4: Verifying payment status...')
            const checkResponse = await request(BASE_URL).get(`/payments/check/${createResponse.body.preferenceId}`)

            expect(checkResponse.status).toBe(200)
            expect(checkResponse.body).toHaveProperty('status', 'approved')

            console.log('✅ E2E Success flow completed successfully! 🎊')
        }, 15000)
    })

    describe.skip('❌ Scenario 2: Payment Rejection Flow', () => {
        it('should handle rejected payment correctly', async () => {
            console.log('🚀 Starting payment rejection flow...')

            // Step 1: Create payment
            const orderData = {
                orderId: `ORDER-REJECTED-${Date.now()}`,
                amount: 100,
                title: 'E2E Test Product - Rejection',
                email: 'rejected@test.com'
            }

            const createResponse = await request(BASE_URL)
                .post('/payments/create')
                .send(orderData)

            expect(createResponse.status).toBe(201)
            console.log('📝 Payment preference created')

            // Step 2: Simulate rejected payment callback 
            console.log('❌ Simulating rejected payment...')

            const rejectionData = {
                payment_id: "MOCK_PAYMENT_IDS.REJECTED",
                external_reference: orderData.orderId
            }

            const rejectionResponse = await request(BASE_URL)
                .post('/payments/success')
                .send(rejectionData)

            expect(rejectionResponse.status).toBe(400)
            expect(rejectionResponse.body).toEqual({
                success: false,
                paymentId: "MOCK_PAYMENT_IDS.REJECTED",
                status: 'rejected'
            })

            console.log('❌ Payment rejection handled correctly')

            // Step 3: Verify rejection status
            const checkResponse = await request(BASE_URL)
                .get(`/payments/check/${"MOCK_PAYMENT_IDS.REJECTED"}`)

            expect(checkResponse.status).toBe(200)
            expect(checkResponse.body).toHaveProperty('status', 'rejected')

            console.log('✅ Rejection flow completed correctly')
        }, 10000)
    })

    describe.skip('⏰ Scenario 3: Pending Payment with Timeout', () => {
        it('should handle pending payment timeout scenario', async () => {
            console.log('🚀 Starting pending payment timeout flow...')

            // Step 1: Create payment
            const orderData = {
                orderId: `ORDER-TIMEOUT-${Date.now()}`,
                amount: 75,
                title: 'E2E Test Product - Timeout',
                email: 'timeout@test.com'
            }

            const createResponse = await request(BASE_URL)
                .post('/payments/create')
                .send(orderData)

            expect(createResponse.status).toBe(201)
            console.log('📝 Payment preference created')

            // Step 2: Simulate pending payment that times out 
            console.log('⏳ Simulating pending payment with timeout...')

            const pendingData = {
                payment_id: "MOCK_PAYMENT_IDS.TIMEOUT",
                external_reference: orderData.orderId
            }

            // This should trigger the polling mechanism and eventually timeout
            const pendingResponse = await request(BASE_URL)
                .post('/payments/success')
                .send(pendingData)

            // Expecting timeout scenario (still pending after max attempts)
            expect(pendingResponse.status).toBe(400)
            expect(pendingResponse.body).toHaveProperty('success', false)
            expect(pendingResponse.body).toHaveProperty('timeout', true)

            console.log('⌛ Timeout scenario handled correctly')
        }, 25000) // Extended timeout for polling
    })

    describe.skip('💥 Scenario 4: Error Handling Flows', () => {
        it('should handle invalid payment creation data', async () => {
            console.log('🚀 Testing invalid payment creation...')

            const invalidData = {
                // Missing required orderId
                amount: 100,
                title: 'Invalid Product',
                email: 'invalid@test.com'
            }

            const response = await request(BASE_URL)
                .post('/payments/create')
                .send(invalidData)

            expect(response.status).toBe(500)
            expect(response.body).toHaveProperty('error')
            console.log('✅ Invalid data error handled correctly')
        })

        it('should handle missing payment_id in success callback', async () => {
            console.log('🚀 Testing missing payment_id scenario...')

            const invalidCallbackData = {
                external_reference: 'ORDER-123'
                // Missing payment_id
            }

            const response = await request(BASE_URL)
                .post('/payments/success')
                .send(invalidCallbackData)

            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('error', 'payment_id requerido')
            console.log('✅ Missing payment_id error handled correctly')
        })

        it('should handle payment not found scenario', async () => {
            console.log('🚀 Testing payment not found scenario...')

            const notFoundData = {
                payment_id: "MOCK_PAYMENT_IDS.NOT_FOUND",
                external_reference: 'ORDER-NOT-FOUND'
            }

            const response = await request(BASE_URL)
                .post('/payments/success')
                .send(notFoundData)

            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('error', 'Payment not found')
            console.log('✅ Payment not found error handled correctly')
        })

        it('should handle invalid payment check', async () => {
            console.log('🚀 Testing invalid payment check...')

            const response = await request(BASE_URL)
                .get('/payments/check/INVALID_PAYMENT_ID')

            expect(response.status).toBe(500)
            expect(response.body).toHaveProperty('error')
            console.log('✅ Invalid payment check error handled correctly')
        })
    })

    describe.skip('🔄 Scenario 5: Parallel Operations', () => {
        it('should handle multiple concurrent payment creations', async () => {
            console.log('🚀 Testing concurrent payment operations...')

            const paymentPromises = Array.from({ length: 3 }, (_, index) => {
                const orderData = {
                    orderId: `ORDER-CONCURRENT-${Date.now()}-${index}`,
                    amount: 50 + index * 10,
                    title: `Concurrent Product ${index + 1}`,
                    email: `concurrent${index}@test.com`
                }

                return request(BASE_URL)
                    .post('/payments/create')
                    .send(orderData)
            })

            const responses = await Promise.all(paymentPromises)

            responses.forEach((response, index) => {
                expect(response.status).toBe(201)
                expect(response.body).toHaveProperty('orderId', `ORDER-CONCURRENT-${Date.now()}-${index}`)
                console.log(`✅ Concurrent payment ${index + 1} created successfully`)
            })

            console.log('✅ All concurrent operations completed successfully')
        })

        it('should handle check payment during processing', async () => {
            console.log('🚀 Testing payment check during processing...')

            // Create payment
            const orderData = {
                orderId: `ORDER-CHECK-DURING-${Date.now()}`,
                amount: 120,
                title: 'Check During Processing Product',
                email: 'checkduring@test.com'
            }

            const createResponse = await request(BASE_URL)
                .post('/payments/create')
                .send(orderData)

            expect(createResponse.status).toBe(201)

            // Simulate checking payment status while it's being processed
            const paymentId = "MOCK_PAYMENT_IDS.PENDING"

            const checkResponse = await request(BASE_URL)
                .get(`/payments/check/${paymentId}`)

            expect(checkResponse.status).toBe(200)
            expect(checkResponse.body).toHaveProperty('status')
            console.log('✅ Payment check during processing works correctly')
        })
    })

    describe.skip('🎭 Scenario 6: Edge Cases', () => {
        it('should handle extremely large order amounts', async () => {
            console.log('🚀 Testing large order amount...')

            const largeOrderData = {
                orderId: `ORDER-LARGE-${Date.now()}`,
                amount: 999999.99,
                title: 'Large Amount Product',
                email: 'large@test.com'
            }

            const response = await request(BASE_URL)
                .post('/payments/create')
                .send(largeOrderData)

            expect(response.status).toBe(201)
            console.log('✅ Large amount order handled correctly')
        })

        it('should handle special characters in order data', async () => {
            console.log('🚀 Testing special characters...')

            const specialCharData = {
                orderId: `ORDER-SPECIAL-${Date.now()}`,
                amount: 50,
                title: 'Producto con ñ, acentos á é í ó ú y símbolos @#$%',
                email: 'special@tést.com'
            }

            const response = await request(BASE_URL)
                .post('/payments/create')
                .send(specialCharData)

            expect(response.status).toBe(201)
            console.log('✅ Special characters handled correctly')
        })

        it('should handle very long polling timeout', async () => {
            console.log('🚀 Testing extended polling scenario...')

            const longPollingData = {
                payment_id: "MOCK_PAYMENT_IDS.PENDING",
                external_reference: `ORDER-LONG-POLL-${Date.now()}`
            }

            const startTime = Date.now()

            const response = await request(BASE_URL)
                .post('/payments/success')
                .send(longPollingData)

            const endTime = Date.now()
            const duration = endTime - startTime

            // Should take at least some time due to polling
            expect(duration).toBeGreaterThan(5000) // At least 5 seconds
            expect(response.status).toBe(400) // Eventually times out
            console.log(`✅ Extended polling completed in ${duration}ms`)
        }, 70000) // Very long timeout for this test
    })

    describe.skip('📊 Scenario 7: System Integration Validation', () => {
        it('should validate complete system integration', async () => {
            console.log('🚀 Starting complete system integration test...')

            // Create multiple orders of different types
            const orders = [
                { type: 'success', orderId: `INT-SUCCESS-${Date.now()}`, paymentId: "MOCK_PAYMENT_IDS.APPROVED" },
                { type: 'rejected', orderId: `INT-REJECTED-${Date.now()}`, paymentId: "MOCK_PAYMENT_IDS.REJECTED" }
            ]

            for (const order of orders) {
                console.log(`📝 Processing ${order.type} order: ${order.orderId}`)

                // Step 1: Create payment
                const createResponse = await request(BASE_URL)
                    .post('/payments/create')
                    .send({
                        orderId: order.orderId,
                        amount: 100,
                        title: `Integration ${order.type} product`,
                        email: `${order.type}@integration.com`
                    })

                expect(createResponse.status).toBe(201)

                // Step 2: Process callback 
                const callbackResponse = await request(BASE_URL)
                    .post('/payments/success')
                    .send({
                        payment_id: order.paymentId,
                        external_reference: order.orderId
                    })

                if (order.type === 'success') {
                    expect(callbackResponse.status).toBe(200)
                    expect(callbackResponse.body.success).toBe(true)
                } else {
                    expect(callbackResponse.status).toBe(400)
                    expect(callbackResponse.body.success).toBe(false)
                }

                // Step 3: Verify final state
                const checkResponse = await request(BASE_URL)
                    .get(`/payments/check/${order.paymentId}`)

                expect(checkResponse.status).toBe(200)
                console.log(`✅ ${order.type} order processed correctly`)
            }

            console.log('🎊 Complete system integration validation passed!')
        }, 20000)
    })
})
 */