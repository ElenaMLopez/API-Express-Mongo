module.exports = {
  port: process.env.PORT || 3000,
  db: process.env.MONGOHQ_URL || 'mongodb://localhost:27017/shop',
  SECRET_TOKEN: 'miSecretoToken'
}
// variable de mlab : MONGOHQ_URL
