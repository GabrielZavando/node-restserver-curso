
// Verificar Token
const jwt = require('jsonwebtoken')

let verificaToken = (req, res, next) => {
  // Para leer el token del header

  let token = req.get('token')

  jwt.verify(token, process.env.SEED, (err, decoded) =>{
    if (err){
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Token no válido'
        }
      })
    }
     // Para devolver los datos del usuario si está verificado el token
    req.usuario = decoded.usuario
    next()
  })

}

let verificaAdminRole = (req, res, next) => {
  let usuario = req.usuario

  if(usuario.role === 'ADMIN_ROLE'){
    next()
  }else{
    return res.status(401).json({
      ok: false,
      err: {
        message: 'El usuario no es Administrador'
      }
    })
  }
}

// Verifica token por url
let verificaTokenImg = (req, res, next) => {
  let token = req.query.token

  jwt.verify(token, process.env.SEED, (err, decoded) =>{
    if (err){
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Token no válido'
        }
      })
    }
     // Para devolver los datos del usuario si está verificado el token
    req.usuario = decoded.usuario
    next()
  })
}

module.exports = {
  verificaToken,
  verificaAdminRole,
  verificaTokenImg
}