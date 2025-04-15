const Result = require('../models/Result');
const Exam = require('../models/Exam');

exports.submitExam = async (req, res) => {
    const { examId, answers } = req.body;
    try {
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        let score = 0;
        exam.questions.forEach((question, index) => {
            if (question.correctAnswer === answers[index]) {
                score++;
            }
        });

        const result = new Result({
            student: req.user.id,
            exam: examId,
            score,
            answers
        });
        await result.save(); // Fix: Save result, not exam
        req.io.emit('examSubmitted', {
            studentId: req.user.id,
            examId,
            score
        });

        res.json({ result, message: 'Exam submitted successfully' });
    } catch (error) {
        console.error('Error submitting exam:', error);
        res.status(400).json({ message: 'Error submitting exam', error: error.message });
    }
};

exports.getResults = async (req, res) => {
    try {
        const results = await Result.find({ student: req.user.id })
            .populate('exam', 'title questions') // Ensure questions are populated
            .populate('student', 'name email');
        res.json(results);
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ message: 'Error fetching results', error: error.message });
    }
};