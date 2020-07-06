
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
// Por convención se usa un guion bajo para underscore
const _ = require('underscore')
// Importamos el modelo
const Usuario = require('../models/usuario')

// DEvuelve lista de usuarios activos páginado
app.get('/usuarios', (req, res) => {
  // Capturamos el valor de desde, si no existe, asumimos que es cero
  let desde = req.query.desde || 0
  // Pasamos desde de string a número
  desde = Number(desde)
  
  let limite = req.query.limite || 5
  limite = Number(limite)
  // Construye la busqueda en la base de datos
  // let consulta = {google: true}
  let consulta = {estado: true}

  Usuario.find(consulta, 'nombre email')
          // Salta registros, 5 en este caso
          .skip(desde)
          // Limita la búsqueda, a 5 en este caso
          .limit(limite)
          // Executa la búsqueda (exec devuelve una promesa)
          .exec((err, usuarios) => {
            if (err){
              return res.status(400).json({
                ok: false,
                err
              })
            }

            if(usuarios.length <= 0){
              return res.status(400).json({
                ok: false,
                message: 'No existen registros para esta consulta'
              })
            }

            // Para contar los registros totales. Tanto en find como en count debe aparaecer el mismo objeto con las mismas claves y valores, ejemplo 
            Usuario.countDocuments(consulta, (err, total) => {
              res.json({
                ok: true,
                usuarios,
                total
              })
            })

          })
})

// Para crear un usuario
app.post('/usuario', (req, res) => {
  let body = req.body

  // Creamos una instancia del modelo Usuario y le asignamos los valores que llegán por post en el body
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  })

  // Usamos el metodo save de mongoose para guardar el usuario creado, en la base de datos

  usuario.save((err, usuarioDB) => {

    if (err){
      return res.status(400).json({
        ok: false,
        err
      })
    }

    // El status 200 no se necesita poner porque va implicito cuando todo va bien
    res.json({
      ok: true,
      usuario: usuarioDB
    })
  })
})

// Para editar un usuario
app.put('/usuario/:id', (req, res) => {
  let id = req.params.id
  // Pasamos por pick el objeto y un array con todos los campos que si se pueden actualizar
  let body = _.pick(req.body, ['nombre','email','img','role','estado'])

  // En base al modelo de usuario hacemos una busqueda por id.
  // la funcion findByIdAndUpdate de mongoose recibe, el id consultad, el objeto que se debe actualizar, options (ver libreria) y una función callback que devuelve o un error o el usuario que encontró.

  Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {

    if (err){
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    })
  })
})

app.delete('/usuario/:id', (req, res) => {
  let id = req.params.id

  // Para borrarlo de la base de datos
  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) =>{
  
  // Para pasar el estado a false en lugar de borrar
  Usuario.findByIdAndUpdate(id, {estado: false}, {new: true}, (err, usuarioBorrado) =>{
    
    if(err){
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if(!usuarioBorrado){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        }
      })
    }

    res.json({
      ok: true,
      usuario: usuarioBorrado
    })
  })
})

module.exports = app