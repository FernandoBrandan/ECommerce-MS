
// tests/services/orders.test.ts
import request from 'supertest'

const BASE_URL = 'http://localhost:80'

describe('Orders Service - /api/orders', () => {
    let authToken: string

    beforeAll(async () => {
        // Get auth token
        const loginResponse = await request(BASE_URL)
            .post('/api/users/v1/login')
            .send({
                email: 'login@example.com',
                password: '123456'
            })

        authToken = loginResponse.body.token
    })

    describe('GET /api/orders/v1/orders', () => {
        it('should get user orders successfully', async () => {
            const response = await request(BASE_URL)
                .get('/api/orders/v1/orders')
                .set('Authorization', `Bearer ${authToken}`)

            expect(response.status).toBe(200)
        })

        it('should return 401 for unauthorized request', async () => {
            const response = await request(BASE_URL)
                .get('/api/orders/v1/orders')

            expect(response.status).toBe(401)
        })
    })

    describe('POST /api/orders/v1/order', () => {
        it('should create order successfully', async () => {
            const orderData = {
                items: [
                    { productId: '1', quantity: 2, price: 99.99 }
                ],
                shippingAddress: {
                    street: '123 Main St',
                    city: 'Test City',
                    postalCode: '12345',
                    country: 'Test Country'
                }
            }

            const response = await request(BASE_URL)
                .post('/api/orders/v1/order')
                .set('Authorization', `Bearer ${authToken}`)
                .send(orderData)

            expect(response.status).toBe(201)
        })

        it('should return 401 for unauthorized request', async () => {
            const orderData = {
                items: [
                    { productId: '1', quantity: 2, price: 99.99 }
                ]
            }

            const response = await request(BASE_URL)
                .post('/api/orders/v1/order')
                .send(orderData)

            expect(response.status).toBe(401)
        })
    })

    describe('GET /api/orders/v1/order/:id', () => {
        it('should get order by ID successfully', async () => {
            const response = await request(BASE_URL)
                .get('/api/orders/v1/order/1')
                .set('Authorization', `Bearer ${authToken}`)

            expect([200, 404]).toContain(response.status)
        })

        it('should return 401 for unauthorized request', async () => {
            const response = await request(BASE_URL)
                .get('/api/orders/v1/order/1')

            expect(response.status).toBe(401)
        })
    })
})


