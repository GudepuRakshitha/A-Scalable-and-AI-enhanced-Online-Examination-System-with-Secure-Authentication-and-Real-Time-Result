import React from 'react';
import { Link } from 'react-router-dom';

function ExamList({ exams }) {
    return (
        <div>
            <h1>Available Exams</h1>
            {exams.length === 0 ? (
                <p>No exams available yet.</p>
            ) : (
                exams.map(exam => (
                    <div key={exam._id} className="card">
                        <h3>{exam.title}</h3>
                        <p>Created by: {exam.createdBy.name}</p>
                        <p>Questions: {exam.questions.length}</p>
                        <Link to={`/exam/${exam._id}`}>
                            <button>Take Exam</button>
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
}

export default ExamList;