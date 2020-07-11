
require('./config/config.js')

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// Parse application/json
app.use(bodyParser.json())

// Habilitar carpeta Public
app.use(express.static(path.resolve(__dirname, '../public')))

// Importamos las rutas
app.use(require('./routes/usuario'))
app.use(require('./routes/login'))

// Seteamos 'useFindAndModify', false para poder usar algunos métodos, entre ellos findByIdAndRemove()
mongoose.set('useFindAndModify', false)

// Conexión a base de datos
// Aún si no hemos creado la base de datos cafe, se realiza la conexión y se crea cuando insertamos datos
mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {
  if (err) throw err

  console.log('Base de datos online')
})

app.listen(process.env.PORT, () => {
  console.log(`Escuchando en el puerto ${process.env.PORT}`)
})