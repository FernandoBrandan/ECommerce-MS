import { Router, Request, Response } from "express"
import axios from "axios"
const router = Router()

const apigateway = "gateway"


router.get('/register', (req: Request, res: Response) => {
    res.render('partials/user/register', { Response: "" })
})

router.post('/register', async (req: Request, res: Response) => {
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

router.get('/login', (req: Request, res: Response) => {
    res.render('partials/user/login', { Response: "" })
})

router.post('/login', async (req: Request, res: Response) => {
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

export default router