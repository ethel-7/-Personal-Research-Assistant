import React from 'react';
import { motion } from 'framer-motion';
import { Message } from '../types';
import { UserIcon, BrainCircuitIcon } from './icons';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  // Format message text: bold and sources
  const formatContent = (content: string) => {
    let formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(
        /\[Source: (.*?)\]/g,
        '<span class="text-xs bg-gray-700/80 text-gray-300 rounded px-2 py-0.5 ml-1">$1</span>'
      );
    return <div dangerouslySetInnerHTML={{ __html: formatted.replace(/\n/g, '<br />') }} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex items-end gap-3 w-full ${
        isModel ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* Avatar */}
      {isModel && (
        <div
          className="flex-shrink-0 h-10 w-10 rounded-full 
          bg-gradient-to-br from-cyan-500/20 to-blue-600/20 
          border border-cyan-500/30 flex items-center justify-center 
          shadow-[0_0_10px_rgba(6,182,212,0.3)]"
        >
          <BrainCircuitIcon className="h-5 w-5 text-cyan-400" />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`relative max-w-[75%] px-5 py-3 rounded-2xl leading-relaxed backdrop-blur-sm
        ${
          isModel
            ? 'bg-gray-800/70 border border-gray-700 text-gray-200 shadow-[0_0_15px_rgba(0,255,255,0.08)]'
            : 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-[0_0_15px_rgba(0,255,255,0.15)]'
        }`}
      >
        <div className="prose prose-invert prose-sm text-white">
          {formatContent(message.content)}
        </div>

        {/* Chat bubble tail */}
        <div
          className={`absolute bottom-0 w-3 h-3 rotate-45 ${
            isModel
              ? 'left-[-6px] bg-gray-800/70 border-l border-b border-gray-700'
              : 'right-[-6px] bg-cyan-600'
          }`}
        ></div>
      </div>

      {/* User Avatar */}
      {!isModel && (
        <div
          className="flex-shrink-0 h-10 w-10 rounded-full 
          bg-gradient-to-br from-gray-600/30 to-gray-800/40 
          border border-gray-700 flex items-center justify-center"
        >
          <UserIcon className="h-5 w-5 text-gray-300" />
        </div>
      )}
    </motion.div>
  );
};
