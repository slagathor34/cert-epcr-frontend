import axios from 'axios';
import { EPCRData } from '../types/epcr';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const epcrAPI = {
  // Get all ePCRs for the current user
  getAll: async (): Promise<EPCRData[]> => {
    const response = await api.get('/epcr');
    return response.data;
  },

  // Get a specific ePCR by ID
  getById: async (id: string): Promise<EPCRData> => {
    const response = await api.get(`/epcr/${id}`);
    return response.data;
  },

  // Create a new ePCR
  create: async (data: Omit<EPCRData, 'id' | 'createdAt' | 'updatedAt'>): Promise<EPCRData> => {
    const response = await api.post('/epcr', data);
    return response.data;
  },

  // Update an existing ePCR
  update: async (id: string, data: Partial<EPCRData>): Promise<EPCRData> => {
    const response = await api.put(`/epcr/${id}`, data);
    return response.data;
  },

  // Save draft (auto-save functionality)
  saveDraft: async (id: string, data: Partial<EPCRData>): Promise<EPCRData> => {
    const response = await api.patch(`/epcr/${id}/draft`, data);
    return response.data;
  },

  // Submit ePCR for approval
  submit: async (id: string): Promise<EPCRData> => {
    const response = await api.post(`/epcr/${id}/submit`);
    return response.data;
  },

  // Delete an ePCR
  delete: async (id: string): Promise<void> => {
    await api.delete(`/epcr/${id}`);
  },

  // Get ePCR templates
  getTemplates: async (): Promise<any[]> => {
    const response = await api.get('/epcr/templates');
    return response.data;
  },

  // Export ePCR as PDF
  exportPDF: async (id: string): Promise<Blob> => {
    const response = await api.get(`/epcr/${id}/export/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export const authAPI = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  refresh: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

export default api;