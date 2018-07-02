# DESPLIEGUE EN HEROKU:

1. Abrir cuenta en HEROKU

2. Abrir cuenta en mlab

3. Coger de mla la dirección de la bbdd

```
mongodb://<dbuser>:<dbpassword>@ds125381.mlab.com:25381/shop

 ```

4. Instalar heroku en local:

```
sudo snap install heroku --classic
```

5. Loguearse en heroku:

```
heroku login
```

Introducir los datos del Login

6. Introducir la ruta para la bbdd, sin tarjeta:

```
heroku config:set MONGOHQ_URL="mongodb://foo:bar@alex.mongohq.com:10007/mymongodb"
```

7. Cambiar la variable de entorno en el config.js de   

```
db: process.env.MONGODB || 'mongodb://localhost:27017/shop'
```

a

```  
db: process.env.MONGOHQ_URL || 'mongodb://localhost:27017/shop'
```

NOTAS:
a.  ver los logs de HEROKU
```
heroku logs
```

b. Recursos:

- Deply en Heroku sin tarjeta de credito: https://geuispuspita.wordpress.com/2014/06/30/how-to-use-mongohq-on-heroku-without-verifying-your-account/
