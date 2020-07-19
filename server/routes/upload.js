// Rutas de las cargas

const express = require('express')
const api = express.Router()
const FilesController = require('../controllers/upload')

// Subir archivos de usuario o producto
api.put('/upload/:tipo/:id', FilesController.upLoadArchive)


module.exports = api
