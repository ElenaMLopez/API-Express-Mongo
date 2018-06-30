const mongoose = require ('mongoose'),
      User= require ('../models/user'),


function signUp(req, res){ // Como son controladores de peticiones http y usamos express, reciben como parametro req y res
  const user = new User({
    email: req.body.email,
    displayName: req.body.displayName // La contraseña no se pasa por aquí pq ya está almacenada con la funcionalidad de mongo pre.
  })
  user.save((err) => {
    if (err) res.status(500).send({ message: `Error al crear el usuario ${err}`});

    return res.status(200).send({ token: service.createToken(user) }) // Con service.createToken(user) llamamos a un servicio q vamos a crear
  })                                                                  // para generar el token.
}

function signIn(req, res){

};

module.exports = {
  signUp,
  signIn
}
