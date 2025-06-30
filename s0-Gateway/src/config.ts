import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import rateLimit from "express-rate-limit"

const middleware = (app: express.Application) => {
    app.use(morgan('dev'))

    app.use(helmet({
        dnsPrefetchControl: false,
        contentSecurityPolicy: false,
        hsts: false,
        frameguard: false,
        //frameguard: { action: "deny" },
        referrerPolicy: false,
    }))

    app.set('trust proxy', 1) // Confía en el X-Forwarded-For que llega del proxy/gateway
    const limiter = rateLimit({
        windowMs: 5 * 60 * 1000,
        limit: 500,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: "Too many requests, please try again later.",
        statusCode: 429,
    })
    app.use(limiter)
}

export default middleware
