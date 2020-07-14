
const express = require('express')
const api = express.Router()
const CategoryController = require('../controllers/categoria')
const {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion')

// Crear categoria
api.post('/categoria', verificaToken, CategoryController.createCategory)
// Editar una categoria
api.put('/categoria/:id', verificaToken, CategoryController.editCategory)
// Elimina una categoria
api.delete('/categoria/:id', [verificaToken, verificaAdminRole], CategoryController.deleteCategory)
// Mostrar una categoria por su ID
api.get('/categoria/:id', CategoryController.getCategory)
// Listar categorias
api.get('/categorias', verificaToken, CategoryController.getCategories)


module.exports = api