import { Bot, User } from "lucide-react";
import React from "react";
import { ChatMessage } from "../../types/chat";
import ActionRenderer from "./ActionRenderer";

interface MessageBubbleProps {
  message: ChatMessage;
  onActionSubmit: (actionData: Record<string, any>) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onActionSubmit,
}) => {
  const isUser = message.type === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div
        className={`flex max-w-[85%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        } gap-3`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          {isUser ? <User size={14} /> : <Bot size={14} />}
        </div>

        {/* Message Content */}
        <div className="flex flex-col gap-2">
          <div
            className={`rounded-lg px-4 py-3 ${
              isUser ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
            }`}
          >
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
            <div className="mt-3">
              <ActionRenderer
                actions={message.actions}
                onSubmit={onActionSubmit}
              />
            </div>
          )}

          {/* Timestamp */}
          <div
            className={`text-xs text-gray-400 px-1 ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
