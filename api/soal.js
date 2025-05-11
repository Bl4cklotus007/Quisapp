const { connectToDatabase } = require('./db');
const { ObjectId } = require('mongodb');

// Get all questions
async function getAllQuestions(req, res) {
    try {
        const db = await connectToDatabase();
        const questions = await db.collection('soal').find({}).toArray();
        res.json(questions);
    } catch (error) {
        console.error('Error getting questions:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

// Get questions by subject
async function getQuestionsBySubject(req, res) {
    try {
        const { subject } = req.params;
        const db = await connectToDatabase();
        const questions = await db.collection('soal').find({ subject }).toArray();
        res.json(questions);
    } catch (error) {
        console.error('Error getting questions by subject:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

// Add new question
async function addQuestion(req, res) {
    try {
        const { subject, question, options, correctAnswer } = req.body;
        
        // Validate required fields
        if (!subject || !question || !options || !Array.isArray(options) || correctAnswer === undefined) {
            return res.status(400).json({ 
                error: 'Bad Request', 
                message: 'Missing required fields or invalid data format' 
            });
        }

        const db = await connectToDatabase();
        const newQuestion = {
            subject,
            question,
            options,
            correctAnswer,
            createdAt: new Date()
        };
        
        const result = await db.collection('soal').insertOne(newQuestion);
        res.status(201).json({
            message: 'Question added successfully',
            id: result.insertedId,
            question: newQuestion
        });
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

// Update question
async function updateQuestion(req, res) {
    try {
        const { id } = req.params;
        const { subject, question, options, correctAnswer } = req.body;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        // Validate required fields
        if (!subject || !question || !options || !Array.isArray(options) || correctAnswer === undefined) {
            return res.status(400).json({ 
                error: 'Bad Request', 
                message: 'Missing required fields or invalid data format' 
            });
        }

        const db = await connectToDatabase();
        const updateData = {
            subject,
            question,
            options,
            correctAnswer,
            updatedAt: new Date()
        };

        const result = await db.collection('soal').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json({
            message: 'Question updated successfully',
            id: id,
            question: updateData
        });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

// Delete question
async function deleteQuestion(req, res) {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const db = await connectToDatabase();
        const result = await db.collection('soal').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json({
            message: 'Question deleted successfully',
            id: id
        });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

module.exports = {
    getAllQuestions,
    getQuestionsBySubject,
    addQuestion,
    updateQuestion,
    deleteQuestion
}; 