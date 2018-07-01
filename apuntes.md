# PASOS:

- Creamos el package.json

```npm init```


- Instalar express: Framework de nodeJs para facilitar la comunicación con el servidor por http.

```npm install express --save```

- Crear un fichero index.js que será el punto de entrada de la aplicación. Para arrancar la aplicación:

```node index```
```javascript
'use strict'

const express = require ('express');
const bodyParser = require ('body-parser');

const app = express();
const port = process.env.PORT || 3000; // El puerto puede ser una
                                      // variable de entorno o el 3000
/** Arrancar el server
  */
app.listen(port, () => {
  console.log(`API REST corriendo en http://localhost:${port}`);
})
```

- Instalamos la librería [body-parser](https://www.npmjs.com/package/body-parser), que nos permitirá hacer peticiones post poder parsear el cuerpo de la petición y recogerlos.

   ``` npm i -S body-parser ```

- Importarla en el index.js, funciona como un midelware, una capa que se va añadiendo.

```javascript
'use strict'

const express = require ('express');
const bodyParser = require ('body-parser');

const app = express();
const port = process.env.PORT || 3000;
/** Arrancar el server
  */
app.listen(port, () => {
  console.log(`API REST corriendo en http://localhost:${port}`);
})

// Utilizar bodyParser:
  * Para utilizar midelwares se llama al método 'use'
  */

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json);

```
- Para no tener que estar parando y arrancando el servidor cada vez que hacemos un cambio para poder verlo podemos instalar, en dependencias de desarrollo, la librería nodemon:
En consola

```
npm install -D nodemon
```



## Peticiones tipo GET

Vamos a añadir a nuestra API REST la posibilidad de escuchar peticiones de tipo GET, o lo que se llama *End Point con GET*.

De esta forma, al poner una ruta en el navegador donde se pase la petición veremos que nos devuelva los datos que deseemos.

- Después de los midelwares, añadimos las peticiones o escuchas que va a tener nuestra API REST:

```javascript
app.get('/hola', (req, res) => {
  res.send({ message: 'hola mundoooor' })
})
```
- Para pasar parámetros en la ruta:

```javascript
app.get('/hola/:name', (req,res) => {
  res.send({ mensaje: `Hola ${req.params.name}!`})
});
```
- Definir rutas para peticiones:

```javascript
app.get('/api/product', (req, res) => {

});

app.get('/api/product/:productId', (req, res) => {

});
// Tipo post
app.post('/api/product', (req, res) => {
// accedemos al cuerpo de la petición, con bodyParser como si fuese un json
/** Forma deprecada:
app.post('/api/product', (req, res) => {
// accedemos al cuerpo de la petición, con bodyParser como si fuese un json
  console.log(req.body);
  res.send(200, {
    message: 'Producto recibido',
  })
});
*/
  console.log(req.body);
  res.status(200).send({
    message: 'Producto recibido',
  })
});

//Tipo PUT
app.put('/api/product/:productId', (req, res) => {

})

// Por ultimo una ruta tipo delete para borrar productos:
app.delete('/api/product/:productId', (req, res) => {

})

```

### Instalar MongoDb por terminal:
```
sudo apt-get install -y mongodb-org

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927

echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

sudo apt-get update

sudo mongod
```
Mongo debe estar corriendo al mismo tiempo que el servidor, para que se pueda hacceder a ella.

- Instalar mongoose: Mongoose es una librería para manejar mongodb.```npm install --save mogoose```


Y de la misma forma se ha de importar dentro de nuestro index.js

### Instalar Compass (gestor visual para mongo)

``` $ wget https://downloads.mongodb.com/compass/mongodb-compass_1.12.5_amd64.deb;

    $ sudo dpkg -i mongodb-compass_1.12.5_amd64.deb;

    $ DEBUG=* mongodb-compass;
```
- Para arrancar compass:
```
$ DEBUG=* mongodb-compass;

```

### Crear un modelo para la base de datos:

Creamos un archivo donde se va a dar un tipo a las características del modelo, este archivo en este caso es product.js:
```javascript
const mongoose = require('mongoose'),
      Schema = mongoose.Schema; // Metodo de mongoose para determinar el tipo de datos del resgistro.

const productSchema = Schema ({
  name: String,
  picture: String,
  price: Number,
  category: {type: String, enum: ['computers', 'phones','accesories']},
  description: String,
})

//Esportamos el esquema del resgistro
/** @param 'Product' es el nombre y luego la definición
  * del modemo que hemos hecho arriba
  */
mongoose.model('Product', productSchema);// con esto hacemos visible nuestro esquema de dato al resto de la aplicación
```
### Peticiones tipo delete
```javascript
// Por ultimo una ruta tipo delete para borrar productos:
app.delete('/api/product/:productId', (req, res) => {
  let productId = req.params.productId;

  Product.findById(productId, (err, product) =>{
    if (!productId)return res.status(404).send({message: 'No puede borrarse un producto que no existe en la base de datos'});
    if (err) return res.status(500).send({message: 'Error al borrar el producto de la base de datos'});

    product.remove(err => {
      if(err) return res.status(500).send({message: 'Error en el proceso de borrado'});

      res.status(200).send({message: 'El producto se ha borrado!'})
    })
  })
})
```

### Peticiones tipo PUT (update):

```javascript
app.put('/api/product/:productId', (req, res) => {
  let productId = req.params.productId;
  let update = req.body;

  Product.findByIdAndUpdate(productId, update, (err, productUpdated) =>{
    if (!productId)return res.status(404).send({message: 'No puede actualizarse un producto que no existe en la base de datos'});
    if (err) return res.status(500).send({message: 'Error al actualizar el producto de la base de datos'});

    res.status(200).send({ product: productUpdated })
  })
})
```
## REFACTORIZAR EL CODIGO:

### Refactorizando las funciones de tratamiento de la BBDD:

- Index inicial puede verse en index_inicial.js.

- Crear una carpeta llamada controllers, donde se van a poner los controladores que gestionan las diferentes formas de acceso a la API:

** En el archivo controllers/product.js:**

```javascript
const Product = require('../models/product'); //Como no es una librería de npm se indica la ruta '../models/product'?

function getProduct (req, res){
  // Buscar en la BBDD un objeto con un id
    let productId = req.params.productId;

    Product.findById(productId, (err, product) => {
      if (err) return res.status(500).send({menssage: 'Error al realizar la petición ${err}'})
      if (!product) return res.status(404).send({message: 'El producto no existe'})

      res.status(200).send({product: product})// puede ponerse: res.status(200).send({product})
    });

};
function getProducts (req, res){
  Product.find({}, (err, products) => {
    if (err) return res.status(500).send({message: 'Error al realizar la petición de todos los productos'});
    if (!products) return res.status(404).send({message: 'No hay productos que mostrar'});

    res.status(200).send({ products: [] });
  })
};
function addProduct (req, res){
  /* accedemos al cuerpo de la petición, con bodyParser como si fuese un json
    console.log(req.body);
    res.status(200).send({
      message: 'Producto recibido',
    })
    */
    console.log('POST /api/product');
    console.log(req.body);

    let product = new Product();
    product.name = req.body.name;
    product.picture = req.body.picture;
    product.price = req.body.price;
    product.category = req.body.category;
    product.description = req.body.description;

    product.save((err, productStored) => {
      if (err){
        res.status(500).send({
          message: 'Error al salvar en la base de datos el producto: ${err}'
        })
      }

      res.status(200).send({
        product: productStored
      })
    })
}
function updateProduct (req, res){
  let productId = req.params.productId;
  let update = req.body;

  Product.findByIdAndUpdate(productId, update, (err, productUpdated) =>{
    if (!productId)return res.status(404).send({message: 'No puede actualizarse un producto que no existe en la base de datos'});
    if (err) return res.status(500).send({message: 'Error al actualizar el producto de la base de datos'});

    res.status(200).send({ product: productUpdated })
  })

};
function deleteProduct (req, res){
  let productId = req.params.productId;

  Product.findById(productId, (err, product) =>{
    if (!productId)return res.status(404).send({message: 'No puede borrarse un producto que no existe en la base de datos'});
    if (err) return res.status(500).send({message: 'Error al borrar el producto de la base de datos'});

    product.remove(err => {
      if(err) return res.status(500).send({message: 'Error en el proceso de borrado'});

      res.status(200).send({message: 'El producto se ha borrado!'})
    })
  })
};

module.exports = {
  getProduct,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
}

```

### Refactorizarndo la llamada a express:

- Se puede modularizar también la conexión a la base de datos

- Crear un archivo app.js, en la carpeta raíz para modularizar lo que es la configuración de express, en este archivo irá todo lo que sea relativo a la configuración de express de index.js.
```javascript
const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      ProductControllers = require('./controllers/product'); //Traemos los controladores de la carpeta controllers

/** Utilizar bodyParser:
* Para utilizar midelwares se llama al método 'use'
*/
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(bodyParser.json());

/** Definir rutas para hacer las Peticiones
*/

app.get('/api/product', ProductControllers.getProducts); // Tomamos el método getProduct del archivo controllers/product.js

app.get('/api/product/:productId', ProductControllers.getProduct);

// Tipo post
app.post('/api/product',ProductControllers.addProduct);

//Tipo PUT: actualizar datos.
app.put('/api/product/:productId', ProductControllers.updateProduct);

// Por ultimo una ruta tipo delete para borrar productos:
app.delete('/api/product/:productId', ProductControllers.deleteProduct);

module.exports = app;
```

- Por último vamos a hacer un archivo router.js que tendrá definidas las rutas de nuestra API. Creamos una carpeta routes, y dentro el archivo index.js, donde copiamos las rutas del archivo app.js para dejarlo de la siguiente forma:

**routes/index.js**
```javascript
const express = require ('express'),
      ProductControllers = require ('../controllers/product'),
      api = express.Router();

api.get('/product', ProductControllers.getProducts); // Tomamos el método getProduct del archivo controllers/product.js

api.get('/product/:productId', ProductControllers.getProduct);

// Tipo post
api.post('/product',ProductControllers.addProduct);

//Tipo PUT: actualizar datos.
api.put('/product/:productId', ProductControllers.updateProduct);

// Por ultimo una ruta tipo delete para borrar productos:
api.delete('/product/:productId', ProductControllers.deleteProduct);

module.exports = api;
```

### Refactorizando configuración:

- Vamos a crear un archivo dedicado a la configuración, de forma que más adelante si tenemos que cambiar url o alguna configuración concreta lo tengamos en este archivo.
- En el index.js de la raiz, tenemos la configuración de la llamada a la BBDD de Mongo con una url y también tenemos el puerto. Esto puede llevarse a un fichero de configuración separado, será un fichero en la raiz llamado config. Esportamos el puerto, la base de datos.
- Es interesante ver que se puede definir una nueva variable de entorno con ```process.env.MONGODB``` para tenerla en producción, y en caso de no existir porque estamos en desarrollo, dejar la que tiene por defecto.

**config.js**

```javascript
module.exports = {
  port: process.env.PORT || 3000,
  db: process.env.MONGODB || 'mongodb://localhost:27017/shop',
}
```
## AÑADIR UN NUEVO MODELO A LA BASE DE DATOS:

### Añadir modelo usuario.
- Crearmos un modelo usuario para gestionar ya sea autenticándose o logueándose: Creamos un nuevo fichero user en la raiz.
- Para encriptar la contraseña de usuario, cosa que se hace ANTES de guardar el usuario en la bbdd, se utiliza [bcrypt-nodejs](https://www.npmjs.com/package/bcrypt-nodejs). Uso [aki](notas_bcrypt-nodejs). ```npm install --save bcrypt-nodejs```
- Para el avatar se usará gravatar.
- Se instala también la librería crypto ```npm install --save crypto```

```javascript
const mongoose = require ('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require ('bcrypt-nodejs'),
      crypto = require ('crypto');

UserSchema = new Schema ({
  email: { type: String, unique: true, lowercase: true }, // definimos las características del email
  displayName: String,
  avatar: String,
  password: { type: String, select: false }, // definimos las características del passwor, con select:false cuando hagamos una petición GET no nos envíe la contraseña por url
  singnupDate: { type: Date, default: Date.now()},
  lastLogin: Date
});

/**
  * Usamos una funcionalidad de mongoose, que permite el uso de funciones antes o después de que el modelo se guarde en la base de
  * datos, y de esta forma usaremos antes una función para encriptar la contraseña del usuario. De forma que antes de salvar la contraseña
  * se va a encriptar con el midelware de bcrypt.
  */
UserSchema.pre('save', (next) => { // Se pasa un parámeto next para que al finalizar se invoque y pueda pasar al siguiente midelware
  let user = this;

  // if(!user.isModified('password')) return next(); se deja comentado porque luego da errores

  bcrypt.genSalt(10, (err, salt) =>{
    if(err) return next();

    bcrypt.hash(user.password, salt, null, (err, hash) =>{
      if (err) return next();

      user.password = hash;
      next();// se pasa al siguiente midelware
    })
  })
});

UserSchema.methods.gravatar = function () { // Metodo de mongoose para coger el gravatar
  if (!this.email) return `https://gravatar.com/avatar/?s=200&d=retro`; // Avatar por defecto, si no se dispone de email.

  const md5 = crypto.createHash('md5').update(this.email).digest('hex'); // Encriptamos con la librería crypto, el email del usuario para enviar y recibir por url.
  return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}
// Exportamos el módulo.

module.exports = mongoose.model('User', UserSchema);
```
## AUTENTICACIÓN DE USUARIO

### Tipos de autenticación según el tipo de API

- Si el renderizado del front lo da la misma API-REST, es decir, no hay un frontend a parte que se comunica con la bbdd, sino que está integrado dentro de la API, se utilizasn una seri de estrategias y librerías como passportJs, que permite que podamos hacer autenticación con usuario y contraseña, así como login social.

- Si el renderizado del frontend está aislado, en otra parte de forma que nuestra API pueda ser mucho más reutilizable y escalable, lo ideal es que el servidor esté separado de la aplicación cliente, lo ideal es usar TOKENS, de forma que el cliente envía un código a la API, al servidor, y el servidor se encarga de descifrar el código y ver si el usuario tiene acceso y que permisos tiene. de esta forma la lógica cae del lado de cliente, no se guardan sesiones en el servidor y de esta forma queda más ligero. Esta es la opción que se va a tomar, y lo que se utiliza normalmente son los [JSON Web Tokens](https://jwt.io/).
- JSON Web Token:
![JWT](img/JWT.png)

### Autenticación de usuario.
- Instalar la librería [jwt-simple](https://www.npmjs.com/package/jwt-simple).
- Crear un controlador que se encargue del registro y la autenticación de usuario dentro de la carpeta controllers, lo llamamos user.js:

**controllers/user.js**
```javascript
const mongoose = require ('mongoose'),
      User= require ('../models/user'),


function signUp(req, res){ // Como son controladores de peticiones http y usamos express, reciben como parametro req y res
  const user = new User({
    email: req.body.email,
    displayName: req.body.displayName // La contraseña no se pasa por aquí pq ya está almacenada con la funcionalidad de mongo pre.
  })
  user.save((err) => {
    if (err) res.status(500).send({ message: `Error al crear el usuario ${err}`});

    return res.status(200).send({ token: service.createToken(user) }) // Con service.createToken(user) llamamos a un servicio q vamos a crear
  })                                                                  // para generar el token.
}

function signIn(req, res){

};

module.exports = {
  signUp,
  signIn
}
```
- Los servicios son funciones que nos permiten realizar acciones dentro del código, y que van a ser reutilizables, por lo que suelen ponerse en un archivo a parte. Se crea la carpeta services, y ahí en el index.js será donde definamos el servicio para crear tokens:

**services/index.js**
```javascript
const jwt = require ('jwt-simple'),
      moment = require ('moment'),
      config = require ('../config')
      service = require ('../services');

function createToken (user) {
  const payload = {
    sub: user._id, // Esto no debe hacerse así, puesto que es el id que genera mongo y es muy inseguro, pero por abreviar se deja este id
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  }
  return jwt.encode(payload, config.SECRET_TOKEN) // Agregado en el fichero config! Suele ser un código más complejo
}

module.exports = createToken;
```

## CREAR UN MIDELWARE PARA PROTEGER RUTAS SEGÚN EL USUARIO QUE ACCEDE

### Crear un midelware:

- Creamos una nueva carpeta para guardar ahí los midelwares, y en ella el archivo auth.js que contendrá un midelware para comprobar si el usuario está autenticado:

**midelwares/auth.js**

```javascript
const jwt = require ('jwt'),
      moment = require ('moment'),
      config = require ('../config');

function isAuth (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'No tienes autorización'})
  }

  const token = req.headers.authorization.split(" ")[1] // Esto nos da el token que nos envía el cliente en las cabeceras
  const payload = jwt.decode(token, config.SECRET_TOKEN)

  if(payload.exp <= moment().unix()) {
    return res.stuatus(401).send({ message: "El Token ha expirado"})
  }

  req.user = payload.sub;
  next();
}

module.exports = isAuth;
```
- Luego en nuestro routes/index.js, asignamos una nueva ruta que va a ser sólo accesible si se está registrado, por lo que se pasa la ruta, el midelware de autencación y por ultimo el callback para dar la respuesta:

**routes/index.js**

```javascript
// Ruta privada para probar el midelware authorization. Llamamos al método isAuth del midelware auth.js
api.get('/private', auth.isAuth, function(req, res) => {
  res.status(200).send({ message: 'Tienes acceso '})
});
```
## CREAR EL LOGIN DEL CONTROLADOR USER.JS

### Terminar el logIn:

- Vamos a crear una función en el controlador user.js, para crear el login, que estaba sin terminar. Vamso a buscar en la ddbb los usuarios q tengan el email que se pasa por la url y si existe, se crea un token q viaja en las cabeceras y la aplicación en cliente en cada petición, a traves de las cabeceras. Como el cliente lo tendrá almacenado en localStorage, lo envía por la cabecera y el servidor lo descodificará con los parámetros pasados en SECRET_TOKEN y si coincide le dará acceso al usuario:

**controllers/user.js**

```javascript
const mongoose = require ('mongoose'),
      User= require ('../models/user'),


function signUp(req, res){ // Como son controladores de peticiones http y usamos express, reciben como parametro req y res
  const user = new User({
    email: req.body.email,
    displayName: req.body.displayName // La contraseña no se pasa por aquí pq ya está almacenada con la funcionalidad de mongo pre.
  })
  user.save((err) => {
    if (err) res.status(500).send({ message: `Error al crear el usuario ${err}`});

    return res.status(200).send({ token: service.createToken(user) }) // Con service.createToken(user) llamamos a un servicio que vamos a crear
  })                                                                  // para generar el token.
}

function signIn(req, res){ // Login del usuario. Cada petición del usuario manda su token de localStorage.
  user.find({ email: req.body.email}, (err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(404).send({ message: 'El usuario no existe'});
    // Cuando el usuario se loguea correctamente, en request guardamos el usuario y lanzamos un status 200 y mensaje, y guardamos el token,
    req.user = user;
    res.status(200).send({
      message: 'Te has logueado con éxito';
      token: service.createToken(user) // Dentro del service/index.js
    })
  })
};

module.exports = {
  signUp,
  signIn
}
```

### Refactorizar el servicio de creación de tokens
- Vamos a cambiar la lógica de la autorización que se encuentra ahora en el midelware de autencación, cuando en realidad se puede meter en los servicios, puesto que en última instancia es un servicio reutilizable.
- Antes de eso creamos la función decodeToken en services/index donde ya está la creación del token:

**services/index.js**

```javascript
const jwt = require ('jwt-simple'),
      moment = require ('moment'),
      config = require ('../config')
      service = require ('../services');

function createToken (user) {
  const payload = {
    sub: user._id, // Esto no debe hacerse así, puesto q es el id que genera mongo y es muy inseguro, pero por abreviar se deja este id
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  }
  return jwt.encode(payload, config.SECRET_TOKEN) // Agregado en el fichero config! Suele ser un código más complejo
}

// Función para descodificar el Token que llega en la cabecera de las peticiones:
function decodeToken(token) {
  // neuva funcionalidad de ESMAC6: promesas
  const decoded = new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, config.SECRET_TOKEN);

      if(payload.exp <= moment().unix()) { // Token expirado
         reject({ // se llama a reject porque hay un error y se va a rechazar en la promesa que se invoca.
          status: 401,
          message: 'El Token ha expirado'
        })
      } // nos hemos traido esta lógica de midelwares/auth.js (res.stuatus(401).send({ message: "El Token ha expirado"})) y cambiamos la respuesta de express y retornamos lo que se resuelve que es token expirado:

      // En caso de que no haya expirado, comprobamos q el token existe
      resolve(payload.sub) // pasamos el id de usuario
    } catch(err){
      reject({
        status: 500,
        message: 'Token no válido'
      })
    }
  })
  return decoded;
}
module.exports = {
  createToken,
  decodeToken
} ;
```

## REGISTRAR UN USUARIO

### Dar de alta un usuario para poder autenticarlo después:

- Creamos unas rutas para el alta (signUp) y el login (signIn):

```javascript
// Rutas para el alta y logIn:
api.post('/signup', UserControll.signUp);
api.post('/signin', UserControll.signIn);
```

- Dentro del gestor de peticiones (en mi caso [Insomnia](https://insomnia.rest/)), damos las claves y valores que se van a enviar por post a la ruta de signUp y enviamos la petición:
![insomnia](img/signUp.png)

y nos devuelve el token, en este caso por ejemplo es:
```json
{
	"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YjM4YzdlOGI5YTIyNTY0ODUwYzk3YWMiLCJpYXQiOjE1MzA0NDc4NDgsImV4cCI6MTUzMTY1NzQ0OH0.xEEbVEXtIGfMNMeEBs8Su_Tpt84iwBm0gttdCavXYiU"
}
```
- Una vez dado de alta un usuario, podemos probar a entrar en la ruta privada, enviando el token en la cabecera de la petición precedido de la palabra reservada Bearer (*portador*) por lo que en insomnia pondremos lo siguiente
![acceso a pagina privada](img/acceso.png)
