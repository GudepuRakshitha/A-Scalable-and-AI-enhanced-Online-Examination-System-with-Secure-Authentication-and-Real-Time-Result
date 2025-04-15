const Exam = require('../models/Exam');
const { generateExamQuestions } = require('../gemini');

exports.createExam = async (req, res) => {
    const { title, questions } = req.body;
    try {
        const exam = new Exam({
            title,
            questions: questions || [],
            createdBy: req.user.id
        });
        await exam.save();
        res.status(201).json(exam);
    } catch (error) {
        res.status(400).json({ message: 'Error creating exam', error: error.message });
    }
};

exports.getExams = async (req, res) => {
    try {
        const exams = await Exam.find().populate('createdBy', 'name email');
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exams', error: error.message });
    }
};

exports.getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exam', error: error.message });
    }
};

exports.generateQuestions = async (req, res) => {
    const { examId, prompt } = req.body;
    try {
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        if (exam.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const dummyQuestions = [
            {
                questionText: "What is the acceleration due to gravity on Earth?",
                options: ["9.8 m/s²", "5 m/s²", "12 m/s²", "0 m/s²"],
                correctAnswer: "9.8 m/s²"
            },
            {
                questionText: "What is the unit of force?",
                options: ["Newton", "Joule", "Watt", "Pascal"],
                correctAnswer: "Newton"
            },
            {
                questionText: "What is the speed of light?",
                options: ["3x10⁸ m/s", "3x10⁶ m/s", "3x10⁴ m/s", "3x10² m/s"],
                correctAnswer: "3x10⁸ m/s"
            },
            {
                questionText: "What causes friction?",
                options: ["Surface roughness", "Gravity", "Light", "Sound"],
                correctAnswer: "Surface roughness"
            },
            {
                questionText: "What is kinetic energy proportional to?",
                options: ["Velocity squared", "Mass alone", "Height", "Time"],
                correctAnswer: "Velocity squared"
            }
        ];

        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set in .env');
            exam.questions = dummyQuestions;
            await exam.save();
            req.io.emit('questionsGenerated', { examId, questions: exam.questions });
            return res.json({ exam, message: 'Generated dummy questions due to missing API key' });
        }

        try {
            const [subject, numQuestions, difficulty] = prompt.match(/Generate (\d+) multiple-choice questions for a (\w+) level (\w+) exam./)?.slice(1) || ['Physics', 5, 'Medium'];
            const generatedText = await generateExamQuestions(subject, numQuestions, difficulty);
            if (!generatedText) throw new Error('Gemini API returned no content');

            const questions = [];
            const lines = generatedText.split('\n').filter(line => line.trim());
            let currentQuestion = null;

            lines.forEach(line => {
                if (/^\d+\./.test(line)) {
                    if (currentQuestion) questions.push(currentQuestion);
                    currentQuestion = { questionText: line.replace(/^\d+\.\s*/, ''), options: [] };
                } else if (/^[A-D]\)/.test(line)) {
                    const option = line.match(/^[A-D]\)\s*(.+)$/)[1].trim();
                    currentQuestion.options.push(option);
                } else if (line.includes('Correct Answer:')) {
                    currentQuestion.correctAnswer = line.split('Correct Answer:')[1].trim();
                }
            });
            if (currentQuestion && currentQuestion.options.length === 4) questions.push(currentQuestion);

            while (questions.length < numQuestions) {
                questions.push(dummyQuestions[questions.length]);
            }

            exam.questions = questions.slice(0, numQuestions);
            await exam.save();
            req.io.emit('questionsGenerated', { examId, questions: exam.questions });
            res.json(exam);
        } catch (error) {
            console.error('Gemini API Error:', error);
            exam.questions = dummyQuestions;
            await exam.save();
            req.io.emit('questionsGenerated', { examId, questions: exam.questions });
            res.json({ exam, message: 'Generated dummy questions due to API failure' });
        }
    } catch (error) {
        console.error('General Error in generateQuestions:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};