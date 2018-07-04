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
