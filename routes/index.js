const express = require ('express'),
      ProductControllers = require ('../controllers/product'),
      UserControll = require ('../controllers/user'),
      auth = require ('../midelwares/auth'),
      api = express.Router();

api.get('/product', ProductControllers.getProducts); // Tomamos el método getProduct del archivo controllers/product.js

api.get('/product/:productId', ProductControllers.getProduct);

// Tipo post
api.post('/product',ProductControllers.addProduct);

//Tipo PUT: actualizar datos.
api.put('/product/:productId', ProductControllers.updateProduct);

// Por ultimo una ruta tipo delete para borrar productos:
api.delete('/product/:productId', ProductControllers.deleteProduct);

//Ruta privada para probar el midelware authorization. Llamamos al método isAuth del midelware auth.js
api.get('/private', auth, function (req, res) {
  res.status(200).send({ message: 'Tienes acceso '})
});
// Rutas para el alta y logIn:
api.post('/signup', UserControll.signUp);
api.post('/signin', UserControll.signIn);

module.exports = api;
