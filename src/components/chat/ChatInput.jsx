
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatInput({ onSendMessage, isLoading }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="p-6 bg-white/10 backdrop-blur-md border-t border-white/20"
    >
      <form onSubmit={handleSubmit} className="flex gap-4 items-end max-w-5xl mx-auto">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اكتب سؤالك هنا..."
            className="min-h-[60px] max-h-32 resize-none bg-white/95 backdrop-blur-sm 
                     border-white/30 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 
                     rounded-2xl text-right px-6 py-4 text-base shadow-lg
                     placeholder:text-gray-500"
            disabled={isLoading}
            dir="rtl"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="w-14 h-14 rounded-full bg-white/20 border-white/30 hover:bg-white/30 
                     text-white hover:text-white backdrop-blur-sm shadow-lg"
          >
            <Mic className="w-5 h-5" />
          </Button>
          
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 
                     hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 
                     disabled:cursor-not-allowed shadow-lg border-0 text-white
                     transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
