import React, { useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import InputArea from './InputArea';
import RecommendedPlans from './RecommendedPlans';
import ProcessSteps from './ProcessSteps';
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
    <div className="chat-interface">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-header-content">
          <div className="header-left">
            <h1 className="chat-title">eTouch-II AI Agent</h1>
          </div>
          <div className="header-right">
            <button className="header-btn secondary">
              <span className="material-icons">description</span>
              Report
            </button>
            <button className="header-btn primary">
              <span className="material-icons">share</span>
              Share
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="chat-main">
        <div className="chat-content">
          
          {/* Welcome State */}
          {messages.length === 0 && !isLoading && (
            <div className="welcome-state">
              <h2 className="welcome-question">How do I choose the best health plan for my client?</h2>
              
              {/* Recommended Plans */}
              <RecommendedPlans />
              
              {/* Process Steps */}
              <div className="process-steps-section">
                <ProcessSteps />
              </div>
            </div>
          )}

          {/* Conversation State */}
          {(messages.length > 0 || isLoading) && (
            <div className="conversation-state">
              {/* Progress indicator */}
              {dataCollection.completion_percentage > 0 && (
                <div className="progress-indicator">
                  <div className="progress-content">
                    <Shield className="progress-icon" />
                    <span className="progress-label">Application Progress</span>
                  </div>
                  <div className="progress-right">
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${getProgressColor(dataCollection.completion_percentage)}`}
                        style={{ width: `${dataCollection.completion_percentage}%` }}
                      ></div>
                    </div>
                    <span className="progress-percentage">{dataCollection.completion_percentage}%</span>
                    <button
                      onClick={resetChat}
                      className="progress-reset"
                      title="Start over"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="error-container">
                  <div className="error-content">
                    <div className="error-left">
                      <AlertTriangle className="error-icon" />
                      <p className="error-message">{error}</p>
                    </div>
                    <button
                      onClick={clearError}
                      className="error-dismiss"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="messages-container">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onActionSubmit={handleActionSubmit}
                  />
                ))}

                {/* Typing Indicator */}
                {isLoading && <TypingIndicator />}
              </div>

              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area - Always at bottom */}
      <div className="chat-input-section">
        <InputArea
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder={
            messages.length === 0 
              ? "Ask something..."
              : "Continue the conversation..."
          }
        />
      </div>

      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && sessionId && (
        <div className="dev-info">
          Session: {sessionId.slice(-8)} | State: {currentState} | Messages: {messages.length}
        </div>
      )}
    </div>
  );
};

export default ChatInterface;