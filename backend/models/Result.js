const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    score: { type: Number, required: true },
    answers: [{ type: String }],
    completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Result || mongoose.model('Result', resultSchema);