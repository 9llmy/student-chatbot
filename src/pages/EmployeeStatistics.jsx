import React, { useState, useEffect } from 'react';
import { EmployeeStatistic } from '@/api/mockEntities';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, User, UserCheck, UserX } from 'lucide-react';

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

export default function EmployeeStatisticsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await EmployeeStatistic.list();
        setStats(data);
      } catch (error) {
        console.error("خطأ في تحميل إحصائيات الموظفين:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalSaudiMale = stats.reduce((acc, s) => acc + s.saudi_male, 0);
  const totalSaudiFemale = stats.reduce((acc, s) => acc + s.saudi_female, 0);
  const totalNonSaudiMale = stats.reduce((acc, s) => acc + s.non_saudi_male, 0);
  const totalNonSaudiFemale = stats.reduce((acc, s) => acc + s.non_saudi_female, 0);

  const totalSaudi = totalSaudiMale + totalSaudiFemale;
  const totalNonSaudi = totalNonSaudiMale + totalNonSaudiFemale;
  const totalEmployees = totalSaudi + totalNonSaudi;

  const chartData = stats.map(s => ({
    name: s.role_ar,
    'ذكور': s.saudi_male + s.non_saudi_male,
    'إناث': s.saudi_female + s.non_saudi_female,
  }));

  const nationalityPieData = [
      { name: 'سعودي', value: totalSaudi },
      { name: 'غير سعودي', value: totalNonSaudi },
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
        <h1 className="text-3xl font-bold text-white">إحصائيات الموظفين</h1>
        <p className="text-blue-200 mt-1">نظرة شاملة على الكادر الإداري والفني بالجامعة</p>
      </motion.div>

      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        <StatCard title="إجمالي الموظفين" value={totalEmployees} icon={Users} color="bg-blue-500" />
        <StatCard title="إجمالي السعوديين" value={totalSaudi} icon={UserCheck} color="bg-green-500" />
        <StatCard title="إجمالي غير السعوديين" value={totalNonSaudi} icon={UserX} color="bg-red-500" />
        <StatCard title="عدد الفئات الوظيفية" value={stats.length} icon={User} color="bg-purple-500" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-3 bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">توزيع الموظفين حسب الفئة والجنس</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => value.toLocaleString('ar-SA')} />
              <Legend />
              <Bar dataKey="ذكور" stackId="a" fill="#3b82f6" name="ذكور" />
              <Bar dataKey="إناث" stackId="a" fill="#ec4899" name="إناث" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-2 bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">نسبة الموظفين حسب الجنسية</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={nationalityPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {nationalityPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#10b981', '#f59e0b'][index % 2]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString('ar-SA')} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      
      <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">تفاصيل أعداد الموظفين</h3>
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">التشكيل</TableHead>
              <TableHead className="text-center">سعودي (ذكر)</TableHead>
              <TableHead className="text-center">سعودي (أنثى)</TableHead>
              <TableHead className="text-center">غير سعودي (ذكر)</TableHead>
              <TableHead className="text-center">غير سعودي (أنثى)</TableHead>
              <TableHead className="text-center font-bold">الإجمالي</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map(stat => (
              <TableRow key={stat.id}>
                <TableCell className="font-medium">{stat.role_ar}</TableCell>
                <TableCell className="text-center">{stat.saudi_male.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center">{stat.saudi_female.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center">{stat.non_saudi_male.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center">{stat.non_saudi_female.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center font-bold">{(stat.saudi_male + stat.saudi_female + stat.non_saudi_male + stat.non_saudi_female).toLocaleString('ar-SA')}</TableCell>
              </TableRow>
            ))}
             <TableRow className="bg-gray-50/50 font-bold">
                <TableCell>الإجمالي</TableCell>
                <TableCell className="text-center">{totalSaudiMale.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center">{totalSaudiFemale.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center">{totalNonSaudiMale.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center">{totalNonSaudiFemale.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center text-lg">{totalEmployees.toLocaleString('ar-SA')}</TableCell>
              </TableRow>
          </TableBody>
        </Table>
        </div>
      </Card>
    </div>
  );
}