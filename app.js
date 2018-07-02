const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      api = require ('./routes'),
      hbs = require ('express-handlebars');
/** Utilizar bodyParser:
* Para utilizar midelwares se llama al método 'use'
*/
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(bodyParser.json());
app.use('/api', api); // Se han pasado las rutas a router/index.js

// /** PETICIÓN TIPO GET:
//   * @param hola ('/hola') primer parámetro del metodo get de nuestra app
//   * es la url que queremos que ESCUCHE este método.
//   * @param el segundo parámetro es un callback que tiene como parámetros req (request o petición),
//   * y res (respuesta).
//   * Cuando obtengamos la respuesta, el método send, nos dará el mensaje que se le pasa:
//   */
// /**
// app.get('/hola', (req, res) => {
//   res.send({ message: 'hola mundoooor' })
// });
// app.get('/hola/:name', (req, res) => {
//   res.send({ mensaje: `Hola ${req.params.name}!`})
// });*/
//
// /** Definir rutas para hacer las Peticiones
// */
//
// app.get('/api/product', ProductControllers.getProducts); // Tomamos el método getProduct del archivo controllers/product.js
//
// app.get('/api/product/:productId', ProductControllers.getProduct);
//
// // Tipo post
// app.post('/api/product',ProductControllers.addProduct);
//
// //Tipo PUT: actualizar datos.
// app.put('/api/product/:productId', ProductControllers.updateProduct);
//
// // Por ultimo una ruta tipo delete para borrar productos:
// app.delete('/api/product/:productId', ProductControllers.deleteProduct);
/**
* CONFIGURAR EL MOTOR DE POANTILLAS:
  *Llamada a hadlebars:
  *Framewor para renderizar html con express.¡
  */
app.engine ('.hbs', hbs({
  defaultLayout: 'default',
  extname: '.hbs'
}) );
app.set('view engine', '.hbs');
app.get('/login', (req, res) => {
  res.render('login')
})
app.get('/', (req, res) => {
  res.render('product')
})
module.exports = app;
