import express, { Request, Response, NextFunction } from 'express'
import expressProxy from 'express-http-proxy'
const app = express()
app.use(express.json())

import middleware from './config'
middleware(app)

app.use('/api/users', expressProxy('http://user-service:5000'))
app.use('/api/products', expressProxy('http://product-service:5001'))
app.use('/api/cart', expressProxy('http://cart-service:5002'))
app.use('/api/orders', expressProxy('http://order-service:5003'))
app.use('/api/payments', expressProxy('http://payment-service:5004'))
app.use('/api/notification', expressProxy('http://notification-service:5005'))

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err)
    res.status(500).send({ errors: [{ message: 'Something went wrong' }] })
})

app.listen(80, () => console.log(`Gateway running on http://localhost:80`))
