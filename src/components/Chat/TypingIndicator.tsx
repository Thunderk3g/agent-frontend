import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex max-w-[80%] gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-green-100 text-green-700 border-2 border-green-200">
          <Bot size={16} />
        </div>

        {/* Typing Animation */}
        <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
            <span className="text-sm text-gray-500 ml-2">Abhinav is typing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;