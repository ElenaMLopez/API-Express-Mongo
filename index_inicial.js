const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      app = express(),
      uriMongo = 'mongodb://localhost:27017/shop', //dirección del puerto donde corre mongodb
      port = process.env.PORT || 3000, // El puerto puede ser una variable de entorno o el 3000
      Product = require('./models/product'); //Como no es una librería de npm se indica la ruta

/** Utilizar bodyParser:
* Para utilizar midelwares se llama al método 'use'
*/
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(bodyParser.json());

/** PETICIÓN TIPO GET:
  * @param hola ('/hola') primer parámetro del metodo get de nuestra app
  * es la url que queremos que ESCUCHE este método.
  * @param el segundo parámetro es un callback que tiene como parámetros req (request o petición),
  * y res (respuesta).
  * Cuando obtengamos la respuesta, el método send, nos dará el mensaje que se le pasa:
  */
/**
app.get('/hola', (req, res) => {
  res.send({ message: 'hola mundoooor' })
});
app.get('/hola/:name', (req, res) => {
  res.send({ mensaje: `Hola ${req.params.name}!`})
});*/

/** Definir rutas para hacer las Peticiones
*/
app.get('/api/product', (req, res) => {
  res.status(200).send({
    products: []
  })
})

app.get('/api/product/:productId', (req, res) => {
// Buscar en la BBDD un objeto con un id
  let productId = req.params.productId;

  Product.findById(productId, (err, product) => {
    if (err) return res.status(500).send({menssage: 'Error al realizar la petición ${err}'})
    if (!product) return res.status(404).send({message: 'El producto no existe'})

    res.status(200).send({product: product})// puede ponerse: res.status(200).send({product})
  });
})

// Tipo post
app.post('/api/product', (req, res) => {
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
})

//Tipo PUT: actualizar datos.
app.put('/api/product/:productId', (req, res) => {
  let productId = req.params.productId;
  let update = req.body;

  Product.findByIdAndUpdate(productId, update, (err, productUpdated) =>{
    if (!productId)return res.status(404).send({message: 'No puede actualizarse un producto que no existe en la base de datos'});
    if (err) return res.status(500).send({message: 'Error al actualizar el producto de la base de datos'});

    res.status(200).send({ product: productUpdated })
  })
})

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

mongoose.connect(uriMongo, (err, res) => {
  if(err) throw err
  //console.log('Error al conectar a la base de datos ...');
  console.log('Conexión establecida!');

  /** Arrancar el server:
    * Metemos el arranque del server dentro del callback de la conexión a
    * mongoose, puesto que es necesario que la base de datos esté corriendo
    * para poder conectarse.
    */
  app.listen(port, () => {
    console.log(`API REST corriendo en http://localhost:${port}`);
  })
})
