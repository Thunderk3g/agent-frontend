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
    <div className="flex flex-col h-screen bg-white">
      {/* Modern Welcome/Chat Container */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-6 py-8">
          
          {/* Welcome State */}
          {messages.length === 0 && !isLoading && (
            <div className="text-center">
              {/* Main Greeting */}
              <div className="mb-8">
                <h1 className="text-4xl font-light text-gray-900 mb-4">
                  Hi there, <span className="text-purple-600 font-medium">John</span>
                </h1>
                <h2 className="text-4xl font-light text-gray-700 mb-6">
                  What would you like to <span className="text-blue-600 font-medium">know?</span>
                </h2>
                <p className="text-gray-500 text-lg mb-8">
                  I'm Rajesh, your AI insurance agent. Let's find the perfect life insurance plan for you.
                </p>
              </div>

              {/* Quick Start Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <button
                  onClick={() => handleSendMessage("I want to know about life insurance options")}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">Explore Insurance Plans</h3>
                  <p className="text-xs text-gray-600">Learn about eTouch II variants and coverage</p>
                </button>

                <button
                  onClick={() => handleSendMessage("I want to get a quote for life insurance")}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-green-600 text-sm font-semibold">₹</span>
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">Get a Quote</h3>
                  <p className="text-xs text-gray-600">Calculate premium for your needs</p>
                </button>

                <button
                  onClick={() => handleSendMessage("What documents do I need for life insurance?")}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-purple-600 text-sm">📄</span>
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">Documentation Help</h3>
                  <p className="text-xs text-gray-600">Required documents and KYC process</p>
                </button>

                <button
                  onClick={() => handleSendMessage("How does the claim process work?")}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-orange-600 text-sm">⚡</span>
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">Claims Information</h3>
                  <p className="text-xs text-gray-600">How claims work and processing</p>
                </button>
              </div>

              {/* Refresh Prompts */}
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <RefreshCw size={16} />
                Refresh Prompts
              </button>
            </div>
          )}

          {/* Conversation State */}
          {(messages.length > 0 || isLoading) && (
            <div className="space-y-6">
              {/* Progress indicator */}
              {dataCollection.completion_percentage > 0 && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Application Progress</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(dataCollection.completion_percentage)}`}
                        style={{ width: `${dataCollection.completion_percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{dataCollection.completion_percentage}%</span>
                    <button
                      onClick={resetChat}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      title="Start over"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                    <button
                      onClick={clearError}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="space-y-6">
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

      {/* Modern Input Area - Always at bottom */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto p-6">
          <InputArea
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder={
              messages.length === 0 
                ? "Ask whatever you want..."
                : "Continue the conversation..."
            }
          />
        </div>
      </div>

      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && sessionId && (
        <div className="bg-gray-900 text-gray-300 text-xs p-2 text-center">
          Session: {sessionId.slice(-8)} | State: {currentState} | Messages: {messages.length}
        </div>
      )}
    </div>
  );
};

export default ChatInterface;