import { IProduct } from "./productInterface"
import { Product } from "./productModel"

export const createProductDB = async (product: IProduct) => {
    const duplicate = await Product.findOne({ where: { name: product.name } })
    if (!duplicate) {
        const newProduct = await Product.create(product)
        return newProduct.toJSON()
    }
}

export const getAllProductsDB = async () => {
    const products = await Product.findAll()
    return products.map(product => product.toJSON())
}

export const getProductDB = async (id: number) => {
    const response = await Product.findOne({ where: { id: id } })
    return response?.toJSON()
}

export const updateProductDB = async (product: IProduct) => {
    const [affectedCount] = await Product.update(product, { where: { id: product.id } })
    return affectedCount
}

export const deleteProductDB = async (id: number) => {
    return await Product.destroy({ where: { id: id } })
}
