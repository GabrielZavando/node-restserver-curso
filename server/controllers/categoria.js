
// Controlador de categoria

// por convención se usa un guion bajo para underscore
const _ = require('underscore')
// Modelo de categoria
const Categoria = require('../models/categoria')

// Crear una nueva categoria
function createCategory(req, res){
  // regresa la nueva categoría y el id del usuario que lo creó
  // req.usuario._id

  let body = req.body

  // Creamos una instancia del modelo de Categoria y le asignamos los valores que llegan por post en el body
  let categoria = new Categoria({
    descripcion : body.descripcion,
    // Obtenemos el id del usuario que viene en el token
    usuario: req.usuario._id
  })

  // Usamos el método save de mongoose para guardar la categoria en la base de datos
  categoria.save((err, categoriaDB)=>{
     if(err){
       return res.status(400).json({
         ok: false,
         err
       })
     }

     res.json({
       ok: true,
       categoria: categoriaDB
     })
  })
}

// Editar una categoria
function editCategory(req, res){
  let id = req.params.id
  let body = req.body

  // objeto con lo que queremos editar
  let descCategoria = {
    descripcion: body.descripcion
  }

  Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true, context: 'query'}, (err, categoriaDB)=>{
    if (err){
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if(!categoriaDB){
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    })

  })
}

// Elimina una categoria
function deleteCategory(req, res){
  // para capturar id de la categoria a eliminar
  let id = req.params.id
  // Solo un administrador puede borrar categorias
  Categoria.findByIdAndRemove(id, (err, categoriaBorrada)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if(!categoriaBorrada){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Categoria no existe'
        }
      })
    }

    res.json({
      ok: true,
      message: 'Categoria eliminada'
    })

  })
}

// Muestra una categoria por su ID
function getCategory(req, res){
  let id = req.params.id

  Categoria.findById(id)
              .populate('usuario', 'nombre email')
              .exec((err, categoriaDB) =>{
                if(err){
                  return res.status(500).json({
                    ok: false,
                    err
                  })
                }
                if(!categoriaDB){
                  return res.status(400).json({
                    ok: false,
                    err: {
                      message: 'Categoría no encontrada'
                    }
                  })
                }
            
                res.json({
                  ok: true,
                  categoria: categoriaDB
                })
              })

}

// Listar categorias
function getCategories(req, res){
  let consulta = {}

  Categoria.find(consulta)
              .sort('descripcion')
              .populate('usuario', 'nombre email')
              // Ejecuta la búsqueda (exec devuelve una promesa)
              .exec((err, categorias) => {
                if(err){
                  return res.status(500).json({
                    ok: false,
                    err
                  })
                }

                if(!categorias.length){
                  return res.status(400).json({
                    ok: false,
                    message: 'No existen registros para esta consulta'
                  })
                }

                // Para contar los registros totales. Tanto en find como en count debe aparaecer el mismo objeto con las mismas claves y valores, ejemplo 
                Categoria.countDocuments(consulta, (err, total) => {
                  res.json({
                    ok: true,
                    categorias,
                    total
                  })
                })
                // Fin de exec
              })
}


module.exports = {
  createCategory,
  editCategory,
  deleteCategory,
  getCategory,
  getCategories
}