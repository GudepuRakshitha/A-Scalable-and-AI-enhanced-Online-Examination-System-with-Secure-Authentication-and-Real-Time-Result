import React, { useState, useEffect } from 'react';
import ExamList from '../components/ExamList';
import { getExams } from '../api';

function StudentDashboard() {
    const [exams, setExams] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await getExams(token);
                setExams(response.data);
            } catch (error) {
                console.error('Error fetching exams:', error);
                alert('Failed to fetch exams.');
            }
        };
        fetchExams();
    }, [token]); // Add token

    return (
        <div>
            <h1>Student Dashboard</h1>
            <ExamList exams={exams} />
        </div>
    );
}

export default StudentDashboard;