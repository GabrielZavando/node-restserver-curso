
// Controlador de productos

// Modelo de productos
const Producto = require('../models/producto')

// Buscar Producto
function searchProduct(req, res){
  let termino = req.params.termino
  // transformamos el termino en expresion regular
  // 'i' es para que sea insensible a mayúsculas y minusculas
  let regex = new RegExp(termino, 'i')

  let consulta = {nombre: regex, disponible: true}

  Producto.find(consulta)
            .populate('categoria', 'descripcion')
            .exec((err, productos)=>{
              if(err){
                return res.status(500).json({
                  ok: false,
                  err
                })
              }

              if(!productos){
                return res.status(400).json({
                  ok: false,
                  err: {
                    message: 'No existen coincidencia para tu búsqueda'
                  }
                })
              }

              res.json({
                ok: true,
                productos
              })

              // fin del exec
            })
}

// Crear un producto
function createProduct(req, res){
  let body = req.body
  let producto = new Producto({
    usuario: req.usuario._id,
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria
  })

  producto.save((err, productoDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }

    res.status(201).json({
      ok: true,
      producto: productoDB
    })
  })
}

// Editar un producto
function editProduct(req, res){
  let id = req.params.id
  let body = req.body

  Producto.findById(id, (err, productoDB)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if(!productoDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID no existe'
        }
      })
    }

    // Editamos los campos del producto
    productoDB.nombre = body.nombre
    productoDB.precioUni = body.precioUni
    productoDB.categoria = body.categoria
    productoDB.disponible = body.disponible
    productoDB.descripcion = body.descripcion

    // Lo almacenamos en base de datos
    productoDB.save((err, productoEdit)=>{
      if(err){
        return res.status(500).json({
          ok: false,
          err
        })
      }
      
      res.json({
        ok: true,
        producto: productoEdit
      })

    })

    
  })
}

// Borrar un producto
function deleteProduct(req, res){
  let id = req.params.id

  Producto.findById(id, (err, productoDB)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if(!productoDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El producto que se desea eliminar, no existe'
        }
      })
    }

    productoDB.disponible = false

    productoDB.save((err, productoBorrado)=>{
      if(err){
        return res.status(500).json({
          ok: false,
          err
        })
      }

      res.json({
        ok: true,
        producto: productoBorrado,
        message: 'Producto eliminado'
      })


      // Fin del save
    })

    // Fin del findById
  })
}

// Muestra un producto por su ID
function getProduct(req, res){
  let id = req.params.id

  Producto.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productoDB) => {
              if(err){
                return res.status(500).json({
                  ok: false,
                  err
                })
              }

              if(!productoDB){
                return res.status(400).json({
                  ok: false,
                  err: {
                    message: 'El producto consultado no existe'
                  }
                })
              }

              res.json({
                ok: true,
                producto: productoDB
              })

              // Fin del exec
            })
}

// Mostrar lista de productos paginados
function getProducts(req, res){
  // populate: usuario categoria
  // Paginado
  let desde = req.query.desde || 0
  desde = Number(desde)

  let consulta = {disponible: true}

  Producto.find(consulta)
          .skip(desde)
          .limit(5)
          .populate('usuario', 'nombre email')
          .populate('categoria', 'descripcion')
          .exec((err, productos) => {
            if(err){
              return res.status(500).json({
                ok: false,
                err
              })
            }

            if(!productos){
              return res.status(400).json({
                ok: false,
                message: 'No existen registros para esta consulta'
              })
            }

            Producto.countDocuments(consulta, (err, total) =>{
              res.json({
                ok: true,
                productos,
                total
              })
            })
            
            // Fin del exec
          })
}

module.exports = {
  createProduct,
  editProduct,
  deleteProduct,
  getProduct,
  getProducts,
  searchProduct
}