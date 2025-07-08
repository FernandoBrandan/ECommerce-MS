import { Router, Request, Response } from "express"
import axios from "axios"
const router = Router()

const apigateway = "localhost"



router.get('/register', (req: Request, res: Response) => {
    res.render('partials/user/register', { Response: "" })
})

router.post('/register', async (req: Request, res: Response) => {
    try {
        const response = await axios.post(`http://${apigateway}:80/api/users/v1/register`, {
            name: req.body.firstName + ", " + req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phone, // +56 11 12345678
            password: req.body.password,
        })
        console.log(response.data)
        res.render('partials/user/login')
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
        console.log(response.data)
        req.session.user = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            phoneNumber: response.data.user.phoneNumber,
            token: response.data.token,
        }

        res.render('index', { Response: req.session.user || null })
    } catch (error: any) {
        const message = error.response?.data || error.message || 'Error desconocido'
        res.render('index', { Response: message })
    }
})


router.get('/logout', (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

export default router