import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Users, MapPin, Phone, Building, Stethoscope, Award, Feather } from 'lucide-react';

const allSuggestions = [
  { text: "ما هي إنجازات الجامعة؟", icon: Award },
  { text: "التصنيفات العالمية", icon: GraduationCap },
  { text: "الأبحاث العلمية", icon: BookOpen },
  { text: "كلية الهندسة", icon: Building },
  { text: "كلية الطب", icon: Stethoscope },
  { text: "كلية الحاسب", icon: Feather },
  { text: "مواقع الكليات", icon: MapPin },
  { text: "أرقام الاتصال", icon: Phone },
  { text: "الكراسي البحثية", icon: Feather },
  { text: "خدمات الصندوق الطلابي", icon: Users },
];

export default function SuggestionChips({ onSuggestionClick, isLoading }) {
  const [currentSuggestions, setCurrentSuggestions] = useState([]);

  useEffect(() => {
    const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
    setCurrentSuggestions(shuffled.slice(0, 4));
  }, []);

  return (
    <div className="p-4 bg-white/5 backdrop-blur-sm border-t border-white/10">
      <h3 className="text-white font-semibold mb-3 text-right">اقتراحات سريعة:</h3>
      <div className="flex flex-wrap gap-3 justify-end">
        {currentSuggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion.text}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSuggestionClick(suggestion.text)}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 
                     rounded-full text-white text-sm transition-all duration-300 
                     border border-white/20 hover:border-white/30 backdrop-blur-sm
                     disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <suggestion.icon className="w-4 h-4" />
            <span>{suggestion.text}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}