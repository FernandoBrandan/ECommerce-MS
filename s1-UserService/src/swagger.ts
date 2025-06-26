// swagger.ts
import swaggerJsDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { Express } from "express"

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "User Service API",
            version: "1.0.0",
            description: "API for user registration and authentication",
        },
        servers: [
            {
                url: "http://localhost:80/api/users/"
            },
        ],
    },
    apis: ["./src/*.ts"], // ajustá esto a donde tengas tus rutas
}

const specs = swaggerJsDoc(options)

export const setupSwagger = (app: Express) => {
    // if (process.env.NODE_ENV !== "production") {
    //     app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))
    // }
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))
    //  /api/users/api-docs
}   
