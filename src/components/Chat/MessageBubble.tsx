import React from 'react';
import { ChatMessage } from '../../types/chat';
import { User, Bot } from 'lucide-react';
import ActionRenderer from './ActionRenderer';

interface MessageBubbleProps {
  message: ChatMessage;
  onActionSubmit: (actionData: Record<string, any>) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onActionSubmit }) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-green-100 text-green-700 border-2 border-green-200'
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Message Content */}
        <div className="flex flex-col gap-2">
          <div className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-800 rounded-bl-md'
          }`}>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
          </div>

          {/* Agent Name for Bot Messages */}
          {!isUser && (
            <div className="text-xs text-gray-500 px-1">
              Rajesh - Insurance Agent
            </div>
          )}

          {/* Actions */}
          {message.actions && message.actions.length > 0 && (
            <div className="mt-2">
              <ActionRenderer actions={message.actions} onSubmit={onActionSubmit} />
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