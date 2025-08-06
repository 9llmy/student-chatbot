
import React, { useState, useEffect } from "react";
import { AcademicProgram } from "@/api/mockEntities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Search, 
  BookOpen,
  Users,
  Award,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

const StatCard = ({ title, value, icon: Icon, color, description }) => (
  <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900 text-right">{value}</div>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </CardContent>
  </Card>
);

export default function AcademicProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    filterPrograms();
  }, [programs, searchTerm]);

  const loadPrograms = async () => {
    setIsLoading(true);
    try {
      const data = await AcademicProgram.list();
      setPrograms(data);
    } catch (error) {
      console.error("خطأ في تحميل البرامج الأكاديمية:", error);
    }
    setIsLoading(false);
  };

  const filterPrograms = () => {
    let filtered = programs.filter(program => {
      return !searchTerm || program.specialization_ar?.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredPrograms(filtered);
  };

  const totalBachelors = programs.reduce((sum, program) => sum + program.bachelor_programs_count, 0);
  const totalMasters = programs.reduce((sum, program) => sum + program.master_programs_count, 0);
  const totalPhds = programs.reduce((sum, program) => sum + program.phd_programs_count, 0);
  const totalPrograms = totalBachelors + totalMasters + totalPhds;

  const chartData = programs.map(program => ({
    name: program.specialization_ar,
    'بكالوريوس': program.bachelor_programs_count,
    'ماجستير': program.master_programs_count,
    'دكتوراه': program.phd_programs_count
  }));

  const pieData = programs.map(program => ({
    name: program.specialization_ar,
    value: program.total_programs
  }));

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
            <p className="text-white text-xl">جاري تحميل بيانات البرامج الأكاديمية...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            📚 البرامج الأكاديمية
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            نظرة شاملة على البرامج الأكاديمية المتاحة في جامعة القصيم موزعة حسب التخصص والمستوى الدراسي
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        >
          <StatCard 
            title="إجمالي البرامج" 
            value={totalPrograms} 
            icon={BookOpen} 
            color="bg-blue-500"
            description="جميع المستويات الدراسية"
          />
          <StatCard 
            title="برامج البكالوريوس" 
            value={totalBachelors} 
            icon={GraduationCap} 
            color="bg-green-500"
            description="المرحلة الجامعية"
          />
          <StatCard 
            title="برامج الماجستير" 
            value={totalMasters} 
            icon={Award} 
            color="bg-purple-500"
            description="الدراسات العليا"
          />
          <StatCard 
            title="برامج الدكتوراه" 
            value={totalPhds} 
            icon={TrendingUp} 
            color="bg-red-500"
            description="أعلى درجة علمية"
          />
        </motion.div>

        {/* Search */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20"
        >
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="ابحث عن تخصص..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 bg-white/90 border-white/30 focus:border-blue-400 rounded-xl text-right"
              dir="rtl"
            />
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">توزيع البرامج حسب التخصص والمستوى</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="بكالوريوس" fill="#10b981" name="بكالوريوس" />
                <Bar dataKey="ماجستير" fill="#3b82f6" name="ماجستير" />
                <Bar dataKey="دكتوراه" fill="#f59e0b" name="دكتوراه" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">نسبة البرامج حسب التخصص</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Programs Grid */}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 h-full">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center mb-3">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {program.total_programs} برنامج
                      </Badge>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl text-right text-gray-900">
                      التخصصات {program.specialization_ar}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">بكالوريوس</span>
                        <span className="font-bold text-green-600">{program.bachelor_programs_count}</span>
                      </div>
                      <Progress value={(program.bachelor_programs_count / Math.max(...programs.map(p => p.bachelor_programs_count))) * 100} className="h-2 [&>*]:bg-green-500" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">ماجستير</span>
                        <span className="font-bold text-blue-600">{program.master_programs_count}</span>
                      </div>
                      <Progress value={(program.master_programs_count / Math.max(...programs.map(p => p.master_programs_count))) * 100} className="h-2 [&>*]:bg-blue-500" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">دكتوراه</span>
                        <span className="font-bold text-yellow-600">{program.phd_programs_count}</span>
                      </div>
                      <Progress value={(program.phd_programs_count / Math.max(...programs.map(p => p.phd_programs_count))) * 100} className="h-2 [&>*]:bg-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredPrograms.length === 0 && !isLoading && (
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
