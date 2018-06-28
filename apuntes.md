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

```npm i -S body-parser```

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
