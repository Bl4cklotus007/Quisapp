// Import required modules
const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'quiz-app';

// Connect to MongoDB
async function connectToDatabase() {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    return { client, db };
}

// API handler
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { client, db } = await connectToDatabase();

        switch (req.method) {
            case 'GET':
                // Get questions by subject
                const { subject } = req.query;
                const questions = await db.collection('questions')
                    .find({ subject })
                    .toArray();
                res.status(200).json(questions);
                break;

            case 'POST':
                // Add new question
                const newQuestion = req.body;
                const result = await db.collection('questions')
                    .insertOne(newQuestion);
                res.status(201).json(result);
                break;

            case 'PUT':
                // Update question
                const { id } = req.query;
                const updatedQuestion = req.body;
                await db.collection('questions')
                    .updateOne(
                        { _id: id },
                        { $set: updatedQuestion }
                    );
                res.status(200).json({ message: 'Question updated successfully' });
                break;

            case 'DELETE':
                // Delete question
                const { questionId } = req.query;
                await db.collection('questions')
                    .deleteOne({ _id: questionId });
                res.status(200).json({ message: 'Question deleted successfully' });
                break;

            default:
                res.status(405).json({ message: 'Method not allowed' });
        }

        await client.close();
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 