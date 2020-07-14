
// Creación y manejo del modelo de Categoría

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// Para evitar que pasen categorías no validas. Además, nos da la misma estructura de error que los otros manejos

// let rolesValidos = {
//   values: ['versiaceptaRegExp'],
//   message: '{VALUE} no es un rol válido'
// }

// Esquema básico de mongoose para crear distintos modelos
let Schema = mongoose.Schema

let categoriaSchema = new Schema({
  descripcion: {
    type: String,
    unique: true,
    required: [true, 'La descripción es obligatoria']
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }
})

// Todos los campos que tengan unique true pasan por este plugin y lanza un mensaje en donde {PATH} es sólo descripcion en este caso.
// Con esto, la estructura json de los mensajes de error son iguales a que si faltara un campo obligatorio, con lo cual podemos trabajar errores de manera uniforme
categoriaSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser única'
})

// Lo exporto con el nombre de Categoria y con las claves y valores definidos en categoriaSchema
module.exports = mongoose.model('Categoria', categoriaSchema)