
import React from 'react';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MessageBubble({ message, isBot = false, timestamp }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex items-start gap-3 ${isBot ? 'self-start' : 'self-end flex-row-reverse'}`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
        isBot 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
          : 'bg-gradient-to-br from-indigo-500 to-purple-600'
      }`}>
        {isBot ? (
          <Bot className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>
      
      <div className={`max-w-2xl ${isBot ? 'text-right' : 'text-left'}`}>
        <div className={`px-6 py-4 rounded-2xl shadow-md backdrop-blur-sm border ${
          isBot 
            ? 'bg-white/95 border-gray-200/50 rounded-br-md' 
            : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-500/30 rounded-bl-md'
        }`}>
          <p className="text-base leading-relaxed whitespace-pre-wrap">{message}</p>
        </div>
        
        {timestamp && (
          <p className={`text-xs mt-2 opacity-60 ${isBot ? 'text-right' : 'text-left'}`}>
            {new Date(timestamp).toLocaleTimeString('ar-SA', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        )}
      </div>
    </motion.div>
  );
}
