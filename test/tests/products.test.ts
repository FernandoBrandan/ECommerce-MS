// tests/services/products.test.ts
import request from 'supertest'
const BASE_URL = 'http://localhost:80'

describe('Products Service - /api/products', () => {
    let authToken: string
    let name: string = 'TestProduct' + Date.now()
    let description: string = 'Test Description' + Date.now()

    beforeAll(async () => {
        // Get auth token
        const loginResponse = await request(BASE_URL)
            .post('/api/users/v1/login')
            .send({
                email: 'login@example.com',
                password: '123456'
            })

        authToken = loginResponse.body.token
        console.log("Token:", authToken)
    })

    describe('POST /api/products/v1/product', () => {
        it('should create product with valid data and auth', async () => {
            const productData = {
                name: name,
                description: description,
                price: 99.99,
                stock: 10
            }

            const response = await request(BASE_URL)
                .post('/api/products/v1/product')
                .set('Authorization', `Bearer ${authToken}`)
                .send(productData)

            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty('message')
            expect(response.body).toHaveProperty('response.name', productData.name)
        })

        it('should return 401 for unauthorized request', async () => {
            const productData = {
                name: 'Test Product',
                price: 99.99
            }

            const response = await request(BASE_URL)
                .post('/api/products/v1/product')
                .send(productData)

            expect(response.status).toBe(400)
        })
    })

    describe('GET /api/products/v1/products', () => {
        it('should get all products successfully', async () => {
            const response = await request(BASE_URL).get('/api/products/v1/products')
            expect(response.status).toBe(200)
            expect(Array.isArray(response.body.response)).toBe(true)
        })
    })

    describe('GET /api/products/v1/products/:id', () => {
        it('should get product by valid ID', async () => {
            const response = await request(BASE_URL)
                .get('/api/products/v1/products/1')

            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('id')
        })

        it('should return 404 for non-existent product', async () => {
            const response = await request(BASE_URL)
                .get('/api/products/v1/products/99999')

            expect(response.status).toBe(404)
        })
    })
})
