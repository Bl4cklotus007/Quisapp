const { connectToDatabase } = require('./db');
const { ObjectId } = require('mongodb');

// Get all materi
async function getAllMateri(req, res) {
    try {
        const db = await connectToDatabase();
        const materi = await db.collection('materi').find({}).toArray();
        res.json(materi);
    } catch (error) {
        console.error('Error getting materi:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

// Get materi by subject
async function getMateriBySubject(req, res) {
    try {
        const { subject } = req.params;
        const db = await connectToDatabase();
        const materi = await db.collection('materi').find({ subject }).toArray();
        res.json(materi);
    } catch (error) {
        console.error('Error getting materi by subject:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

// Add new materi
async function addMateri(req, res) {
    try {
        const { subject, title, content } = req.body;
        
        // Validate required fields
        if (!subject || !title || !content) {
            return res.status(400).json({ 
                error: 'Bad Request', 
                message: 'Missing required fields' 
            });
        }

        const db = await connectToDatabase();
        const newMateri = {
            subject,
            title,
            content,
            createdAt: new Date()
        };
        
        const result = await db.collection('materi').insertOne(newMateri);
        res.status(201).json({
            message: 'Materi added successfully',
            id: result.insertedId,
            materi: newMateri
        });
    } catch (error) {
        console.error('Error adding materi:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

// Update materi
async function updateMateri(req, res) {
    try {
        const { id } = req.params;
        const { subject, title, content } = req.body;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        // Validate required fields
        if (!subject || !title || !content) {
            return res.status(400).json({ 
                error: 'Bad Request', 
                message: 'Missing required fields' 
            });
        }

        const db = await connectToDatabase();
        const updateData = {
            subject,
            title,
            content,
            updatedAt: new Date()
        };

        const result = await db.collection('materi').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Materi not found' });
        }

        res.json({
            message: 'Materi updated successfully',
            id: id,
            materi: updateData
        });
    } catch (error) {
        console.error('Error updating materi:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

// Delete materi
async function deleteMateri(req, res) {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const db = await connectToDatabase();
        const result = await db.collection('materi').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Materi not found' });
        }

        res.json({
            message: 'Materi deleted successfully',
            id: id
        });
    } catch (error) {
        console.error('Error deleting materi:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

module.exports = {
    getAllMateri,
    getMateriBySubject,
    addMateri,
    updateMateri,
    deleteMateri
}; 