import express, { response } from 'express'
import path from 'path'
import axios from 'axios'
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
const apigateway = "gateway"
app.post('/register', async (req, res) => {
    try {
        const response = await axios.post(`http://${apigateway}:80/api/users/v1/register`, {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        res.render('index', { Response: JSON.stringify(response.data) })
    } catch (error: any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        res.render('index', { Response: message })
    }
})

app.post('/login', async (req, res) => {
    try {
        const response = await axios.post(`http://${apigateway}:80/api/users/v1/login`, {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        res.render('index', { Response: JSON.stringify(response.data) })
    } catch (error: any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        res.render('index', { Response: message })
    }
})

// Crear producto
app.post('/product', async (req, res) => {
    try {
        const response = await axios.post(`http://${apigateway}:80/api/products/v1/product`, {
            name: req.body.name,
            description: req.body.description,
            price: parseFloat(req.body.price),
            stock: parseInt(req.body.stock),
        })
        res.render('index', { Response: JSON.stringify(response.data) })
    } catch (error: any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        res.render('index', { Response: message })
    }
})

// Obtener todos los productos
app.get('/product', async (req, res) => {
    try {
        const response = await axios.get(`http://${apigateway}:80/api/products/v1/product`)
        res.render('index', { Response: JSON.stringify(response.data) })
    } catch (error: any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        res.render('index', { Response: message })
    }
})

// Obtener producto por nombre
app.get('/product/:name', async (req, res) => {
    try {
        const response = await axios.get(`http://${apigateway}:80/api/products/v1/product/${encodeURIComponent(req.params.name)}`)
        res.render('index', { Response: JSON.stringify(response.data) })
    } catch (error: any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        res.render('index', { Response: message })
    }
})

// Actualizar producto
app.put('/product', async (req, res) => {
    try {
        const response = await axios.put(`http://${apigateway}:80/api/products/v1/product`, {
            id: parseInt(req.body.id),
            name: req.body.name,
            description: req.body.description,
            price: parseFloat(req.body.price),
            stock: parseInt(req.body.stock),
        })
        res.render('index', { Response: JSON.stringify(response.data) })
    } catch (error: any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        res.render('index', { Response: message })
    }
})

// Eliminar producto
app.delete('/product', async (req, res) => {
    try {
        const response = await axios.delete(`http://${apigateway}:80/api/products/v1/product`, {
            data: { name: req.body.name },
        })
        res.render('index', { Response: JSON.stringify(response.data) })
    } catch (error: any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        res.render('index', { Response: message })
    }
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
