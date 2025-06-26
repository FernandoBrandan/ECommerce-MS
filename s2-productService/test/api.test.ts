import request from 'supertest'
import app from '../src/index'
import * as productService from '../src/productInterface'

// Mock del productService
jest.mock('../productService')
const mockedProductService = productService as jest.Mocked<typeof productService>

describe('Product Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('POST /product', () => {
        it('should create a new product successfully', async () => {
            const newProductData = {
                name: 'Zapatilla Test' + Date.now(),
                description: 'Zapatilla para testing' + Date.now(),
                price: 99.99,
                stock: 50
            }

            const mockResponse = {
                message: 'Product created successfully',
                newProduct: {
                    id: 1,
                    ...newProductData,
                    createdAt: new Date()
                }
            }

            mockedProductService.createProductService.mockResolvedValue(mockResponse)

            const response = await request(app)
                .post('/product')
                .send(newProductData)
                .expect(201)

            expect(response.body).toEqual({
                message: mockResponse.message,
                response: mockResponse.newProduct
            })
            expect(mockedProductService.createProductService).toHaveBeenCalledWith(newProductData)
        })

        it('should return 400 when validation fails', async () => {
            const invalidProductData = {
                name: 'Test Product'
                // Missing required fields
            }

            mockedProductService.createProductService.mockRejectedValue(
                new Error('Validation failed: missing required fields')
            )

            const response = await request(app)
                .post('/product')
                .send(invalidProductData)
                .expect(400)

            expect(response.body).toEqual({
                message: 'Validation failed: missing required fields'
            })
        })

        it('should handle service errors', async () => {
            const productData = {
                name: 'Test Product',
                description: 'Test Description',
                price: 99.99,
                stock: 10
            }

            mockedProductService.createProductService.mockRejectedValue(
                new Error('Database connection failed')
            )

            const response = await request(app)
                .post('/product')
                .send(productData)
                .expect(400)

            expect(response.body.message).toBe('Database connection failed')
        })
    })

    describe('GET /product', () => {
        it('should get all products successfully', async () => {
            const mockProducts = {
                message: 'Products retrieved successfully',
                res: [
                    {
                        id: 1,
                        name: 'Zapatilla 1',
                        description: 'Descripción 1',
                        price: 89.99,
                        stock: 100
                    },
                    {
                        id: 2,
                        name: 'Zapatilla 2',
                        description: 'Descripción 2',
                        price: 79.99,
                        stock: 50
                    }
                ]
            }

            mockedProductService.getAllProductsService.mockResolvedValue(mockProducts)

            const response = await request(app)
                .get('/product')
                .expect(200)

            expect(response.body).toEqual({
                message: mockProducts.message,
                response: mockProducts.res
            })
            expect(mockedProductService.getAllProductsService).toHaveBeenCalled()
        })

        it('should handle service errors when getting all products', async () => {
            mockedProductService.getAllProductsService.mockRejectedValue(
                new Error('Failed to retrieve products')
            )

            const response = await request(app)
                .get('/product')
                .expect(400)

            expect(response.body.message).toBe('Failed to retrieve products')
        })
    })

    describe('GET /product/:name', () => {
        it('should get a product by name successfully', async () => {
            const productName = 'Zapatilla Test'
            const mockProduct = {
                message: 'Product found',
                res: {
                    id: 1,
                    name: productName,
                    description: 'Zapatilla para testing',
                    price: 99.99,
                    stock: 50
                }
            }

            mockedProductService.getProductService.mockResolvedValue(mockProduct)

            const response = await request(app)
                .get(`/product/${productName}`)
                .expect(200)

            expect(response.body).toEqual({
                message: mockProduct.message,
                response: mockProduct.res
            })
            expect(mockedProductService.getProductService).toHaveBeenCalledWith(productName)
        })

        it('should handle product not found', async () => {
            const productName = 'NonExistent Product'

            mockedProductService.getProductService.mockRejectedValue(
                new Error('Product not found')
            )

            const response = await request(app)
                .get(`/product/${productName}`)
                .expect(400)

            expect(response.body.message).toBe('Product not found')
        })

        it('should handle special characters in product name', async () => {
            const productName = 'Zapatilla%20Especial'
            const decodedName = 'Zapatilla Especial'

            const mockProduct = {
                message: 'Product found',
                res: {
                    id: 1,
                    name: decodedName,
                    description: 'Test',
                    price: 99.99,
                    stock: 10
                }
            }

            mockedProductService.getProductService.mockResolvedValue(mockProduct)

            await request(app)
                .get(`/product/${productName}`)
                .expect(200)

            expect(mockedProductService.getProductService).toHaveBeenCalledWith(decodedName)
        })
    })

    describe('PUT /product', () => {
        it('should update a product successfully', async () => {
            const updateData = {
                id: 1,
                name: 'Zapatilla Actualizada',
                description: 'Descripción actualizada',
                price: 109.99,
                stock: 75
            }

            const mockResponse = {
                message: 'Product updated',
                res: 1
            }

            mockedProductService.updateProductService.mockResolvedValue(mockResponse)

            const response = await request(app)
                .put('/product')
                .send(updateData)
                .expect(200)

            expect(response.body).toEqual({
                message: mockResponse.message,
                response: mockResponse.res
            })
            expect(mockedProductService.updateProductService).toHaveBeenCalledWith(updateData)
        })

        it('should return 400 when update fails', async () => {
            const updateData = {
                id: 999,
                name: 'Producto Inexistente',
                description: 'Test',
                price: 99.99,
                stock: 10
            }

            mockedProductService.updateProductService.mockRejectedValue(
                new Error('Product not found for update')
            )

            const response = await request(app)
                .put('/product')
                .send(updateData)
                .expect(400)

            expect(response.body.message).toBe('Product not found for update')
        })

        it('should validate required fields for update', async () => {
            const incompleteData = {
                id: 1,
                name: 'Test'
                // Missing required fields
            }

            mockedProductService.updateProductService.mockRejectedValue(
                new Error('Missing required fields for update')
            )

            const response = await request(app)
                .put('/product')
                .send(incompleteData)
                .expect(400)

            expect(response.body.message).toBe('Missing required fields for update')
        })
    })

    describe('DELETE /product', () => {
        it('should delete a product successfully', async () => {
            const productName = 'Zapatilla a Eliminar'
            const deleteData = { name: productName }

            const mockResponse = {
                message: 'Product deleted',
                res: 1
            }

            mockedProductService.deleteProductService.mockResolvedValue(mockResponse)

            const response = await request(app)
                .delete('/product')
                .send(deleteData)
                .expect(200)

            expect(response.body).toEqual({
                message: mockResponse.message,
                response: mockResponse.res
            })
            expect(mockedProductService.deleteProductService).toHaveBeenCalledWith(productName)
        })

        it('should return 400 when product to delete is not found', async () => {
            const productName = 'Producto Inexistente'
            const deleteData = { name: productName }

            mockedProductService.deleteProductService.mockRejectedValue(
                new Error('Product not found for deletion')
            )

            const response = await request(app)
                .delete('/product')
                .send(deleteData)
                .expect(400)

            expect(response.body.message).toBe('Product not found for deletion')
        })

        it('should handle missing name in delete request', async () => {
            const deleteData = {} // Missing name

            mockedProductService.deleteProductService.mockRejectedValue(
                new Error('Product name is required')
            )

            const response = await request(app)
                .delete('/product')
                .send(deleteData)
                .expect(400)

            expect(response.body.message).toBe('Product name is required')
        })
    })

    describe('Error Handling', () => {
        it('should handle unexpected errors gracefully', async () => {
            mockedProductService.getAllProductsService.mockRejectedValue(
                new Error('Unexpected server error')
            )

            const response = await request(app)
                .get('/product')
                .expect(400)

            expect(response.body.message).toBe('Unexpected server error')
        })

        it('should handle malformed JSON in requests', async () => {
            const response = await request(app)
                .post('/product')
                .send('invalid json')
                .set('Content-Type', 'application/json')
                .expect(400)

            // Este test depende de como Express maneje JSON malformado
            expect(response.body).toHaveProperty('message')
        })
    })
})

function beforeEach(arg0: () => void) {
    throw new Error('Function not implemented.')
}
