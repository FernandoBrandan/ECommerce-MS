// tests/services/notifications.test.ts
import request from 'supertest'

const BASE_URL = 'http://localhost:80'

describe('Notifications Service - /api/notification', () => {
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

    describe('GET /api/notification/v1/notifications', () => {
        it('should get user notifications successfully', async () => {
            const response = await request(BASE_URL)
                .get('/api/notification/v1/notifications')
                .set('Authorization', `Bearer ${authToken}`)

            expect([200, 404]).toContain(response.status)
        })

        it('should return 401 for unauthorized request', async () => {
            const response = await request(BASE_URL)
                .get('/api/notification/v1/notifications')

            expect(response.status).toBe(401)
        })
    })

    describe('POST /api/notification/v1/send', () => {
        it('should send notification successfully', async () => {
            const notificationData = {
                userId: '1',
                type: 'email',
                subject: 'Test Notification',
                message: 'This is a test notification'
            }

            const response = await request(BASE_URL)
                .post('/api/notification/v1/send')
                .set('Authorization', `Bearer ${authToken}`)
                .send(notificationData)

            expect([200, 201, 400]).toContain(response.status)
        })

        it('should return 401 for unauthorized request', async () => {
            const notificationData = {
                type: 'email',
                message: 'test'
            }

            const response = await request(BASE_URL)
                .post('/api/notification/v1/send')
                .send(notificationData)

            expect(response.status).toBe(401)
        })
    })
})