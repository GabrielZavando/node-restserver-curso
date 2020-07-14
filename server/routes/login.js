
// Rutas de login y registro de usuarios

const express = require('express')
const api = express.Router()
const LoginController = require('../controllers/login')

// Login tradicional
api.post('/login', LoginController.login)
// Login o registro con Google
api.post('/google', LoginController.loginGoogle)



module.exports = api