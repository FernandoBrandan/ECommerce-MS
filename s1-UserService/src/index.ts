import dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()
app.use(express.json())

import cors from "cors"
app.use(cors())
// app.use(cors({
//     origin: (origin, callback) => {
//         const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:80", "http://localhost:5000"]
//         if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
//         return callback(new Error("Not allowed by CORS"))
//     }, credentials: true, // headers con auth
// }))

import "./database"

import { setupSwagger } from "./swagger"
setupSwagger(app)

import userRoutes from "./userRoute"
app.use("/v1", userRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
