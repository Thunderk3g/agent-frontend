import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex max-w-[80%] gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-700">
          <Bot size={18} />
        </div>

        {/* Typing Animation */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
            <span className="text-base text-gray-500 dark:text-gray-400 ml-2">EtouchAgent is typing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;