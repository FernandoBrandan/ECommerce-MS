import joi from "joi"
import { IProduct } from "./productInterface"

const productSchema = joi.object<IProduct>({
    name: joi.string().required().min(3).max(100),
    description: joi.string().required().min(10).max(1000),
    price: joi.number().required().min(0),
    stock: joi.number().integer().min(0).default(0),
})

export const validateProductData = (product: IProduct) => {
    const { error } = productSchema.validate(product)
    if (error) return error.message
    return null
}

const productSchemaUpdate = joi.object<IProduct>({
    id: joi.number().integer().required(),
    name: joi.string().required().min(3).max(100),
    description: joi.string().required().min(10).max(1000),
    price: joi.number().required().min(0),
    stock: joi.number().integer().min(0).default(0),
})

export const validateProductDataUpdate = (product: IProduct) => {
    const { error } = productSchemaUpdate.validate(product)
    if (error) return error.message
    return null
}
