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
      serverSelectionTimeoutMS: 10000, // Increase timeout to 10 seconds
      connectTimeoutMS: 20000, // Increase connection timeout to 20 seconds
      socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 60000,
      waitQueueTimeoutMS: 10000
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
      throw new Error(`Failed to connect to MongoDB Atlas: ${error.message}. Please check your network access settings and connection string.`);
    } else if (error.name === 'MongoNetworkError') {
      throw new Error(`Network error while connecting to MongoDB Atlas: ${error.message}. Please check your internet connection and MongoDB Atlas status.`);
    } else {
      throw error;
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