'use client';

import { ChatMessage } from '@/types/chatbot';

interface ChatMessageProps {
  message: ChatMessage;
}

export default function ChatMessageComponent({ message }: ChatMessageProps) {
  if (message.isBot) {
    return (
      <div className="flex items-start gap-3 mb-6 animate-slide-in">
        {/* Bot Avatar */}
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#001c3d' }}
        >
          <span className="text-white text-sm">🤖</span>
        </div>
        
        {/* Bot Message Bubble */}
        <div 
          className="max-w-[80%] px-4 py-3 rounded-xl shadow-sm"
          style={{ 
            backgroundColor: '#f2f6f9',
            borderBottomLeftRadius: '4px'
          }}
        >
          <p className="text-gray-800 text-sm leading-relaxed">
            {message.text}
          </p>
        </div>
      </div>
    );
  }

  // User Message
  return (
    <div className="flex items-start gap-3 mb-6 justify-end animate-slide-in">
      {/* User Message Bubble */}
      <div className="max-w-[80%] flex items-center gap-2">
        <div 
          className="px-4 py-3 rounded-xl shadow-sm bg-white border border-gray-100"
          style={{ borderBottomRightRadius: '4px' }}
        >
          <p className="text-gray-800 text-sm leading-relaxed">
            {message.text}
          </p>
        </div>
        
        {/* User Badge */}
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold text-white"
          style={{ backgroundColor: '#0076a8' }}
        >
          Sie
        </div>
      </div>
    </div>
  );
} 