import React, { useState, useEffect, useCallback } from 'react';
import ExamForm from '../components/ExamForm';
import ExamList from '../components/ExamList';
import { getExams } from '../api';

function AdminDashboard() {
    const [exams, setExams] = useState([]);
    const token = localStorage.getItem('token');

    const fetchExams = useCallback(async () => {
        try {
            const response = await getExams(token);
            setExams(response.data);
        } catch (error) {
            console.error('Error fetching exams:', error);
            alert('Failed to fetch exams.');
        }
    }, [token]); // Add token as dependency

    useEffect(() => {
        fetchExams();
    }, [fetchExams]); // Include fetchExams

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <ExamForm onExamCreated={fetchExams} />
            <ExamList exams={exams} />
        </div>
    );
}

export default AdminDashboard;