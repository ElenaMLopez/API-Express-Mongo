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
