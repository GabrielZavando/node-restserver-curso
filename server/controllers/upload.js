// Controlador de cargas de archivo

const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')

// Cargar archivos de usuario o productos
function upLoadArchive(req, res){
  // Si no hay archivos
  if(!req.files || Object.keys(req.files).length === 0){
    return res.status(400).json({
      ok: false,
      message: 'Debe subir un archivo'
    })
  }

  // archivo para tipo usuario o para tipo producto
  let tipo = req.params.tipo
  // id de usuario o de producto
  let id = req.params.id

  // Establecer tipo validos
  let tiposValidos = ['productos','usuarios']

  // Validar tipo
  if(tiposValidos.indexOf(tipo) < 0){
    return res.status(400).json({
      ok: false,
      err: {
        message: `Los tipos válidos son ${tiposValidos.join(' y ')}`,
        ext: tipo
      }
    })
  }

  // Recibir archivo archivo
  let archivo = req.files.archivo
  // Restringir extensiones
  let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

  // Obtenemos la extensión del archivo separando el nombre por el punto . con la función nativa de js split que nos devuelve un array con tantos string como lo determine la cantidad de puntos que hay en el nombre del archivo
  let nombreCortado = archivo.name.split('.')
  // para obtener la extensión pasamos la posición que almacena la extensión. Eso lo calculamos con el largo del array -1
  let extension = nombreCortado[nombreCortado.length -1]
  
  // Recorremos el array de extensionesValidas y vemos si hay un índice que coincida con la extensión. Si no hay coincidencias, el archivo no es válido
  if(extensionesValidas.indexOf(extension) < 0){
    return res.status(400).json({
      ok: false,
      err: {
        message: `Los archivos permitidos son ${extensionesValidas.join(', ')}`,
        ext: extension
      }
    })
  }

  // Cambiar nombre al archivo (para que sea único)
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

  // Mover archivo a carpeta usuarios o productos segun su tipo
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
    if(err){
      res.status(500).json({
        ok: false,
        err
      })
    }

    // En este punto el archivo ya fue subido
    
    // Asignarlo a quien corresponda
    if(tipo === 'usuarios'){
      // Asignar archivo a un usuario
      imagenUsuario(id, res, nombreArchivo)
    }else{
      // Asignar archivo a un producto
      imagenProducto(id, res, nombreArchivo)
    }
    
    // Fin de mv
  })
}

function imagenUsuario(id, res, nombreArchivo){
  Usuario.findById(id, (err, usuarioDB)=>{
    if(err){
      // Borramos la imagen subida
      borrarArchivo(nombreArchivo, 'usuarios')
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if(!usuarioDB){
      // Acá deberiamos borrar la imagen porque si no existe un usuario no tiene sentido guardar la imagen
      borrarArchivo(nombreArchivo, 'usuarios')
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no existe'
        }
      })
    }

    // En caso de ya existir una imagen para el usuario, la borramos
    borrarArchivo(usuarioDB.img, 'usuarios')

    // asignamos a la clave del usuario que almacena la imagen, el nombre del archivo
    usuarioDB.img = nombreArchivo
    // Guardamos ese cambio en la base de datos
    usuarioDB.save((err, usuarioGuardado) =>{
      res.json({
        ok: true,
        usuario: usuarioGuardado
      })
    })

    // fin del findById
  })
}

function imagenProducto(id, res, nombreArchivo){
  Producto.findById(id, (err, productoDB)=>{
    if(err){
      // Borramos la imagen subida
      borrarArchivo(nombreArchivo, 'productos')
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if(!productoDB){
      // Acá deberiamos borrar la imagen porque si no existe un usuario no tiene sentido guardar la imagen
      borrarArchivo(nombreArchivo, 'productos')
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Producto no existe'
        }
      })
    }

    // En caso de ya existir una imagen para el producto, la borramos
    borrarArchivo(productoDB.img, 'productos')

    // De no existir una imagen, asignamos a la clave del usuario que almacena la imagen, el nombre del archivo
    productoDB.img = nombreArchivo

    // Guardamos ese cambio en la base de datos
    productoDB.save((err, productoGuardado) =>{
      res.json({
        ok: true,
        producto: productoGuardado
      })
    })

    // Fin de findById
  })
}

function borrarArchivo(nombreArchivo, tipo){
  // Ubicación del archivo de imagen que podría tener el usuario al que le estamos asignando una nueva (o primera) imagen
  let pathArchivo = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`)

  // Comprobamos si existe la imagen en esa ubicación
  // existsSync nos devuelve un booleano
  if(fs.existsSync(pathArchivo)){
    // si existe, entonces la borramos
    fs.unlinkSync(pathArchivo)
  }
}

module.exports = {
  upLoadArchive
}