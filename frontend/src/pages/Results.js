import React, { useState, useEffect } from 'react';
import { getResults } from '../api';

function Results() {
    const [results, setResults] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchResults = async () => {
            if (!token) {
                alert('Please log in to view results.');
                return;
            }
            try {
                const response = await getResults(token);
                console.log('Results response:', response.data); // Debug
                setResults(response.data || []);
            } catch (error) {
                console.error('Error fetching results:', error.response?.data || error.message);
                alert(`Failed to fetch results: ${error.response?.data?.message || 'Server error'}`);
            }
        };
        fetchResults();
    }, [token]);

    return (
        <div>
            <h1>Your Results</h1>
            {results.length === 0 ? (
                <p>No results available yet.</p>
            ) : (
                results.map(result => (
                    <div key={result._id} className="card">
                        <h3>{result.exam?.title || 'Untitled Exam'}</h3>
                        <p>Score: {result.score} / {result.exam?.questions?.length || 'N/A'}</p>
                        <p>Completed: {new Date(result.completedAt).toLocaleString()}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default Results;