
// Configuracion de servidor con express

const express = require('express')
const path = require('path')
const app = express()

// cargar rutas

const user_routes = require('./routes/usuario')
const category_routes = require('./routes/categoria')
const login_routes = require('./routes/login')
const product_routes = require('./routes/producto')

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}))
// Parse application/json (de bson a json)
app.use(express.json())

// Habilitar carpeta Public
app.use(express.static(path.resolve(__dirname, '../public')))

// Cors
app.use((req, res, next) =>{
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')

  next()
})

// Rutas
app.use('/api', user_routes)
app.use('/api', category_routes)
app.use('/api', login_routes)
app.use('/api', product_routes)

module.exports = app