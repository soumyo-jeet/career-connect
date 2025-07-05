const mongoose = require('mongoose')
require('dotenv').config()
const mongoUri = process.env.MONGO_URI

const connectTomongo = () => {
    mongoose.connect(mongoUri)
    .then((con) => console.log(`db connected at ${con.connection.host}`))
    .catch((e) => console.log(e))
} 

module.exports = connectTomongo