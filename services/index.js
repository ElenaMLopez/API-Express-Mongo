const jwt = require ('jwt-simple'),
      moment = require ('moment'),
      config = require ('../config')
      service = require ('../services');

function createToken (user) {
  const payload = {
    sub: user._id, // Esto no debe hacerse así, puesto q es el id que genera mongo y es muy inseguro, pero por abreviar se deja este id
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  }
  return jwt.encode(payload, config.SECRET_TOKEN) // Agregado en el fichero config! Suele ser un código más complejo
}

module.exports = createToken;
