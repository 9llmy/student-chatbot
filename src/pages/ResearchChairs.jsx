
import React, { useState, useEffect } from "react";
import { ResearchChair } from "@/api/mockEntities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Feather, Search, MapPin, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResearchChairsPage() {
  const [chairs, setChairs] = useState([]);
  const [filteredChairs, setFilteredChairs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChairs();
  }, []);

  useEffect(() => {
    filterChairs();
  }, [chairs, searchTerm]);

  const loadChairs = async () => {
    setIsLoading(true);
    try {
      const data = await ResearchChair.list();
      setChairs(data);
    } catch (error) {
      console.error("خطأ في تحميل الكراسي البحثية:", error);
    }
    setIsLoading(false);
  };

  const filterChairs = () => {
    let filtered = chairs.filter(chair => {
      return !searchTerm || chair.name_ar?.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredChairs(filtered);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-8">
        <div className="max-w-7xl mx-auto text-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-xl">جاري تحميل بيانات الكراسي البحثية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🖋️ الكراسي البحثية بجامعة القصيم
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            اكتشف المراكز البحثية المتخصصة ومجالاتها وإسهاماتها العلمية
          </p>
        </motion.div>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20"
        >
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="ابحث عن كرسي بحثي..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 bg-white/90 border-white/30 focus:border-blue-400 rounded-xl text-right"
              dir="rtl"
            />
          </div>
        </motion.div>

        <div className="text-white text-center mb-6">
          <p className="text-lg">
            تم العثور على <span className="font-bold text-blue-300">{filteredChairs.length}</span> كرسي بحثي
          </p>
        </div>

        <AnimatePresence>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredChairs.map((chair, index) => (
              <motion.div
                key={chair.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 h-full flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Feather className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-right flex-1">
                        <CardTitle className="text-xl text-gray-900">
                          {chair.name_ar}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                    <p className="text-gray-700 text-right leading-relaxed">{chair.description_ar}</p>
                    <div className="pt-4 border-t border-gray-200 mt-4 flex justify-between items-center text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                         <MapPin className="w-4 h-4 text-red-500" />
                         <span>{chair.location_ar}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Calendar className="w-4 h-4 text-blue-500" />
                         <span>{chair.establishment_date_hijri} / {chair.establishment_date_gregorian}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredChairs.length === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-white/50" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">لا توجد نتائج</h3>
            <p className="text-blue-100 text-lg">جرب تعديل مصطلح البحث</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
