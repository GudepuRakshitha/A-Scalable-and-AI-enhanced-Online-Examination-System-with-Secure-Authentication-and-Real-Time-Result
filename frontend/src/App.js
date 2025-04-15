import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TakeExam from './pages/TakeExam';
import Results from './pages/Results';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/student" element={<StudentDashboard />} />
                    <Route path="/exam/:id" element={<TakeExam />} />
                    <Route path="/results" element={<Results />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;