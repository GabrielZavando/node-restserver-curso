// Controlador para el servicio de imagenes

const fs = require('fs')
const path = require('path')

// Mostrar imagen segun tipo
function getImages(req, res){
  let tipo = req.params.tipo
  let img = req.params.img
  
  // Path de la imagen que debería existir
  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)

  // Evaluamos si existe la imagen
  if(fs.existsSync(pathImagen)){
    // Si existe, la enviamos en la res
    res.sendFile(pathImagen)
  }else{
    // Si no existe tomamos una imagen por default y la enviamos
    let noImagePath = path.resolve(__dirname, '../assets/img/no-image.jpg')

    res.sendFile(noImagePath)
    
  }


}

module.exports = {
  getImages
}