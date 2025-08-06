import React, { useState, useEffect } from 'react';
import { EmployeeQualification } from '@/api/mockEntities';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, User, Award } from 'lucide-react';

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

const GENDER_COLORS = ['#3b82f6', '#ec4899'];
const QUALIFICATION_COLORS = ['#1e40af', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff', '#e0f2fe', '#bae6fd'];


export default function EmployeeQualificationsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await EmployeeQualification.list();
        setStats(data.sort((a, b) => b.total_count - a.total_count));
      } catch (error) {
        console.error("خطأ في تحميل إحصائيات المؤهلات:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalMales = stats.reduce((acc, s) => acc + s.male_count, 0);
  const totalFemales = stats.reduce((acc, s) => acc + s.female_count, 0);
  const totalEmployees = totalMales + totalFemales;

  const genderPieData = [
    { name: 'ذكور', value: totalMales },
    { name: 'إناث', value: totalFemales },
  ];

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
        <h1 className="text-3xl font-bold text-white">إحصائيات الموظفين حسب المؤهل العلمي</h1>
        <p className="text-blue-200 mt-1">توزيع المؤهلات العلمية لموظفي الجامعة لعام ٢٠٢٣</p>
      </motion.div>

      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        <StatCard title="إجمالي الموظفين" value={totalEmployees} icon={Users} color="bg-blue-500" />
        <StatCard title="إجمالي الذكور" value={totalMales} icon={User} color="bg-indigo-500" />
        <StatCard title="إجمالي الإناث" value={totalFemales} icon={User} color="bg-pink-500" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-3 bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">توزيع الموظفين حسب المؤهل</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats} layout="vertical" margin={{ right: 20, left: 20, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" tickFormatter={(value) => value.toLocaleString('ar-SA')} />
              <YAxis type="category" dataKey="degree_ar" width={120} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value, name) => [value.toLocaleString('ar-SA'), name === 'male_count' ? 'ذكور' : 'إناث']} />
              <Legend />
              <Bar dataKey="male_count" stackId="a" fill="#3b82f6" name="ذكور" />
              <Bar dataKey="female_count" stackId="a" fill="#ec4899" name="إناث" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-2 bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">نسبة الموظفين حسب الجنس</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={genderPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {genderPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString('ar-SA')} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      
      <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">تفاصيل المؤهلات العلمية</h3>
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المؤهل العلمي</TableHead>
              <TableHead className="text-center">ذكور</TableHead>
              <TableHead className="text-center">إناث</TableHead>
              <TableHead className="text-center font-bold">الإجمالي</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map(stat => (
              <TableRow key={stat.id}>
                <TableCell className="font-medium">{stat.degree_ar}</TableCell>
                <TableCell className="text-center">{stat.male_count.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center">{stat.female_count.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center font-bold">{stat.total_count.toLocaleString('ar-SA')}</TableCell>
              </TableRow>
            ))}
             <TableRow className="bg-gray-50/50 font-bold">
                <TableCell>الإجمالي الكلي</TableCell>
                <TableCell className="text-center">{totalMales.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center">{totalFemales.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center text-lg">{totalEmployees.toLocaleString('ar-SA')}</TableCell>
              </TableRow>
          </TableBody>
        </Table>
        </div>
      </Card>
    </div>
  );
}