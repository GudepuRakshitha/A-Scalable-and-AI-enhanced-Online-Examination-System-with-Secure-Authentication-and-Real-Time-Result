import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const login = (email, password) => 
    axios.post(`${API_URL}/auth/login`, { email, password });

export const register = (email, password, name, role) => 
    axios.post(`${API_URL}/auth/register`, { email, password, name, role });

export const createExam = (title, token) => 
    axios.post(`${API_URL}/exams`, { title }, { headers: { Authorization: `Bearer ${token}` } });

export const getExams = (token) => 
    axios.get(`${API_URL}/exams`, { headers: { Authorization: `Bearer ${token}` } });

export const generateQuestions = (examId, subject, numQuestions, difficulty, token) => 
    axios.post(`${API_URL}/exams/generate`, 
        { examId, prompt: `Generate ${numQuestions} multiple-choice questions for a ${difficulty} level ${subject} exam.` }, 
        { headers: { Authorization: `Bearer ${token}` } }
    );

export const getExamById = (id, token) => 
    axios.get(`${API_URL}/exams/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const submitExam = (examId, answers, token) => 
    axios.post(`${API_URL}/results/submit`, { examId, answers }, { headers: { Authorization: `Bearer ${token}` } });

export const getResults = (token) => 
    axios.get(`${API_URL}/results`, { headers: { Authorization: `Bearer ${token}` } });