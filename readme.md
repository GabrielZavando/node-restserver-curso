
## Requerir paquetes - require

Node trae una serie de paquetes pré instalados que se almacenan en la carpeta node_modules

Podemos usar require('') para incorporar en un archivo algún modulo propio de node, un paquete externo o un archivo o función creado por nosotros mismo en el mismo proyecto pero en otra carpeta.

## module

module es un objeto global (disponible en toda la aplicación).
module tiene una clave exports que recibe objetos que podrás así ser trabajados de forma global

## Recibir información desde consola (terminal)

Ya vimos que al momento de estar ejecutando nuestra aplicación, node corre varios objetos. Vimos el objeto module

Node también tiene corriendo al objeto process el cual muestra informacion sobre el sistema operativo, el usuario que lo está corriendo, etc.

Dentro de procces existe otro objeto llamado argv. Este objeto guarda, por defecto, un array con dos strings. En uno está la dirección en donde está node dentro de nuestra máquina(también conocido como path) y en el otro, la dirección o path en donde corre el archivo que llamó a dicho objeto.

Lo que queremos es recibir un valor que lancemos por consola
EJ node app --base=5

Si lanzamos eso por consola, veremos que '--base=5' se añadió al array de strings que guarda argv en la tercera posición.

Con esto, podemos capturar un valor, pero tenemos el problema de que no podremos saber, a priori, la posición en la que se lanzará el valor que necesitamos capturar.

Para ello, existen paquetes en npm que nos ayudan a resolver este problema y, además, nos ayudan a generar una documentación para nuestra aplicación.

### Iniciando un proyecto con node

lanzamos el comando npm init, con el creamos un archivo llamado package.json, que es el archivo de configuración de nuestro proyecto
Almacena la información de las dependencias y dependencias de desarrollo que nuestra aplicación necesita

## Instalando yargs

yargs es una librería que se instala como dependencia

se instala con npm i yargs --save

## instalando nodemon en el proyecto

nodemon se instala como librería de desarrollo

se instala con npm i nodemon --save-dev

Si lo tengo instalado de manera global, no es necesario instalarlo en cada proyecto

## Desinstalar un paquete

npm uninstall nombrepaquete

## Usando yargs

Nos sirve para crear una serie de comandos que podemos lanzar por consola. Trabaja manipulando el objeto argv

yargs tiene el command que sirve para añadir una linea de comando para usar por consola. Recibe tres parametros.

1° Un string con el nombre del comando
2° Un string con la descripción del comando
3° Un objeto con los parametros o flags que el comando puede recibir. A su vez, cada parametro es un objeto con pares clave valor que permiten establecer si serán obligatorios (demand), establecer alias (alias), establecer valores por defectos (default)

Con yargs no importa la posición en el array del argv en el que se ingrese el parametro, mientras aparezca la bandera o el alias de la bandera adecuada, lo podremos recibir.

ej:
node app listar --limite=20 --base 50

Yargs también tiene el metodo help. Basta declararlo en la construcción de nuestros comandos para que, al lanzar el comando node archivo comando --help, nos muestre lo que hace nuestra aplicacion cuando lanzamos el comando x

EJ

node app listar --help
o
node app --help

Los comandos con yargs quedan almacenados en un array de strings con el nombre _ (Si, un guión bajo)
Ahora, como normalmente vamos a lanzar un comando seguido se sus banderas, podemos capturar ese comando en la posición 0 del array

Podemos crear varios comandos y, si varios comandos reciben los mismos parámetros o flags, podemos meter esas flags en una constante.

En mi caso cree todo en un archivo aparte dentro de la carpeta config

Otra caracteristica interesante de yargs es que con el podemos capturar valores de algún parametro sin que estén asociados a un comando.

EJ. Para la app del clima

node app -d "Santiago de Chile" // comillas solo si es más de una palabra

Acá no hay ningún comando, pero si el parametro -d y el valor Santiago de Chile

Para ello, existe una función del yargs que es options()

Options recibe un objeto {} con los parametros cuyos valores se desean capturar

## Cambiar colores de la consola

instalamos el paquete colors

npm i colors --save

## File system

File System es un modulo de Node que permite generar un archivo, verificar si existe un archivo, borrar un archivo.

EJ: La función writeFile recibe tres parametros.
1° La url en donde guardaremos la información, incluido el nombre del archivo
2° La data que guardaremos
3° Un callback con un error por si ocurre dicho error

fs.writeFile('db/data.json', data, (err) => {
    if (err) throw new Error('No se pudo grabar', err)
  })

## Axios

Axios es una librería que nos permite hacer peticiones http y que trabaja en base a promesas

Para configurar los headers de la peticion (get, put, post, delete) axios tiene un método llamado create()

Create recibe como parametro, un objeto que contiene al menos dos claves. 

baseURL, que recibe como valor la url a la que se hará la petición.

headers, que recibe un objeto con los headers necesarios para realizar la peticion.

también puede recibir la clave timeout, para limitar el tiempo de espera de la respuesta, lo que arrojaría un error en caso de no cumplirse.

Lo que hicimos fue meter esa configuración del método create en una variable (instance) que será la que ejecutaremos cada vez que necesitemos hacer una petición específica.

## HTTP

Es un paquete de node que nos permite crear un servidor web (webserver)

Tiene la función createServer la cual recibe la función que despliega una res y que puede también recibir request.

Puede desplegar, páginas web, servicios en formato json

## EXPRESS

Es un paquete externo que permite crear un servidor web pero de manera mucho más elegante. También podemos servir web o servicios json

## Servir contenido estático

Dentro de la aplicación puedo tener una carpeta que por convención se llama public y que contiene los archivos estáticos que queremos mostrar (páginas web, archivos de imágenes, videos, archivos json, etc)

## Middleware

Es una instrucción callback que se podemos ejecutar siempre, no importando cual sea la ruta que el cliente solicite

Por ejemplo

app.use(express.static())

## Servir contenido dinámico
## Handlebars

Express nos permite trabajar con otras librerías, entre ellas, handlebars.
Handlebars es similar a pug, vale decir, es un motor de plantillas que optimiza la construcción de archivos html

Lo podemos instalar en nuestro proyecto con el comando

npm i hbs

Para decirle a express que utilice hbs como motor de plantillas para renderizar las páginas hacemos lo siguiente

EJ:
app.set('view engine', 'hbs')

Al utilizar un motor de plantillas, podemos renderizar directamente los archivos hbs que tenemos en la carpeta views

Para eso existe la función render

render() recibe al menos un parametro, que es el nombre de la plantilla hbs que debe renderizar. También puede recibir un objeto con las variables que usa esa plantilla

## Usando parciales con HBS

Un partial es un bloque de codigo html que podemos reutilizar
Los podemos dejar todos en una carpeta, los declaramos en nuestro hbs como está en el archivo server y luego lo podemos usar en las plantillas con la siguinete sintaxis

{{> navbar}}  // navbar es el nombre del partial

## Nodemon vigile archivos con otras extensiones

Podemos lanzar el comando nodemon server -e js,hbs,html,css

O crearlo como comando en el package.json

## Usando helpers

Un helper es una función de hbs que se dispara cuando la plantilla lo requiere y nos sirve para cargar contenido en variables que se usen en varias plantillas

Se registran con el método registerHelper() y recibe un string con el nombre del helper y una función callback que retorna el valor de dicho helper

## Heroku

Subir nuestra app a producción

Heroku es un servicio que nos permite alojar, gratuitamente, hasta 5 aplicaciones

1° Creamos una cuenta
2° Creamos un proyecto
3° Usamos el cli de heroku (hay que descargarlo si no lo tenemos)
3.1 lanzamos comando heroku login
3.2 lanzamos el comando heroku git:remote -a zavando-webpage
3.3 lanzamos el comando git push heroku master
3.4 heroku open

Heroku ocupa el comando start de nuestro package.json para iniciar nuestra app

Trabaja en base a GIT, por lo tanto debemos inicializar GIT en nuestro proyecto

## Peticiones HTTP

GET - PUT - POST - DELETE

## Body parser

Es un paquete externo que sirve para obtener información que recibimos por post, transformada en un objeto json

npm i body-parser

Los aplicamos como middlewares

Cada vez que usemos la función app.use() es que estamos insertando un middleware

## Respuestas con status code

Ej
res.status(200).json({
  ok: false,
  mensaje: 'El nombre es necesario'
})

## Mongoose

Paquete de terceros para crear esquemas de bases de datos y conexión a base de datos mongodb

npm i mongoose

mongoose tiene el metodo connect() que recibe un string con la url + nombre de la base de datos y una funcion callback

## Modelos

Un modelo es un objeto de mongoose sobre el cual se trabajan los datos de, por ejemplo, un Usuario. En ese objeto tenemos un modelo de la colección de Usuario (los datos de cada usuario)

## Mongoose unique validator

Es un paquete externo que nos ayuda a validar si existe o no un campo x con un valor x en una base de datos x.

## Bcrypt

npm i bcrypt

Bcrypt es un paquete externo que nos ayuda en la encriptación de contraseñas

bcrypt tiene un metodo llamado hashSync() que nos devuele, de manetra sincrona, un hash con el resultado de los valores que le pasemos como parametro.
Recibe, por ejemplo, la contraseña y luego las veces que encripta dicha contraseña

## Underscore

npm i underscore

Es un paquete externo que añade funcionalidades a js

Dentro de las cientos de funciones que extiende, existe una para trabajar con objetos que se llama pick

pick() regresa una copia del objeto filtrando sólo los valores que quiero

## Paginacion

La request (petición) tiene dentro del objeto req (o como sea que lo recibamos en nuestra función, aunque por convención se usa req), un objeto query

Podemos construir desde el front una petición que añada en el objeto query una clave llamada desde (por ejemplo) con el valor X.
Asi mísmo, podemos añadir una clave hasta (por ejemplo) con otro valor x.

Para capturar dichos valores y usarlos en las busquedas a la base de datos

Ahora, en la construcción de la petición por url, se escribe

/usuarios?desde=10

En donde usuarios, es la url de la petición
?, quiere decir, parámetro opcional
desde, es el nombre del parametro
=, para asignarle un valor al parametro
10, valor del parametro desde.

Para añadir otro parámetro por url (sólo puede ir un parámetro opcional y va al principio)

/usuarios?desde=10&limite=10

Otro dato importante de envíar para ser usado en frontend, es la cantidad total de registros de una coleccion

## Filtrando los campos de los resultados de un GET

Es tan simple como pasar, como segundo parametro en la función, find() un string con las claves que queremos enviar en nuetra res.

Por ejemplo find({}, 'nombre email') 

Y nos devolverá el id (que siempre lo envía y es bueno que así sea), el nomre y el email

## Borrando un documento de la base de datos

Podemos pasar el id tanto por el body de la petición como por parametro en la url

Por url, eje

/usuario/kahahaghansvg // id

## Cambiar estado (en lugar de borrar)

Lo ideal es nunca borrar datos de una base de datos, entonces, para evitar hacer eso, se crea en el modelo un campo estado y ese campo almacena un boolean

## Mongo db en la nube

MongoDB Atlas ex, MLab

Ya tengo cuenta en MongoDB Atlas
1 Cluster gratuito con 512megas

1° Creamos un nuevo cluster
2° Seleccionamos AWS o GCP
3° Seleccionamos lugar de almacenamiento (Sao Paulo) que tenga opción gratuita y esté cerca de donde estamos
4° Añadimos en network access las ip que podrán hacer peticiones.
Primero añadimos que sea de cualquier ip, luego lo editaremos
5° Vamos Database Access y creamos un usuario de base de datos con todos los permisos
6° Vamos a la pestaña cluster y luego pinchamos en collections
7° Luego creamos nuestra propia base de datos clickeando en Add my own data
8° Estando en la pestaña cluster, hacemos click en connect y seleccionamos conneect using MongoDB Compass
9° Instalamos (si no lo tenemos) MongoDB Compass y lo abrimos
10° Para conectarnos MongoDB nos da una url que usaremos en MongoDB Compass. Necesitaremos el nombre de usuario de la base de datos y el la contraseña de dicho usuario + el nombre de la base de datos a la que nos queremos conectar. Eso es todo

## Variables de entorno personalizadas en Heroku

En la raíz del proyecto, lanzamos por consola el comando

heroku config // Muestra variables de entorno
heroku config:set nombre="Gabriel" // crea nombre: Gabriel como variable de entorno

heroku config:get nombre // Para obtener el valor de la variable de entorno nombre

heroku config:unset nombre // Para borrar nombre de las variables de entorno

## Introducción a los Tokens

Trabajamos con jsonwebtoken

npm i jsonwebtoken

Generamos un token y lo enviamos al frontend cuando un usuario se logea correctamente

jwt tiene genera un token con el método sign() el cual recibe, como parametro, un objeto con el payload (información del modelo de usaurio, por ejemplo, que queremos usar), un seed o secret que es un string secreto que sirve para verificar si el token es de nuestra app y otro objeto con la clave expiresIn más un valor numerico que equivale al tiempo de duración del token

## Proteger rutas mediante uso de Token - Middlewares

Un token se puede recibir mediante url, pero también se puede recibir en los headers de la solicitud

Normalmente se recibe con el nombre de token o Authorization y, en el backend se pasa como middleware.

Cuando necesitamos pasar más de un middleware, los pasamos dentro de un array []

## Variables de entorno automáticas - Postman

En la pestaña test podemos capturar y setear valores

con la funcion pm.environment.set('algo', 'valor de algo') puedo setear una variable y su valor

Lo que se envía en la petición está en pm.response.json()

El token está entonces en pm.response.json().token

Con esa información, podemos creaer una variable que se actualiza dinámicamente