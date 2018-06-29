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
