
// Rutas para el controlador de usuarios

const express = require('express')
// Nos da accesos a los métodos get, post, put, delete, etc
const api = express.Router()
const UserController = require('../controllers/usuario')
// Importamos middlewares de autenticacion
const {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion')

// Crear usuario
api.post('/usuario', verificaToken, UserController.createUser)
// Edita un usuario
api.put('/usuario/:id', [verificaToken, verificaAdminRole], UserController.editUser)
// Elimina un usuario
api.delete('/usuario/:id', [verificaToken, verificaAdminRole], UserController.deleteUser)
// Lista usuarios activos y paginados
api.get('/usuarios', verificaToken, UserController.getUsers)




module.exports = api