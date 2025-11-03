import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuitIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative z-10 flex items-center justify-between px-6 py-4 
      bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/60 
      shadow-lg shadow-cyan-900/20"
    >
      {/* Left Section — Logo & Title */}
      <div className="flex items-center space-x-3">
        <motion.div
          whileHover={{ rotate: 15 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-600/40"
        >
          <BrainCircuitIcon className="h-7 w-7 text-cyan-400" />
        </motion.div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide">
            Personal Research Assistant
          </h1>
          <p className="text-xs text-gray-400 hidden sm:block">
            Powered by Ethel Technologies • by Natnael Sintayehu
          </p>
        </div>
      </div>

      {/* Right Section — optional (profile or settings) */}
      <div className="hidden sm:flex items-center space-x-4">
        <a
          href="https://linkedin.com/in/natnaelsintayehu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-cyan-400 transition"
        >
          LinkedIn
        </a>
        <a
          href="https://t.me/natnaelsintayehu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-cyan-400 transition"
        >
          Telegram
        </a>
        <a
          href="https://instagram.com/natnaelsintayehu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-cyan-400 transition"
        >
          Instagram
        </a>
      </div>

      {/* Mobile gradient accent */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent opacity-50"></div>
    </motion.header>
  );
};
