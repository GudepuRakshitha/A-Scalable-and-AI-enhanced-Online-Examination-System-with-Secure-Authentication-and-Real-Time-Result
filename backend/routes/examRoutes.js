const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { createExam, getExams, getExamById, generateQuestions } = require('../controllers/examController');

router.post('/', authMiddleware, adminMiddleware, createExam);
router.get('/', authMiddleware, getExams);
router.get('/:id', authMiddleware, getExamById);
router.post('/generate', authMiddleware, adminMiddleware, generateQuestions);

module.exports = router;