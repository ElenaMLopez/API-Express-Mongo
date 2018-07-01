const services = require ('../services');
      // jwt = require ('jwt-simple'),
      // moment = require ('moment'),
      // config = require ('../config'); // ya no se usa, pq esta todo en servicios

function isAuth (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'No tienes autorización'})
  }

  const token = req.headers.authorization.split(" ")[1] // Esto nos da el token que nos envía el cliente en las cabeceras

  // const payload = jwt.decode(token, config.SECRET_TOKEN)
  //
  // // if(payload.exp <= moment().unix()) {
  // //   return res.stuatus(401).send({ message: "El Token ha expirado"})
  // // } // Nos llevamos esto a services/index.js dentro del decodeToken
  //
  // req.user = payload.sub;
  // TODO ESTO YA ESTÁ EN EL SERVICIO Y NO HACE FALTA!
  //next(); // El next() se quita pq se va a meter en la llamada a la promesa.
  services.decodeToken(token)
    .then(response => {
      req.user = response;
      next()
    })

    .catch(response =>{
      res.status(response.status);
    })
}

module.exports = isAuth;
