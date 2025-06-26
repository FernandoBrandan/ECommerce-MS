import dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()
app.use(express.json())

import cors from "cors"
app.use(cors())

import orderRoutes from "./orderRoute"
app.use("/v1", orderRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


/**
 * create:
 * items length > 0
 * total amount = 0
 * get price and from item to db
 * calculate total amount
 * reduce stock
 * create order
 * return order
 * 
 * get:
 * change status:  delivered - payment - sent 
 * 
 */