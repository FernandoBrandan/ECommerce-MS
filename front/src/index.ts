import express, { response } from 'express'
import path from 'path'
const app = express()
const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs')
app.set('views', path.join(process.cwd(), 'dist/views'))
app.use(express.static(path.join(process.cwd(), 'dist/public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Ruta principal
app.get('/', (_req, res) => {
    res.render('index', { Response: "" })
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