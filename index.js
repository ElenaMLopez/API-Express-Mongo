const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      app = express(),
      uriMongo = 'mongodb://localhost:27017/shop', //dirección del puerto donde corre mongodb
      port = process.env.PORT || 3000, // El puerto puede ser una variable de entorno o el 3000

      ProductControllers = require('./controllers/product'); //Traemos los controladores de la carpeta controllers

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

app.get('/api/product', ProductControllers.getProducts); // Tomamos el método getProduct del archivo controllers/product.js

app.get('/api/product/:productId', ProductControllers.getProduct);

// Tipo post
app.post('/api/product',ProductControllers.addProduct);

//Tipo PUT: actualizar datos.
app.put('/api/product/:productId', ProductControllers.updateProduct);

// Por ultimo una ruta tipo delete para borrar productos:
app.delete('/api/product/:productId', ProductControllers.deleteProduct);

//Conectar a mongo:
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
