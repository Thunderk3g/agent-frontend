import { Bot } from "lucide-react";
import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex max-w-[85%] gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-700">
          <Bot size={14} />
        </div>

        {/* Typing Animation */}
        <div className="bg-gray-100 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
            <span className="text-sm text-gray-600 ml-1">
              Rajesh is typing...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
