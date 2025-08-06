import React, { useState, useEffect } from 'react';
import { ScholarshipStat } from '@/api/mockEntities';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, UserPlus, UserCheck, BookUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-gray-900 text-right">{value.toLocaleString('ar-SA')}</div>
    </CardContent>
  </Card>
);

export default function ScholarshipsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await ScholarshipStat.list();
        setStats(data);
      } catch (error) {
        console.error("خطأ في تحميل إحصائيات المبتعثين:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalNew = stats.reduce((acc, s) => acc + s.new_scholars, 0);
  const totalCurrent = stats.reduce((acc, s) => acc + s.current_scholars, 0);
  const totalGraduated = stats.reduce((acc, s) => acc + s.graduated_scholars, 0);

  const chartData = stats.map(s => ({
    name: s.program_name_ar,
    'مبتعثون جدد': s.new_scholars,
    'على رأس البعثة': s.current_scholars,
    'خريجون': s.graduated_scholars
  }));
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">جاري تحميل البيانات...</div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-4 md:p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">إحصائيات المبتعثين لعام 1445هـ</h1>
        <p className="text-blue-200 mt-1">نظرة على أعداد المبتعثين الجدد، الحاليين، والخريجين</p>
      </motion.div>

      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        <StatCard title="إجمالي المبتعثين الجدد" value={totalNew} icon={UserPlus} color="bg-green-500" />
        <StatCard title="إجمالي المبتعثين على رأس البعثة" value={totalCurrent} icon={Users} color="bg-blue-500" />
        <StatCard title="إجمالي الخريجين" value={totalGraduated} icon={UserCheck} color="bg-purple-500" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-3 bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">تطور أعداد المبتعثين حسب البرنامج الدراسي</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => value.toLocaleString('ar-SA')} />
              <Legend />
              <Bar dataKey="مبتعثون جدد" fill="#10b981" name="جدد" />
              <Bar dataKey="على رأس البعثة" fill="#3b82f6" name="حاليون" />
              <Bar dataKey="خريجون" fill="#8b5cf6" name="خريجون" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-2 bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">تفاصيل الأعداد</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">البرنامج الدراسي</TableHead>
                <TableHead className="text-center">جدد</TableHead>
                <TableHead className="text-center">حاليون</TableHead>
                <TableHead className="text-center">خريجون</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map(stat => (
                <TableRow key={stat.id}>
                  <TableCell className="font-medium">{stat.program_name_ar}</TableCell>
                  <TableCell className="text-center">{stat.new_scholars.toLocaleString('ar-SA')}</TableCell>
                  <TableCell className="text-center">{stat.current_scholars.toLocaleString('ar-SA')}</TableCell>
                  <TableCell className="text-center">{stat.graduated_scholars.toLocaleString('ar-SA')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}