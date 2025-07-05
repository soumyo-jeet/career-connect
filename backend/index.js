const express = require('express')
const cors = require('cors')
const connectTomongo = require('./db')


const PORT = process.env.PORT || 8000
const app = express()
connectTomongo()

app.use(cors({
    origin: ["http://localhost:3000", "https://career-connect-soumyo.vercel.app"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type',  'token']
}))

app.use(express.json())

// routes
app.use('/api/user', require('./routes/user'))
app.use('/api/job', require('./routes/job'))
app.use('/api/application', require('./routes/application'))



// vercel
module.exports = app;

//localhost
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}