const { MongoClient } = require('mongodb');

let cachedDb = null;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedDb) {
    try {
      // Test the connection
      await cachedDb.command({ ping: 1 });
      return cachedDb;
    } catch (error) {
      console.log('Cached connection failed, creating new connection');
      cachedDb = null;
      cachedClient = null;
    }
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    // Parse the connection string to ensure it's valid
    const uri = process.env.MONGODB_URI.trim();
    if (!uri.startsWith('mongodb+srv://')) {
      throw new Error('Invalid MongoDB connection string format');
    }

    const client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Reduce timeout to 5 seconds
      connectTimeoutMS: 10000, // Reduce connection timeout to 10 seconds
      socketTimeoutMS: 45000,
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 5, // Reduce pool size for serverless
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 5000
    });

    cachedClient = client;
    const db = client.db('quiz-app');
    
    // Test the connection
    await db.command({ ping: 1 });
    console.log('Successfully connected to MongoDB Atlas');
    
    cachedDb = db;
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cachedDb = null;
    cachedClient = null;
    
    // Provide more detailed error information
    if (error.name === 'MongoServerSelectionError') {
      const customError = new Error('Failed to connect to MongoDB Atlas');
      customError.statusCode = 503;
      customError.details = 'Database service is currently unavailable. Please try again later.';
      throw customError;
    } else if (error.name === 'MongoNetworkError') {
      const customError = new Error('Network error while connecting to MongoDB Atlas');
      customError.statusCode = 503;
      customError.details = 'Network connectivity issue. Please check your internet connection.';
      throw customError;
    } else if (error.name === 'MongoParseError') {
      const customError = new Error('Invalid MongoDB connection string');
      customError.statusCode = 500;
      customError.details = 'The database connection string is invalid. Please check your configuration.';
      throw customError;
    } else {
      const customError = new Error('Database connection error');
      customError.statusCode = 500;
      customError.details = error.message;
      throw customError;
    }
  }
}

// Cleanup function for when the serverless function is done
async function cleanup() {
  if (cachedClient) {
    try {
      await cachedClient.close();
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    } finally {
      cachedDb = null;
      cachedClient = null;
    }
  }
}

module.exports = { connectToDatabase, cleanup }; 