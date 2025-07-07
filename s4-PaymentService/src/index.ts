import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
const app = express()
app.use(express.json())

import cors from 'cors'
app.use(cors())

import './database'

import morgan from 'morgan'
app.use(morgan('dev'))

import { setupSwagger } from './swagger'
setupSwagger(app)

import paymentRoutes from './paymentRoutes'
app.use('/v1', paymentRoutes)

const PORT = process.env.PORT || 5004
app.listen(PORT, () => {
    console.log(`Servidor http://localhost:${PORT}/payments`)
})
