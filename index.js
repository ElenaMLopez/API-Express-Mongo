const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      app = express(),
      uriMongo = 'mongodb://localhost:27017/shop', //dirección del puerto donde corre mongodb
      port = process.env.PORT || 3000; // El puerto puede ser una
                                      // variable de entorno o el 3000



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
    products: [],
  })
});

app.get('/api/product/:productId', (req, res) => {

});
// Tipo post
app.post('/api/product', (req, res) => {
// accedemos al cuerpo de la petición, con bodyParser como si fuese un json
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
mongoose.connect(uriMongo, (err, res) =>{
  if (err) {
    return console.log('Error al conectar a la base de datos ...');
  }else {
    console.log('Conexión establecida!');
  };
  /** Arrancar el server:
    * Metemos el arranque del server dentro del callback de la conexión a
    * mongoose, puesto que es necesario que la base de datos esté corriendo
    * para poder conectarse.
    */
  app.listen(port, () => {
    console.log(`API REST corriendo en http://localhost:${port}`);
  });

})
