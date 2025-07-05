const mongoose = require('mongoose');
require('dotenv').config();

const connectTomongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Critical for Vercel serverless
      serverSelectionTimeoutMS: 5000, // Fail fast if no primary server found
      socketTimeoutMS: 30000, // Close sockets after 30s of inactivity
      maxPoolSize: 5, // Match Vercel's free tier limits
      retryWrites: true,
      retryReads: true,
      heartbeatFrequencyMS: 10000, // Send pings every 10s
      connectTimeoutMS: 5000 // Initial connection timeout
    });

    mongoose.connection.on('connected', () => {
      console.log(`DB connected to ${mongoose.connection.host}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error('DB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('DB disconnected!');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (err) {
    console.error('Initial DB connection failed:', err);
    process.exit(1); // Crash immediately in production
  }
};

module.exports = connectTomongo;