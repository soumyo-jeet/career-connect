const express = require('express')
const cors = require('cors')
const connectTomongo = require('./db')


const PORT = process.env.PORT || 8000
const app = express()
connectTomongo()

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://career-connect-soumyo.vercel.app',
      'https://career-connect-chi.vercel.app'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options(/.*/, cors(corsOptions)); 



app.use(express.json())

// routes
app.use('/api/user', require('./routes/user'))
app.use('/api/job', require('./routes/job'))
app.use('/api/application', require('./routes/application'))



// sever porting
app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`)
})