// Configuraciones globales

// Puerto
process.env.PORT = process.env.PORT || 3000

// Entorno
// Si esta variable no existe, entonces estoy en desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// Base de datos

let urlDB 

if (process.env.NODE_ENV === 'dev'){
  // Base de datos local
  urlDB = 'mongodb://localhost:27017/cafe'
}else{
  // Base de datos Mongo Atlas
  urlDB = process.env.MONGO_URI
}

// Creamos URLDB como parte de nuestro process.env
process.env.URLDB = urlDB