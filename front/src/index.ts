import express, { Request, Response } from 'express'
import path from 'path'
const app = express()
const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs')
app.set('views', path.join(process.cwd(), 'dist/views'))
app.use(express.static(path.join(process.cwd(), 'dist/public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

import session from 'express-session'
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

// Definir tipo extendido para sesión
declare module 'express-session' {
    interface SessionData {
        user?: {
            id: number,
            name: string,
            email: string,
            phoneNumber: string,
            token: string
        }
        cart?: {
            items: Array<{
                productId: number
                quantity: number
            }>
            totalPrice?: number
            quantityItems?: number
            shipment?: number
            taxes?: number
            totalFinal?: number
        }
    }
}

app.use((req, res, next) => {
    res.locals.user = req.session.user || null
    next()
})

// Ruta principal
app.get('/', (req: Request, res: Response) => {
    console.log("Usuario:", req.session.user)
    res.render('index', { Response: req.session.user || null })
})

import auth from './server/authRoute.js'
import products from './server/productsRoute.js'
import cart from './server/cartRoute.js'
import order from './server/orderRoute.js'
app.use('/', auth)
app.use('/products', products)
app.use('/cart', cart)
app.use('/order', order)


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})