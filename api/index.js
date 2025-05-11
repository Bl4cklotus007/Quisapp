const express = require('express');
const router = express.Router();
const materiController = require('./materi');
const soalController = require('./soal');

// Materi routes
router.get('/materi', materiController.getAllMateri);
router.get('/materi/:subject', materiController.getMateriBySubject);
router.post('/materi', materiController.addMateri);
router.put('/materi/:id', materiController.updateMateri);
router.delete('/materi/:id', materiController.deleteMateri);

// Soal routes
router.get('/soal', soalController.getAllQuestions);
router.get('/soal/:subject', soalController.getQuestionsBySubject);
router.post('/soal', soalController.addQuestion);
router.put('/soal/:id', soalController.updateQuestion);
router.delete('/soal/:id', soalController.deleteQuestion);

module.exports = router; 