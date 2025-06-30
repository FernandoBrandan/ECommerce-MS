import express from 'express'
import paymentRoutes from './paymentRoutes'

const app = express()
app.use(express.json())
app.use('/v1', paymentRoutes)

app.get('/success', (req, res) => { res.send('successUrl from Payment Service!') })
app.get('/failure', (req, res) => { res.send('failureUrl from Payment Service!') })
app.get('/pending', (req, res) => { res.send('pendingUrl from Payment Service!') })


const PORT = 5004
app.listen(PORT, () => {
    console.log(`Servidor http://localhost:${PORT}/payments`)
})
