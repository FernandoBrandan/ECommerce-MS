import express from 'express'
import { config } from 'dotenv'
import { authMiddleware } from './middleware/auth.middleware.js'
import notificationRoute from './routes/notification.routes.js'

config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use('/', authMiddleware, notificationRoute)



app.listen(process.env.NOTIFICATION_PORT, ()=>{
    console.log(`app listening on ${process.env.PORT}`);
})



