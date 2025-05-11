const { MongoClient } = require('mongodb');

let cachedDb = null;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      tlsInsecure: false,
      retryWrites: true,
      w: 'majority'
    });

    cachedClient = client;
    const db = client.db('quiz-app');
    cachedDb = db;
    
    client.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      cachedDb = null;
      cachedClient = null;
    });

    await db.command({ ping: 1 });
    console.log('Successfully connected to MongoDB.');

    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    cachedDb = null;
    cachedClient = null;
    throw error;
  }
}

module.exports = { connectToDatabase }; 