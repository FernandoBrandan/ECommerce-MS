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

import cartRoutes from "./cartRoute"
app.use("/v1", cartRoutes)

const PORT = process.env.PORT || 5002
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
export default app  
