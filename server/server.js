
require('./config/config.js')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// Parse application/json
app.use(bodyParser.json())

app.get('/usuario', (req, res) => {
  res.json('get Usuario')
})

app.post('/usuario', (req, res) => {
  let body = req.body

  if (body.nombre === undefined || body.nombre === ""){
    res.status(400).json({
      ok: false,
      mensaje: 'El nombre es necesario'
    })
  }else{
    res.json(body)
  }
})

app.put('/usuario/:id', (req, res) => {
  let id = req.params.id
  res.json({
    id
  })
})

app.delete('/usuario', (req, res) => {
  res.json('delete Usuario')
})

app.listen(process.env.PORT, () => {
  console.log(`Escuchando en el puerto ${process.env.PORT}`)
})