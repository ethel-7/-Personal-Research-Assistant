import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { SendIcon, LoadingSpinner } from './icons';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (input: string) => void;
  isLoading: boolean;
  loadingMessage: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  loadingMessage,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      {/* Chat Area */}
      <div
        className="flex-1 overflow-y-auto px-6 py-6 space-y-6 
        backdrop-blur-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <h2 className="text-2xl font-semibold text-white mb-2">
              👋 Welcome!
            </h2>
            <p className="max-w-md text-sm text-gray-400">
              Start by asking a question about your documents or shipments.  
              This chat is powered by AI to help you understand your data.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-center py-4 animate-pulse">
            <div className="flex items-center space-x-3 text-gray-400">
              <LoadingSpinner className="h-5 w-5 text-cyan-500 animate-spin" />
              <span>{loadingMessage}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className="p-4 border-t border-gray-800 
        bg-gray-900/60 backdrop-blur-md sticky bottom-0
        shadow-[0_-2px_15px_rgba(0,0,0,0.25)]"
      >
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 w-full"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your shipment or documents..."
              className="w-full p-3 pl-4 pr-12 rounded-xl bg-gray-800/80 text-white
              placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 
              border border-gray-700 transition-all duration-200 hover:border-gray-500"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-2.5 text-gray-500">
              <SendIcon className="h-5 w-5 opacity-50" />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 
            text-white rounded-xl shadow-md hover:shadow-cyan-500/30 
            hover:scale-105 transition-all duration-200 disabled:opacity-40 
            disabled:hover:scale-100"
          >
            <SendIcon className="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  );
};
