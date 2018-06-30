const jwt = require ('jwt'),
      moment = require ('moment'),
      config = require ('../config');

function isAuth (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'No tienes autorización'})
  }

  const token = req.headers.authorization.split(" ")[1] // Esto nos da el token que nos envía el cliente en las cabeceras
  const payload = jwt.decode(token, config.SECRET_TOKEN)

  if(payload.exp <= moment().unix()) {
    return res.stuatus(401).send({ message: "El Token ha expirado"})
  }

  req.user = payload.sub;
  next();
}

module.exports = isAuth;
