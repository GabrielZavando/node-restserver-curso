
// Controlador de login y registro de usuario

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)
const Usuario = require('../models/usuario')

// Configuracion de Google
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID
  });
  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
  
}

// Login tradicional
function login(req, res){
  let body = req.body

  Usuario.findOne({email: body.email}, (err, usuarioDB) => {
    
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if(!usuarioDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: '(Usuario) o contraseña incorrectos'
        }
      })
    }

    if (!bcrypt.compareSync(body.password, usuarioDB.password)){
      
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o (contraseña) incorrectos'
        }
      })
    }

    let token = jwt.sign({
      usuario: usuarioDB
    }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN}) // una hora

    res.json({
      ok: true,
      usuario: usuarioDB,
      token
    })

  })
}

// Login o registro con Google
async function loginGoogle(req, res){
  let token = req.body.idtoken

  let googleUser = await verify(token)
          .catch( err => {
            return res.status(403).json({
              ok: false,
              err
            })
          })
  // Verificamos que no exista ya el usuario
  Usuario.findOne({email: googleUser.email}, (err, usuarioDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }

    // Si existe el usuario con ese email validamos dos posibilidades
    if(usuarioDB){
      // Si existe pero no se registró mediante google sign, sólo ocupó el correo
      if(usuarioDB.google === false){
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Debe usar su autenticación normal'
          }
        })
      }else{ //Si existe y se regsitro con google sign (renovamos su token)
        let token = jwt.sign({
          usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})

        return res.json({
          ok: true,
          usuario: usuarioDB,
          token
        })
      }
    }else{
      // Si el usuario no existe. Creamos el nuevo usuario
      let usuario = new Usuario()

      usuario.nombre = googleUser.nombre
      usuario.email = googleUser.email
      usuario.img = googleUser.img
      usuario.google = true
      usuario.password = ':)' // Sólo porque es obligatorio en el modelo de la base de datos, pero ese ':)' no es funcional

      // Guardamos el nuevo usuario en base de datos

      usuario.save((err, usuarioDB) => {
        if(err){
          return res.status(500).json({
            ok: false,
            err
          })
        }

        let token = jwt.sign({
          usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})

        return res.json({
          ok: true,
          usuario: usuarioDB,
          token
        })

      })
    }
  })
}

module.exports = {
  login,
  loginGoogle
}