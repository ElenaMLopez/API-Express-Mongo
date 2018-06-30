const mongoose = require('mongoose'),
      app = require('./app'),
      config = require('./config');

//Conectar a mongo:
mongoose.connect(config.db, (err, res) => {
  if(err) throw err
  //console.log('Error al conectar a la base de datos ...');
  console.log('Conexión establecida!');

  /** Arrancar el server:
    * Metemos el arranque del server dentro del callback de la conexión a
    * mongoose, puesto que es necesario que la base de datos esté corriendo
    * para poder conectarse.
    */
  app.listen(config.port, () => {
    console.log(`API REST corriendo en http://localhost:${config.port}`);
  })
})
