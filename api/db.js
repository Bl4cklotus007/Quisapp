const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db('quiz-app');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

async function closeDB() {
    try {
        await client.close();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        throw error;
    }
}

module.exports = { connectDB, closeDB }; 