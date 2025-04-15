import React, { useState } from 'react';
import { createExam, generateQuestions } from '../api';

function ExamForm({ onExamCreated }) {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('Physics');
    const [numQuestions, setNumQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState('Medium');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await createExam(title, token);
            const examId = response.data._id;
            await generateQuestions(examId, subject, numQuestions, difficulty, token);
            setTitle('');
            setSubject('Physics');
            setNumQuestions(5);
            setDifficulty('Medium');
            onExamCreated();
            alert('Exam created and questions generated successfully!');
        } catch (error) {
            console.error('Error creating exam:', error);
            alert('Failed to create exam or generate questions.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Create New Exam</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter exam title"
                    required
                />
                <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                </select>
                <input
                    type="number"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Math.max(1, e.target.value))}
                    min="1"
                    placeholder="Number of questions"
                    required
                />
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create & Generate Questions'}
                </button>
            </form>
        </div>
    );
}

export default ExamForm;