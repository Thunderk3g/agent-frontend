import axios from 'axios';
import { ChatRequest, ChatResponse, SessionInfo } from '../types/chat';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 503) {
      throw new Error('Service temporarily unavailable. Please try again in a moment.');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    throw error;
  }
);

export const chatAPI = {
  // Start a new chat session
  startSession: async (): Promise<{ session_id: string; initial_message?: string; initial_actions?: any[] }> => {
    const response = await apiClient.post('/api/chat/session/start');
    return response.data;
  },

  // Send a chat message
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post('/api/chat/message', request);
    return response.data;
  },

  // Get session information
  getSessionInfo: async (sessionId: string): Promise<SessionInfo> => {
    const response = await apiClient.get(`/api/chat/session/${sessionId}`);
    return response.data;
  },

  // Get conversation history
  getConversationHistory: async (sessionId: string): Promise<any> => {
    const response = await apiClient.get(`/api/chat/session/${sessionId}/history`);
    return response.data;
  },

  // Reset session
  resetSession: async (sessionId: string): Promise<{ message: string }> => {
    const response = await apiClient.post(`/api/chat/session/${sessionId}/reset`);
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; chat_service: string; ollama_service: string }> => {
    const response = await apiClient.get('/api/chat/health');
    return response.data;
  },

  // Upload document
  uploadDocument: async (file: File, documentType: string, sessionId: string): Promise<{ file_path: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    formData.append('session_id', sessionId);

    // Let Axios set Content-Type with correct boundary
    const response = await apiClient.post('/api/documents/upload', formData);
    return response.data;
  },
};

export default apiClient;