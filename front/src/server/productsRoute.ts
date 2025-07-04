import { Router, Request, Response } from "express"
import axios from "axios"
const router = Router()

//const apigateway = "gateway"
const apigateway = "localhost"

// Obtener todos los productos
router.get('/', async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`http://${apigateway}:80/api/products/v1/products`)
        res.render('partials/product/getAll', { products: response.data.response })
    } catch (error: any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        res.render('index', { Response: message })
    }
})

router.get('/create', async (req: Request, res: Response) => {
    try {
        res.render('partials/product/create')
    } catch (error: any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        res.render('index', { Response: message })
    }
})

// Crear producto
router.post('/create', async (req: Request, res: Response) => {
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

// Obtener producto por id
router.get('/get/:id', async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`http://${apigateway}:80/api/products/v1/product/${encodeURIComponent(req.params.id)}`)
        res.render('partials/product/get', { product: response.data.response })
    } catch (error: any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        res.render('index', { Response: message })
    }
})


router.get('/edit/:id', async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`http://${apigateway}:80/api/products/v1/product/${encodeURIComponent(req.params.id)}`)
        res.render('partials/product/update', { product: response.data.response })
    } catch (error: any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        res.render('index', { Response: message })
    }
})

// Actualizar producto
router.post('/edit', async (req: Request, res: Response) => {
    try {
        const response = await axios.put(`http://${apigateway}:80/api/products/v1/product`, {
            id: parseInt(req.body.id),
            name: req.body.name,
            description: req.body.description,
            price: parseFloat(req.body.price),
            stock: parseInt(req.body.stock),
        })
        res.redirect('/products/')
    } catch (error: any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        res.render('index', { Response: message })
    }
})

// Eliminar producto
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await axios.delete(`http://${apigateway}:80/api/products/v1/product/${req.params.id}`)
        res.redirect('/products/')
    } catch (error: any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        res.render('index', { Response: message })
    }
})

export default router