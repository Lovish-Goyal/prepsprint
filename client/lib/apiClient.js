'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// API Client with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
};

// User API
export const userAPI = {
  getProfile: () => apiClient.get('/user/profile'),
};

// Skills API
export const skillsAPI = {
  getSkills: () => apiClient.get('/skills'),
  createSkill: (data) => apiClient.post('/skills', data),
  updateSkill: (id, data) => apiClient.put(`/skills/${id}`, data),
  deleteSkill: (id) => apiClient.delete(`/skills/${id}`),
};

// Roadmap API
export const roadmapAPI = {
  getRoadmap: () => apiClient.get('/roadmap'),
  createRoadmap: (data) => apiClient.post('/roadmap', data),
  updateRoadmap: (id, data) => apiClient.put(`/roadmap/${id}`, data),
};

// Resume API
export const resumeAPI = {
  analyze: (text) => apiClient.post('/resume/analyze', { text }),
  getSuggestions: (id) => apiClient.get(`/resume/${id}/suggestions`),
  create: (data) => apiClient.post('/resume', data),
};

// Interview API
export const interviewAPI = {
  getQuestions: (difficulty = 'medium') =>
    apiClient.get('/interview/questions', { params: { difficulty } }),
  submitFeedback: (data) => apiClient.post('/interview/feedback', data),
  getHistory: () => apiClient.get('/interview/history'),
};

// AI Mentor API
export const aiMentorAPI = {
  askQuestion: (question) => apiClient.post('/ai-mentor/', { question }),
};

// Skill Tracker API
export const skillTrackerAPI = {
  submit: (data) => apiClient.post('/skill-tracker/', data),
  getHistory: () => apiClient.get('/skill-tracker/history'),
  getEntry: (id) => apiClient.get(`/skill-tracker/${id}`),
};

// Technologies API
export const technologiesAPI = {
  getAll: (category = null) =>
    category
      ? apiClient.get('/technologies/', { params: { category } })
      : apiClient.get('/technologies/'),
  getCategories: () => apiClient.get('/technologies/categories'),
  getById: (id) => apiClient.get(`/technologies/${id}`),
};

// Custom hooks for data fetching

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiFunction();
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};

export const useUserProfile = () => {
  return useApi(() => userAPI.getProfile());
};

export const useSkills = () => {
  return useApi(() => skillsAPI.getSkills());
};

export const useRoadmap = () => {
  return useApi(() => roadmapAPI.getRoadmap());
};

export const useInterviewHistory = () => {
  return useApi(() => interviewAPI.getHistory());
};

export default apiClient;
