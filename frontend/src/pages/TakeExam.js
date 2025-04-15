import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Exam from '../components/Exam';
import { getExamById } from '../api';

function TakeExam() {
    const { id } = useParams();
    const [exam, setExam] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const response = await getExamById(id, token);
                setExam(response.data);
            } catch (error) {
                console.error('Error fetching exam:', error);
                alert('Failed to load exam.');
            }
        };
        fetchExam();
    }, [id, token]); // Add token

    if (!exam) return <div className="loading">Loading exam...</div>;

    return (
        <div>
            <h1>Take Exam</h1>
            <Exam exam={exam} />
        </div>
    );
}

export default TakeExam;