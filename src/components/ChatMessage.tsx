'use client';

import { ChatMessage as ChatMessageType } from '@/types/chatbot';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  isTyping?: boolean;
}

export default function ChatMessage({ message, isTyping = false }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 mb-6 animate-fade-in ${message.isBot ? 'justify-start' : 'justify-end'}`}>
      {message.isBot && (
        <div className="flex-shrink-0 w-10 h-10 zurich-gradient rounded-full flex items-center justify-center shadow-md">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-xs sm:max-w-md lg:max-w-lg px-5 py-4 rounded-2xl shadow-md ${
        message.isBot 
          ? 'bg-white text-gray-800 border-2 border-gray-200' 
          : 'zurich-gradient text-white'
      }`}>
        <p className={`text-sm leading-relaxed font-medium ${
          message.isBot ? 'text-gray-800' : 'text-white'
        }`}>
          {isTyping ? (
            <span className="inline-flex items-center text-blue-600">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse delay-100 ml-1">●</span>
              <span className="animate-pulse delay-200 ml-1">●</span>
            </span>
          ) : (
            message.text
          )}
        </p>
      </div>
      
      {!message.isBot && (
        <div className="flex-shrink-0 w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center shadow-md">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
} 