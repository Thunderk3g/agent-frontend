import { Paperclip, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const InputArea: React.FC<InputAreaProps> = ({
  onSendMessage,
  isLoading,
  placeholder = "Ask me anything about eTouch II insurance...",
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [message]);

  return (
    <div className="border-t border-gray-200 bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          {/* Attachment button (placeholder) */}
          <button
            type="button"
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-600"
            title="Attach documents"
          >
            <Paperclip size={16} />
          </button>

          {/* Message input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all min-h-[48px] max-h-[120px] text-sm"
              rows={1}
              disabled={isLoading}
            />
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`flex-shrink-0 w-10 h-10 rounded-full transition-all flex items-center justify-center ${
              message.trim() && !isLoading
                ? "bg-gray-900 hover:bg-gray-800 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            title="Send message"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>

        {/* Helper text */}
        <div className="mt-3 text-xs text-gray-500 text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default InputArea;
