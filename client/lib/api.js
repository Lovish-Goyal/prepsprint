import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
const addAuthToken = (config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
};

// Add response handlers for AI credits exceeded and 401 unauth
const handleResponse = (response) => {
  if (response.data?.warning && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ai-credits-exceeded', { detail: response.data.warning }));
  }
  return response;
};

const handleError = (error) => {
  if (error.response?.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    // Auto redirect if we're not on public pages or auth pages
    const publicPages = ['/', '/about', '/contact', '/support'];
    const path = window.location.pathname;
    if (!publicPages.includes(path) && !path.startsWith('/auth')) {
      window.location.href = '/auth/login';
    }
  }
  
  const isCreditErr = error.response?.status === 402 || 
    (error.response?.data?.detail && (
      error.response.data.detail.toLowerCase().includes("credits") ||
      error.response.data.detail.toLowerCase().includes("tokens") ||
      error.response.data.detail.toLowerCase().includes("max_tokens")
    ));
    
  if (isCreditErr && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ai-credits-exceeded', { 
      detail: error.response?.data?.detail || "AI Provider Credits Exceeded: Please recharge your OpenRouter credit balance to continue using live AI features."
    }));
  }
  return Promise.reject(error);
};

// Setup interceptors on both client and global axios instances
apiClient.interceptors.request.use(addAuthToken);
axios.interceptors.request.use(addAuthToken);

apiClient.interceptors.response.use(handleResponse, handleError);
axios.interceptors.response.use(handleResponse, handleError);

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  forgotPassword: (data) => apiClient.post('/auth/forgot-password', data),
  resetPassword: (data) => apiClient.post('/auth/reset-password', data),
};

// User APIs
export const userAPI = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (data) => apiClient.put('/user/profile', data),
  changePassword: (data) => apiClient.post('/user/change-password', data),
  deleteAccount: () => apiClient.delete('/user/delete-account'),
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

// AI Mentor APIs
export const aiMentorAPI = {
  getSessions: () => apiClient.get('/ai-mentor/sessions'),
  createSession: () => apiClient.post('/ai-mentor/sessions'),
  sendSessionMessage: (sessionId, data) => apiClient.post(`/ai-mentor/sessions/${sessionId}/message`, data),
};

export default apiClient;
