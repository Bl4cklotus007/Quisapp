const express = require('express');
const cors = require('cors');
const materiController = require('./materi');
const soalController = require('./soal');

const app = express();

// CORS configuration
const corsOptions = {
  origin: '*', // Allow all origins for now, we can restrict later
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Materi routes
app.get('/api/materi', materiController.getAllMateri);
app.get('/api/materi/:subject', materiController.getMateriBySubject);
app.post('/api/materi', materiController.addMateri);
app.put('/api/materi/:id', materiController.updateMateri);
app.delete('/api/materi/:id', materiController.deleteMateri);

// Soal routes
app.get('/api/soal', soalController.getAllQuestions);
app.get('/api/soal/:subject', soalController.getQuestionsBySubject);
app.post('/api/soal', soalController.addQuestion);
app.put('/api/soal/:id', soalController.updateQuestion);
app.delete('/api/soal/:id', soalController.deleteQuestion);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// For Vercel Serverless Functions
module.exports = app; 