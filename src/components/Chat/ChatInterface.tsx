import React, { useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import InputArea from './InputArea';
import { AlertTriangle, RefreshCw, Shield } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const {
    messages,
    isLoading,
    error,
    sessionId,
    currentState,
    dataCollection,
    sendMessage,
    clearError,
    resetChat
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  const handleActionSubmit = (actionData: Record<string, any>) => {
    // Handle different action types
    const { action, ...data } = actionData;
    
    switch (action) {
      case 'form_submit':
        sendMessage('Form submitted', data.form_data);
        break;
      case 'select_variant':
        sendMessage(`I'd like to select the ${data.variant} plan`, undefined, {
          action: 'select_variant',
          variant: data.variant
        });
        break;
      case 'proceed_payment':
        sendMessage('Proceeding to payment', undefined, {
          action: 'proceed_payment',
          payment_url: data.payment_url
        });
        break;
      case 'documents_uploaded':
        sendMessage('Documents uploaded successfully', undefined, {
          action: 'documents_uploaded',
          documents: data.documents
        });
        break;
      case 'option_selected':
        sendMessage(`Selected: ${Array.isArray(data.selected_options) ? data.selected_options.join(', ') : data.selected_options}`, undefined, {
          action: 'option_selected',
          selected_options: data.selected_options
        });
        break;
      default:
        sendMessage('Action completed', undefined, actionData);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">eTouch II Insurance Agent</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Rajesh • Online</span>
                {currentState && (
                  <>
                    <span>•</span>
                    <span className="capitalize">{currentState.replace('_', ' ')}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Progress & Controls */}
          <div className="flex items-center gap-4">
            {/* Progress Indicator */}
            {dataCollection.completion_percentage > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Progress:</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(dataCollection.completion_percentage)}`}
                    style={{ width: `${dataCollection.completion_percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {dataCollection.completion_percentage}%
                </span>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={resetChat}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Start new conversation"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4 rounded-r-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600 font-medium text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Welcome Message */}
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to eTouch II Insurance
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Hi! I'm Rajesh, your personal insurance agent. I'm here to help you find the perfect 
                life insurance plan for you and your family. Let's get started!
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onActionSubmit={handleActionSubmit}
            />
          ))}

          {/* Typing Indicator */}
          {isLoading && <TypingIndicator />}

          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <InputArea
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder={
          messages.length === 0 
            ? "Hi! Ask me about eTouch II insurance plans..."
            : "Type your message..."
        }
      />

      {/* Session Info (Development) */}
      {process.env.NODE_ENV === 'development' && sessionId && (
        <div className="bg-gray-800 text-white text-xs p-2 text-center">
          Session: {sessionId} | State: {currentState} | Messages: {messages.length}
        </div>
      )}
    </div>
  );
};

export default ChatInterface;