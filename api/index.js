const express = require('express');
const cors = require('cors');
const materiController = require('./materi');
const soalController = require('./soal');
const { cleanup } = require('./db');

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['https://my-projec12213-4jr46u71e-riyan-maulanas-projects.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Add cleanup middleware
app.use(async (req, res, next) => {
  res.on('finish', async () => {
    try {
      await cleanup();
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested endpoint ${req.method} ${req.url} does not exist`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.name || 'Internal Server Error',
    message: err.message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 