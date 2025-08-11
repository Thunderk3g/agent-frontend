import React, { useState, useRef, useEffect } from 'react';

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
    <div className="input-area">
      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="message-input"
              rows={1}
              disabled={isLoading}
            />
            
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className={`send-button ${message.trim() && !isLoading ? 'active' : 'disabled'}`}
              title="Send message"
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <span className="material-icons">send</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputArea;