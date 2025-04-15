import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitExam } from '../api';

function Exam({ exam }) {
    const [answers, setAnswers] = useState(Array(exam.questions.length).fill(''));
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await submitExam(exam._id, answers, token);
            navigate('/results');
            alert('Exam submitted successfully!');
        } catch (error) {
            console.error('Error submitting exam:', error);
            alert('Failed to submit exam. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3>{exam.title}</h3>
            <form onSubmit={handleSubmit}>
                {exam.questions.map((q, index) => (
                    <div key={q._id} className="exam-question">
                        <p>{index + 1}. {q.questionText}</p>
                        {q.options.map((option, i) => (
                            <label key={i}>
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value={option}
                                    checked={answers[index] === option}
                                    onChange={() => handleChange(index, option)}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                ))}
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Exam'}
                </button>
            </form>
        </div>
    );
}

export default Exam;