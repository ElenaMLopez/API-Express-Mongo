const mongoose = require('mongoose'),
      Schema = mongoose.Schema; // Metodo de mongoose para determinar el tipo de datos del resgistro.

const productSchema = Schema ({
  name: String,
  picture: String,
  price: Number,
  category: {type: String, enum: ['computers', 'phones','accesories']},
  description: String,
})

//Exportamos el esquema del resgistro
module.exports = mongoose.model('Product', productSchema);// con esto hacemos visible nuestro esquema de dato al resto de la aplicación
