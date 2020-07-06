
// Creación y manejo del modelo usuario

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// Para evitar que pasen roles no validos. También nos da la misma estructura de error que los otros manejos
let rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol válido'
}

// Esquema básico de mongoose para crear distitos modelos
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es necesario']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El email es necesario']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
})

// Para crear un objeto sin el password y asi evitar devolver ese campo en las respuestas
usuarioSchema.methods.toJSON = function(){
  let user = this
  let userObject = user.toObject()
  // Borramos el campo password del nuevo objeto de usuario
  delete userObject.password
  
  // devolvemos un usuario sin el campo password
  return userObject
}

// Todos los campos que tengan unique true pasan por este plugin y lanza un mensaje en donde {PATH} puede ser email, nombre o rut, si esos campos tienen unique: true dentro de su objeto.
// Con esto, la estructura json de los mensajes de error son iguales a que si faltara un campo obligatorio, con lo cual podemos trabajar errores de manera uniforme
usuarioSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser único'
})

// Lo exporto con el nombre de Usuario y con los valores definidos en usuarioSchema
module.exports = mongoose.model('Usuario', usuarioSchema)