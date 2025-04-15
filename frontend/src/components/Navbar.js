import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div>
                <Link to="/">Online Exam System</Link>
            </div>
            <div>
                {token && role === 'admin' && <Link to="/admin">Admin Dashboard</Link>}
                {token && role === 'student' && <Link to="/student">Student Dashboard</Link>}
                {token && <Link to="/results">Results</Link>}
                {token ? <button onClick={handleLogout}>Logout</button> : <Link to="/register">Register</Link>}
            </div>
        </nav>
    );
}

export default Navbar;