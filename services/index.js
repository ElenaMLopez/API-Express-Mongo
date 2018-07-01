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
// Función para descodificar el Token que llega en la cabecera de las peticiones:
function decodeToken(token) {
  // neuva funcionalidad de ESMAC6: promesas
  const decoded = new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, config.SECRET_TOKEN);

      if(payload.exp <= moment().unix()) { // Token expirado
         reject({ // se llama a reject porque hay un error y se va a rechazar en la promesa que se invoca.
          status: 401,
          message: 'El Token ha expirado'
        })
      } // nos hemos traido esta lógica de midelwares/auth.js (res.stuatus(401).send({ message: "El Token ha expirado"})) y cambiamos la respuesta de express y retornamos lo que se resuelve que es token expirado:

      // En caso de que no haya expirado, comprobamos q el token existe
      resolve(payload.sub) // pasamos el id de usuario
    } catch(err){
      reject({
        status: 500,
        message: 'Token no válido'
      })
    }
  })
  return decode;
}
module.exports = {
  createToken,
  decodeToken
} ;
