import dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()
app.use(express.json())

import cors from "cors"
app.use(cors())

import "./database"

import { setupSwagger } from "./swagger"
setupSwagger(app)

import morgan from "morgan"
app.use(morgan("dev"))

import orderRoutes from "./orderRoute"
app.use("/v1", orderRoutes)

const PORT = process.env.PORT || 5003
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})