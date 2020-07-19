// Rutas para servir imagenes

const express = require('express')
const ImagesController = require('../controllers/imagenes')
const api = express.Router()
const {verificaTokenImg} = require('../middlewares/autenticacion')
 // recibimos el tipo (usuario o producto y el nombre más la extensión de la imagen)
api.get('/imagen/:tipo/:img', verificaTokenImg, ImagesController.getImages)

module.exports = api