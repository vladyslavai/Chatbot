'use client';

import { ChatMessage } from '@/types/chatbot';

interface ChatMessageProps {
  message: ChatMessage;
}

export default function ChatMessageComponent({ message }: ChatMessageProps) {
  return (
    <div className={`message ${message.isBot ? 'bot' : 'user'}`}>
      {message.isBot && (
        <div className="avatar bot">
          KI
        </div>
      )}
      
      <div className="message-content">
        {message.text}
      </div>
      
      {!message.isBot && (
        <div className="avatar user">
          Du
        </div>
      )}
    </div>
  );
} 