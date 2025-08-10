import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, ChatRequest, ChatResponse } from '../types/chat';
import { chatAPI } from '../services/api';

interface UseChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
  currentState: string;
  dataCollection: any;
}

interface UseChatActions {
  startNewSession: () => Promise<void>;
  sendMessage: (message: string, formData?: Record<string, any>, actionData?: Record<string, any>) => Promise<void>;
  clearError: () => void;
  resetChat: () => Promise<void>;
}

export const useChat = (): UseChatState & UseChatActions => {
  const [state, setState] = useState<UseChatState>({
    messages: [],
    isLoading: false,
    error: null,
    sessionId: null,
    currentState: '',
    dataCollection: { collected: [], missing: [], completion_percentage: 0 }
  });

  const messageIdRef = useRef(0);

  const generateMessageId = () => {
    messageIdRef.current += 1;
    return `msg_${Date.now()}_${messageIdRef.current}`;
  };

  const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateMessageId(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
  }, []);

  const startNewSession = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const sessionData = await chatAPI.startSession();
      
      setState(prev => ({
        ...prev,
        sessionId: sessionData.session_id,
        isLoading: false,
        messages: []
      }));

      // Add initial message if provided
      if (sessionData.initial_message) {
        addMessage({
          type: 'bot',
          content: sessionData.initial_message,
          timestamp: new Date(),
          actions: sessionData.initial_actions || []
        });
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to start session'
      }));
    }
  }, [addMessage]);

  const sendMessage = useCallback(async (
    message: string, 
    formData?: Record<string, any>, 
    actionData?: Record<string, any>
  ) => {
    if (!state.sessionId && !formData && !actionData) {
      // Start new session if none exists and this is a regular message
      await startNewSession();
      return;
    }

    // Add user message to chat (unless it's just form/action data)
    if (message.trim()) {
      addMessage({
        type: 'user',
        content: message,
        timestamp: new Date()
      });
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const request: ChatRequest = {
        session_id: state.sessionId || undefined,
        message: message || 'Form submitted',
        form_data: formData,
        action_data: actionData
      };

      const response: ChatResponse = await chatAPI.sendMessage(request);

      // Update session ID if this was the first message
      if (!state.sessionId) {
        setState(prev => ({ ...prev, sessionId: response.session_id }));
      }

      // Add bot response
      addMessage({
        type: 'bot',
        content: response.message,
        timestamp: new Date(),
        actions: response.actions
      });

      setState(prev => ({
        ...prev,
        isLoading: false,
        currentState: response.current_state,
        dataCollection: response.data_collection
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to send message'
      }));
    }
  }, [state.sessionId, addMessage, startNewSession]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const resetChat = useCallback(async () => {
    if (state.sessionId) {
      try {
        await chatAPI.resetSession(state.sessionId);
      } catch (error) {
        console.error('Failed to reset session:', error);
      }
    }

    setState({
      messages: [],
      isLoading: false,
      error: null,
      sessionId: null,
      currentState: '',
      dataCollection: { collected: [], missing: [], completion_percentage: 0 }
    });
  }, [state.sessionId]);

  // Auto-start session on mount
  useEffect(() => {
    if (!state.sessionId && state.messages.length === 0) {
      startNewSession();
    }
  }, [state.sessionId, state.messages.length, startNewSession]);

  return {
    ...state,
    startNewSession,
    sendMessage,
    clearError,
    resetChat
  };
};