
import React, { useState, useEffect } from "react";
import { College } from "@/api/mockEntities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Search, 
  MapPin,
  Calendar,
  Users,
  BookOpen,
  Building, // New icon
  Star, // New icon
  Briefcase, // New icon
  Lightbulb, // New icon
  FileText, // New icon
  DollarSign, // New icon
  Award, // New icon
  BarChart2 // New icon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const StatCard = ({ icon, label, value, unit, color }) => {
  const Icon = icon;
  return (
    <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-lg">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-bold text-gray-900">{value} <span className="text-xs">{unit}</span></p>
      </div>
    </div>
  );
};

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadColleges();
  }, []);

  useEffect(() => {
    filterColleges();
  }, [colleges, searchTerm]); // Removed selectedDegree from dependencies

  const loadColleges = async () => {
    setIsLoading(true);
    try {
      const data = await College.list();
      setColleges(data);
    } catch (error) {
      console.error("خطأ في تحميل الكليات:", error);
    }
    setIsLoading(false);
  };

  const filterColleges = () => {
    let filtered = colleges.filter(college => {
      // Simplified filter logic, no longer considering degree type
      return !searchTerm || 
        college.name_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.name_en?.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredColleges(filtered);
  };

  // Removed degreeTypes array

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-white text-xl">جاري تحميل بيانات الكليات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🏛️ كليات جامعة القصيم
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            استكشف الكليات والتخصصات المتاحة واطلع على مؤشرات الأداء الرئيسية
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20"
        >
          <div className="relative max-w-lg mx-auto"> {/* Adjusted structure for filter */}
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="ابحث باللغة العربية أو الإنجليزية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 bg-white/90 border-white/30 focus:border-blue-400 rounded-xl text-right"
              dir="rtl"
            />
          </div>
          {/* Removed degree type buttons */}
        </motion.div>

        {/* Results Count */}
        <div className="text-white text-center mb-6">
          <p className="text-lg">
            تم العثور على <span className="font-bold text-blue-300">{filteredColleges.length}</span> كلية
          </p>
        </div>

        {/* Colleges Grid */}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredColleges.map((college, index) => (
              <motion.div
                key={college.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 h-full flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Building className="w-7 h-7 text-white" /> {/* Changed icon to Building */}
                      </div>
                      <div className="text-right">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                           تأسست عام {college.established_year} {/* Updated Badge content */}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl text-right text-gray-900">
                      {college.name_ar}
                    </CardTitle>
                    <p className="text-gray-600 text-right mt-1">{college.name_en}</p>
                    <div className="flex items-center gap-2 justify-end text-sm text-gray-500 mt-2">
                      <p>{college.location_ar}</p> {/* Added college location */}
                      <MapPin className="w-4 h-4 text-red-500" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                    {/* Removed description_ar block */}
                    {/* Removed departments block */}
                    {/* Removed study_years and departments count block */}

                    {/* New Performance Indicators Section */}
                    <div>
                        <h4 className="font-semibold text-gray-800 text-right mb-3">مؤشرات الأداء</h4>
                        <div className="space-y-3">
                            <div className="text-right">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-700">رضا الطلاب</span>
                                    <span className="text-sm font-bold text-blue-600">{college.students_satisfaction}%</span>
                                </div>
                                <Progress value={college.students_satisfaction} className="h-2" />
                            </div>
                            <div className="text-right">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-700">جودة هيئة التدريس</span>
                                    <span className="text-sm font-bold text-green-600">{college.faculty_quality}%</span>
                                </div>
                                <Progress value={college.faculty_quality} className="h-2 [&>*]:bg-green-500" />
                            </div>
                            <div className="text-right">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-700">توظيف الخريجين</span>
                                    <span className="text-sm font-bold text-purple-600">{college.graduate_employment_within_1_year}%</span>
                                </div>
                                <Progress value={college.graduate_employment_within_1_year} className="h-2 [&>*]:bg-purple-500" />
                            </div>
                        </div>
                    </div>

                    {/* New Stat Cards Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                        <StatCard icon={FileText} label="أبحاث منشورة" value={college.research_publications} unit="بحث" color="bg-blue-500" />
                        <StatCard icon={Lightbulb} label="براءات اختراع" value={college.patents_count} unit="براءة" color="bg-yellow-500" />
                        <StatCard icon={DollarSign} label="تمويل بحثي" value={(college.research_funding/1000000).toFixed(1)} unit="مليون" color="bg-green-500" />
                        <StatCard icon={Award} label="الاعتماد الأكاديمي" value={college.accreditation_status_ar?.split(' ')[0] || 'غير محدد'} unit="" color="bg-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredColleges.length === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-white/50" />
            </div>
            <h3 className="2xl font-bold text-white mb-4">لا توجد نتائج</h3>
            <p className="text-blue-100 text-lg">جرب تعديل مصطلحات البحث أو المرشحات</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
