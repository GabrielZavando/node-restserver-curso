
const express = require('express')
const api = express.Router()
const ProductController = require('../controllers/producto')
// Autenticación
const {verificaToken} = require('../middlewares/autenticacion')

// Crea un producto
api.post('/producto', verificaToken, ProductController.createProduct)
// Editar un producto
api.put('/producto/:id', verificaToken, ProductController.editProduct)
// Borrar un producto
api.delete('/producto/:id', verificaToken, ProductController.deleteProduct)
// Muestra un producto por su id
api.get('/producto/:id', ProductController.getProduct)
// Obtener lista de productos paginados
api.get('/productos', verificaToken, ProductController.getProducts)
api.get('/productos/buscar/:termino', verificaToken, ProductController.searchProduct)

module.exports = api