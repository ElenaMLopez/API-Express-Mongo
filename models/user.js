const mongoose = require ('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require ('bcrypt-nodejs'),
      crypto = require ('crypto');

UserSchema = new Schema ({
  email: { type: String, unique: true, lowercase: true }, // definimos las características del email
  displayName: String,
  avatar: String,
  password: { type: String, select: false }, // definimos las características del passwor, con select:false cuando hagamos una petición GET no nos envíe la contraseña por url
  singnupDate: { type: Date, default: Date.now()},
  lastLogin: Date
});

/**
  * Usamos una funcionalidad de mongoose, que permite el uso de funciones antes o después de que el modelo se guarde en la base de
  * datos, y de esta forma usaremos antes una función para encriptar la contraseña del usuario. De forma que antes de salvar la contraseña
  * se va a encriptar con el midelware de bcrypt.
  */
UserSchema.pre('save', (next) => { // Se pasa un parámeto next para que al finalizar se invoque y pueda pasar al siguiente midelware
  let user = this;

  //if(!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) =>{
    if(err) return next();

    bcrypt.hash(user.password, salt, null, (err, hash) =>{
      if (err) return next();

      user.password = hash;
      next();// se pasa al siguiente midelware
    })
  })
});

UserSchema.methods.gravatar = function () { // Metodo de mongoose para coger el gravatar
  if (!this.email) return `https://gravatar.com/avatar/?s=200&d=retro`; // Avatar por defecto, si no se dispone de email.

  const md5 = crypto.createHash('md5').update(this.email).digest('hex'); // Encriptamos con la librería crypto, el email del usuario para enviar y recibir por url.
  return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}
// Exportamos el módulo.

module.exports = mongoose.model('User', UserSchema);
