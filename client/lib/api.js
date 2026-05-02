import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
};

// User APIs
export const userAPI = {
  getProfile: () => apiClient.get('/user/profile'),
};

// Roadmap APIs
export const roadmapAPI = {
  getRoadmap: () => apiClient.get('/roadmap'),
  createRoadmap: (data) => apiClient.post('/roadmap', data),
  updateRoadmap: (id, data) => apiClient.put(`/roadmap/${id}`, data),
};

// Skills APIs
export const skillsAPI = {
  getSkills: () => apiClient.get('/skills'),
  createSkill: (data) => apiClient.post('/skills', data),
  updateSkill: (id, data) => apiClient.put(`/skills/${id}`, data),
};

// Resume APIs
export const resumeAPI = {
  analyze: (text) => apiClient.post('/resume/analyze', { text }),
  suggestions: (resume_id) => apiClient.get(`/resume/${resume_id}/suggestions`),
};

// Interview APIs
export const interviewAPI = {
  getQuestions: (difficulty) => apiClient.get('/interview/questions', { params: { difficulty } }),
  submitFeedback: (data) => apiClient.post('/interview/feedback', data),
};

export default apiClient;
