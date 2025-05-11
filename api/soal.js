const { connectDB } = require('./db');
const { ObjectId } = require('mongodb');

// Get all questions
async function getAllQuestions(req, res) {
    try {
        const db = await connectDB();
        const questions = await db.collection('soal').find({}).toArray();
        res.json(questions);
    } catch (error) {
        console.error('Error getting questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get questions by subject
async function getQuestionsBySubject(req, res) {
    try {
        const { subject } = req.params;
        const db = await connectDB();
        const questions = await db.collection('soal').find({ subject }).toArray();
        res.json(questions);
    } catch (error) {
        console.error('Error getting questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Add new question
async function addQuestion(req, res) {
    try {
        const { subject, question, options, correctAnswer } = req.body;
        if (!subject || !question || !options || !Array.isArray(options) || correctAnswer === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = await connectDB();
        const result = await db.collection('soal').insertOne({
            subject,
            question,
            options,
            correctAnswer,
            createdAt: new Date()
        });

        res.status(201).json({
            message: 'Question added successfully',
            id: result.insertedId
        });
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Update question
async function updateQuestion(req, res) {
    try {
        const { id } = req.params;
        const { subject, question, options, correctAnswer } = req.body;
        
        const db = await connectDB();
        const result = await db.collection('soal').updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: {
                    subject,
                    question,
                    options,
                    correctAnswer,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json({ message: 'Question updated successfully' });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete question
async function deleteQuestion(req, res) {
    try {
        const { id } = req.params;
        const db = await connectDB();
        const result = await db.collection('soal').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllQuestions,
    getQuestionsBySubject,
    addQuestion,
    updateQuestion,
    deleteQuestion
}; 