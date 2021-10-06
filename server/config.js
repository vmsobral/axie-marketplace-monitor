require('dotenv').config({
  path: require('path').join(__dirname, '..', '.env')
})

module.exports = {
  host: process.env.HOST,
  port: process.env.PORT,
  mongoURL: process.env.MONGO_URL
}
