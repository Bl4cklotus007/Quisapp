const { connectDB } = require('./db');

// Get all materi
async function getAllMateri(req, res) {
    try {
        const db = await connectDB();
        const materi = await db.collection('materi').find({}).toArray();
        res.json(materi);
    } catch (error) {
        console.error('Error getting materi:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get materi by subject
async function getMateriBySubject(req, res) {
    try {
        const { subject } = req.params;
        const db = await connectDB();
        const materi = await db.collection('materi').findOne({ subject });
        if (!materi) {
            return res.status(404).json({ error: 'Materi not found' });
        }
        res.json(materi);
    } catch (error) {
        console.error('Error getting materi:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Add new materi
async function addMateri(req, res) {
    try {
        const { subject, title, content } = req.body;
        if (!subject || !title || !content) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = await connectDB();
        const result = await db.collection('materi').insertOne({
            subject,
            title,
            content,
            createdAt: new Date()
        });

        res.status(201).json({
            message: 'Materi added successfully',
            id: result.insertedId
        });
    } catch (error) {
        console.error('Error adding materi:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Update materi
async function updateMateri(req, res) {
    try {
        const { id } = req.params;
        const { subject, title, content } = req.body;
        
        const db = await connectDB();
        const result = await db.collection('materi').updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: {
                    subject,
                    title,
                    content,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Materi not found' });
        }

        res.json({ message: 'Materi updated successfully' });
    } catch (error) {
        console.error('Error updating materi:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete materi
async function deleteMateri(req, res) {
    try {
        const { id } = req.params;
        const db = await connectDB();
        const result = await db.collection('materi').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Materi not found' });
        }

        res.json({ message: 'Materi deleted successfully' });
    } catch (error) {
        console.error('Error deleting materi:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllMateri,
    getMateriBySubject,
    addMateri,
    updateMateri,
    deleteMateri
}; 