const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { submitExam, getResults } = require('../controllers/resultController');

router.post('/submit', authMiddleware, submitExam);
router.get('/', authMiddleware, getResults);

module.exports = router;