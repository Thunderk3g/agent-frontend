import axios from 'axios';
import { ChatResponse, SessionInfo } from '../types/chat';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9000';

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
  // Start a new LLM-first session (via agent)
  startSession: async (): Promise<{ session_id: string; initial_message?: string; initial_actions?: any[] }> => {
    const response = await apiClient.post('/api/agent/turn', { message: 'start' });
    const data = response.data as ChatResponse & { session_id: string };
    return {
      session_id: data.session_id,
      initial_message: (data as any).message,
      initial_actions: (data as any).actions || [],
    };
  },
  // LLM-first: single turn endpoint fully orchestrated by backend
  sendTurn: async (message: string, sessionId?: string): Promise<ChatResponse> => {
    const response = await apiClient.post('/api/agent/turn', {
      session_id: sessionId,
      message,
    });
    return response.data;
  },

  // Streaming version for more realistic agent typing
  sendTurnStream: (message: string, sessionId?: string): EventSource => {
    // Use text-stream endpoint that streams plain text chunks
    const url = `${API_BASE_URL}/api/agent/turn/stream`;
    // Fallback to one-shot if EventSource cannot POST; we can polyfill with fetch stream later
    // For now, use fetch with ReadableStream in the component; keeping placeholder here.
    throw new Error('Use fetch streaming in component');
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