import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 self-start max-w-md"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                      flex items-center justify-center shadow-lg">
        <Bot className="w-5 h-5 text-white" />
      </div>
      
      <div className="bg-white/95 border border-gray-200/50 px-6 py-4 rounded-2xl rounded-br-md shadow-md backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <span className="text-gray-600 text-sm ml-2">جاري الكتابة</span>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}