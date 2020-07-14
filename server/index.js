
// Archivo que conecta con la base de datos y levanta el servidor
require('./config/config.js')

const mongoose = require('mongoose')
const app = require('./app')

// Seteamos 'useFindAndModify', false para poder usar algunos métodos, entre ellos findByIdAndRemove()
mongoose.set('useFindAndModify', false)

// Conexión a base de datos
// Aún si no hemos creado la base de datos cafe, se realiza la conexión y se crea cuando insertamos datos
mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, autoIndex: false })
          .then(() =>{
            console.log('La conexión a la base de datos se ha realizado correctamente')

            // Levantamos el servidor
            app.listen(process.env.PORT, ()=>{
              console.log(`Escuchando en el puerto ${process.env.PORT}`)
            })
          })
          .catch(err => console.log(err))

