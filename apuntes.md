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
### REFACTORIZAR EL CODIGO:

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
