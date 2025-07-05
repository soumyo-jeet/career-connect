const express = require('express')
const cors = require('cors')
const connectTomongo = require('./db')


const PORT = process.env.PORT || 8000
const app = express()
connectTomongo()

// cors policy
app.use(cors({
    origin: ["http://localhost:3000", "https://career-connect-soumyo.vercel.app"],
    credentials: true
}))
app.use(express.json())

// routes
app.use('/api/user', require('./routes/user'))
app.use('/api/job', require('./routes/job'))
app.use('/api/application', require('./routes/application'))



// sever porting
app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`)
})