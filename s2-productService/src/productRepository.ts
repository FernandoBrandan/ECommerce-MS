import { IProduct } from "./productInterface"
import { Product } from "./productModel"

export const createProductDB = async (product: IProduct): Promise<IProduct> => {
    const duplicate = await Product.findOne({ where: { name: product.name } })
    if (duplicate) throw Error("Product already exists")

    const newProduct = await Product.create(product)
    if (!newProduct) throw Error("Error creating product")
    return newProduct.toJSON()
}

export const getAllProductsDB = async (): Promise<IProduct[]> => {
    const products = await Product.findAll()
    if (!products) throw Error("Error getting products")
    return products.map(product => product.toJSON())
}

export const getProductDB = async (name: string) => {
    const response = await Product.findOne({ where: { name: name } })
    if (!response) throw Error("Product not found")
    return response.toJSON()

}

export const updateProductDB = async (product: IProduct) => {
    const [affectedCount] = await Product.update(product, { where: { name: product.name } })
    if (affectedCount === 0) throw new Error("Product not found")
    return affectedCount
}

export const deleteProductDB = async (name: string) => {
    const response = await Product.destroy({ where: { name: name } })
    if (!response) throw Error("Product not found")
    return response
}
