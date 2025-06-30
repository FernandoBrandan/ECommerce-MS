import { IProduct } from "./productInterface"
import { Product } from "./productModel"
import { CustomError } from "productUtils"

export const createProductDB = async (product: IProduct): Promise<IProduct> => {
    const duplicate = await Product.findOne({ where: { name: product.name } })
    if (duplicate) throw new CustomError("Product already exists", 401)

    const newProduct = await Product.create(product)
    if (!newProduct) throw new CustomError("Error creating product", 400)
    return newProduct.toJSON()
}

export const getAllProductsDB = async (): Promise<IProduct[]> => {
    const products = await Product.findAll()
    if (!products) throw new CustomError("Error getting products", 400)
    return products.map(product => product.toJSON())
}

export const getProductDB = async (name: string) => {
    const response = await Product.findOne({ where: { name: name } })
    if (!response) throw new CustomError("Product not found", 404)
    return response.toJSON()

}

export const updateProductDB = async (product: IProduct) => {
    const [affectedCount] = await Product.update(product, { where: { name: product.name } })
    if (affectedCount === 0) throw new CustomError("Product not found", 401)
    return affectedCount
}

export const deleteProductDB = async (name: string) => {
    const response = await Product.destroy({ where: { name: name } })
    if (!response) throw new CustomError("Product not found", 401)
    return response
}
