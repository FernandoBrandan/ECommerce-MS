import { IProduct } from "./productInterface"
import { validateProductData, validateProductDataUpdate } from "./productValidate"
import { createProductDB, getAllProductsDB, getProductDB, updateProductDB, deleteProductDB } from "./productRepository"
import { CustomError } from "./productUtils"

export const createProductService = async (product: IProduct) => {
    const validate = validateProductData(product)
    if (validate) return { error: true, message: 'Invalid parameters', validate }

    const newProduct = await createProductDB(product)
    if (!newProduct) return { error: true, message: 'Error creating product', newProduct: null }

    return { error: false, message: 'Product created', newProduct }
}

export const getAllProductsService = async () => {
    const res = await getAllProductsDB()
    if (res.length === 0) return { error: true, message: 'No products found', res: [] }

    return { error: false, message: 'Products found', res }
}

export const getProductService = async (id: number) => {
    const product = await getProductDB(id)
    if (!product) return { error: true, message: 'Product not found', product: null }

    return { error: false, message: 'Product found', product }
}

export const updateProductService = async (product: IProduct) => {
    const validate = validateProductDataUpdate(product)
    if (validate) return { error: true, message: 'Invalid parameters', validate }

    const affectedCount = await updateProductDB(product)
    if (affectedCount === 0) return { error: true, message: 'Error updating product', res: [] }
    if (affectedCount > 1) return { error: true, message: 'Error was updated more than one record', res: [] }

    return { error: false, message: 'Product updated', res: [] }
}

export const deleteProductService = async (id: number) => {
    const res = await deleteProductDB(id)
    if (!res) return { error: true, message: 'Product not found or already deleted', res: [] }

    return { error: false, message: 'Product deleted', res }
}
