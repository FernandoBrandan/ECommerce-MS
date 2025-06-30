import { IProduct } from "./productInterface"
import { validateProductData } from "./productValidate"
import { createProductDB, getAllProductsDB, getProductDB, updateProductDB, deleteProductDB } from "./productRepository"
import { CustomError } from "productUtils"

export const createProductService = async (product: IProduct) => {
    const validate = validateProductData(product)
    if (validate) throw new CustomError(validate as string, 400)

    const newProduct = await createProductDB(product)
    return { message: 'Product created', newProduct }
}

export const getAllProductsService = async () => {
    const res = await getAllProductsDB()
    return { message: 'Products found', res }
}

export const getProductService = async (name: string) => {
    const res = await getProductDB(name)
    return { message: 'Product found', res }
}

export const updateProductService = async (product: IProduct) => {
    const validate = validateProductData(product)
    if (validate) throw new CustomError(validate as string, 400)

    const res = await updateProductDB(product)
    return { message: 'Product updated', res }
}

export const deleteProductService = async (name: string) => {
    const res = await deleteProductDB(name)
    return { message: 'Product deleted', res }
}
