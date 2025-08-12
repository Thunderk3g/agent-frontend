import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, ChatResponse } from '../types/chat';
import { chatAPI } from '../services/api';
import { useStore } from '../store/useStore';
import { ResponseParser } from '../utils/responseParser';

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
  const { sessionId, setSessionId, setSessionState, loadFromBackend } = useStore();
  
  const [state, setState] = useState<UseChatState>({
    messages: [],
    isLoading: false,
    error: null,
    sessionId: sessionId || null,
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
      
      // Update unified store
      setSessionId(sessionData.session_id);
      if ((sessionData as any).current_state) {
        setSessionState((sessionData as any).current_state);
      }

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
  }, [addMessage, setSessionId, setSessionState]);

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
      // LLM-first: send the raw turn to the agent; backend/LLM handles orchestration
      const response: ChatResponse = await chatAPI.sendTurn(message || 'Form submitted', state.sessionId || undefined);

      // Parse structured JSON if backend returns JSON-like content in message
      const content = response.message;
      const parseResult = ResponseParser.parseResponse(content);
      
      let display = parseResult.text;
      let storeUpdate = parseResult.storeUpdate;
      
      // Extract quote data if available
      const quoteData = ResponseParser.extractQuoteData(response);
      if (quoteData) {
        console.log('Quote data extracted:', quoteData);
        // Could display quote information in a special UI component
      }

      // Update session ID if this was the first message
      if (!state.sessionId) {
        setState(prev => ({ ...prev, sessionId: response.session_id }));
        setSessionId(response.session_id);
      }
      
      // Load/sync form data with backend session
      if (response.session_id) {
        await loadFromBackend(response.session_id);
      }

      // Add bot response
      addMessage({
        type: 'bot',
        content: display,
        timestamp: new Date(),
        actions: response.actions
      });

      // Apply data store mapping to persist in local state (for now just keep in memory)
      if (storeUpdate) {
        // Persist to backend via agent turn already; here we could also mirror to localStorage if needed
        // In future: lift to a dedicated store context
      }

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
  }, [state.sessionId, addMessage, startNewSession, loadFromBackend, setSessionId]);

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