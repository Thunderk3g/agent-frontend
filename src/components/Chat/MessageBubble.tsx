import React from 'react';
import { ChatMessage } from '../../types/chat';
import { User, Bot, Shield } from 'lucide-react';
import ActionRenderer from './ActionRenderer';

interface MessageBubbleProps {
  message: ChatMessage;
  onActionSubmit: (actionData: Record<string, any>) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onActionSubmit }) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-4`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
            : 'bg-gradient-to-br from-green-500 to-green-600 text-white'
        }`}>
          {isUser ? <User size={18} /> : <Shield size={18} />}
        </div>

        {/* Message Content */}
        <div className="flex flex-col gap-2">
          {/* Agent Name for Bot Messages */}
          {!isUser && (
            <div className="text-sm font-semibold text-gray-700 flex items-center gap-2 px-1">
              <span>Rajesh</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                Insurance Agent
              </span>
            </div>
          )}

          {/* Message Bubble */}
          <div className={`rounded-2xl px-5 py-4 relative shadow-md ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
          }`}>
            {/* Speech Bubble Tail */}
            {!isUser && (
              <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent"></div>
            )}
            {isUser && (
              <div className="absolute -right-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-blue-500 border-b-8 border-b-transparent"></div>
            )}

            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
          </div>

          {/* Actions */}
          {message.actions && message.actions.length > 0 && (
            <div className="mt-3">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <ActionRenderer actions={message.actions} onSubmit={onActionSubmit} />
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className={`text-xs text-gray-400 px-1 ${
            isUser ? 'text-right' : 'text-left'
          }`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;