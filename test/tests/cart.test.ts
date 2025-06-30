
// tests/services/cart.test.ts
import request from 'supertest'

const BASE_URL = 'http://localhost:80'

describe('Shopping Cart Service - /api/cart', () => {
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

    describe('GET /api/cart/v1/cart', () => {
        it('should get user cart successfully', async () => {
            const response = await request(BASE_URL)
                .get('/api/cart/v1/cart')
                .set('Authorization', `Bearer ${authToken}`)

            expect(response.status).toBe(200)
        })

        it('should return 401 for unauthorized request', async () => {
            const response = await request(BASE_URL)
                .get('/api/cart/v1/cart')

            expect(response.status).toBe(401)
        })
    })

    describe('POST /api/cart/v1/cart/add', () => {
        it('should add item to cart successfully', async () => {
            const cartItem = {
                productId: '1',
                quantity: 2
            }

            const response = await request(BASE_URL)
                .post('/api/cart/v1/cart/add')
                .set('Authorization', `Bearer ${authToken}`)
                .send(cartItem)

            expect(response.status).toBe(200)
        })

        it('should return 401 for unauthorized request', async () => {
            const cartItem = {
                productId: '1',
                quantity: 2
            }

            const response = await request(BASE_URL)
                .post('/api/cart/v1/cart/add')
                .send(cartItem)

            expect(response.status).toBe(401)
        })
    })

    describe('DELETE /api/cart/v1/cart/remove/:productId', () => {
        it('should remove item from cart successfully', async () => {
            const response = await request(BASE_URL)
                .delete('/api/cart/v1/cart/remove/1')
                .set('Authorization', `Bearer ${authToken}`)

            expect(response.status).toBe(200)
        })

        it('should return 401 for unauthorized request', async () => {
            const response = await request(BASE_URL)
                .delete('/api/cart/v1/cart/remove/1')

            expect(response.status).toBe(401)
        })
    })
})
