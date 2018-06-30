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
