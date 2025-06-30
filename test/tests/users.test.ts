// tests/services/users.test.ts
import request from 'supertest'

const BASE_URL = 'http://localhost:80'

describe('Users Service - /api/users', () => {
    let authToken: string
    let name: string = 'TestUser' + Date.now()
    let email: string = `test${Date.now()}@example.com`
    let password: string = '123456'

    describe('POST /api/users/v1/register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                name: name,
                email: email,
                password: password,
            }

            const response = await request(BASE_URL)
                .post('/api/users/v1/register')
                .send(userData)

            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty('message')
            expect(response.body).toHaveProperty('name', userData.name)
            expect(response.body).toHaveProperty('email', userData.email)
        })

        it('should return 400 for missing required fields', async () => {
            const userData = {
                name: name
                // Missing email and password
            }

            const response = await request(BASE_URL)
                .post('/api/users/v1/register')
                .send(userData)

            expect(response.status).toBe(400)
        })
    })

    describe('POST /api/users/v1/login', () => {
        beforeAll(async () => {
            // Register a user first
            await request(BASE_URL)
                .post('/api/users/v1/register')
                .send({
                    name: name,
                    email: email,
                    password: password,
                })
        })

        it('should login successfully with valid credentials', async () => {
            const loginData = {
                email: email,
                password: password,
            }

            const response = await request(BASE_URL)
                .post('/api/users/v1/login')
                .send(loginData)

            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('token')

            // Save token for validation test
            authToken = response.body.token
        })

        it('should return 401 for invalid credentials', async () => {
            const loginData = {
                email: 'login@example.com',
                password: 'wrongpassword'
            }

            const response = await request(BASE_URL)
                .post('/api/users/v1/login')
                .send(loginData)

            expect(response.status).toBe(401)
        })
    })

    describe.skip('GET /api/users/v1/validate', () => {
        it('should validate token successfully', async () => {
            const response = await request(BASE_URL)
                .get('/api/users/v1/validate')
                .set('Authorization', `Bearer ${authToken}`)

            expect(response.status).toBe(200)
        })

        it('should return 401 for invalid token', async () => {
            const response = await request(BASE_URL)
                .get('/api/users/v1/validate')
                .set('Authorization', 'Bearer invalidtoken')

            expect(response.status).toBe(401)
        })
    })
})
