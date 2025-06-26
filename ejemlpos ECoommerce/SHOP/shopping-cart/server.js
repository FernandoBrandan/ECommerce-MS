import express from 'express'
import { config } from 'dotenv'
import dbConnect from './dbConnect.js'
import { authMiddleware } from './middleware/auth.middleware.js'
import cartRoute from './routes/cart.routes.js'
config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use('/', authMiddleware, cartRoute)

app.listen(process.env.CART_PORT, ()=>{
    console.log(`app listening on ${process.env.PORT}`);
})
dbConnect()


