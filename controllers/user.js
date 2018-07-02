const mongoose = require ('mongoose'),
      User = require ('../models/user'),
      service = require ('../services');


function signUp (req, res) { // Como son controladores de peticiones http y usamos express, reciben como parametro req y res
  const user = new User({
    email: req.body.email,
    displayName: req.body.displayName // La contraseña no se pasa por aquí pq ya está almacenada con la funcionalidad de mongo pre.
  })

  user.save((err) => {
    if (err) res.status(500).send({ message: `Error al crear el usuario:  ${err}`});

    return res.status(201).send({ token: service.createToken(user) }) // Con service.createToken(user) llamamos a un servicio que vamos a crear
  })                                                                  // para generar el token.
}

function signIn (req, res) { // Login del usuario. Cada petición del usuario manda su token de localStorage.
  User.find({ email: req.body.email}, (err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(404).send({ message: 'El usuario no existe'});
    // Cuando el usuario se loguea correctamente, en request guardamos el usuario y lanzamos un status 200 y mensaje, y guardamos el token.
    req.user = user;
    res.status(200).send({
      message: 'Te has logueado con exito',
      token: service.createToken(user) // Dentro del service/index.js
    })
  })
};


module.exports = {
  signUp,
  signIn
}
