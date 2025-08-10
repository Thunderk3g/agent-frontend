import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const InputArea: React.FC<InputAreaProps> = ({ 
  onSendMessage, 
  isLoading, 
  placeholder = "Ask me anything about eTouch II insurance..."
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  return (
    <div className="border-t bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          {/* Attachment button (placeholder) */}
          <button
            type="button"
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center text-gray-600"
            title="Attach documents"
          >
            <Paperclip size={18} />
          </button>

          {/* Message input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[48px] max-h-[120px]"
              rows={1}
              disabled={isLoading}
            />
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`flex-shrink-0 w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center ${
              message.trim() && !isLoading
                ? 'bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title="Send message"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>

        {/* Helper text */}
        <div className="mt-2 text-xs text-gray-500 text-center flex items-center justify-center gap-4">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span className="w-px h-4 bg-gray-300" />
          <span>{message.length}/1000</span>
        </div>
      </div>
    </div>
  );
};

export default InputArea;