import React, { useState, useEffect } from 'react';
import { FacultyStatistic } from '@/api/mockEntities';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, User, GraduationCap, UserCheck } from 'lucide-react';

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
const NATIONALITY_COLORS = ['#10b981', '#f59e0b'];

export default function FacultyStatisticsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await FacultyStatistic.list();
        setStats(data.sort((a, b) => b.grand_total - a.grand_total));
      } catch (error) {
        console.error("خطأ في تحميل إحصائيات أعضاء هيئة التدريس:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalSaudi = stats.reduce((acc, s) => acc + s.saudi_total, 0);
  const totalNonSaudi = stats.reduce((acc, s) => acc + s.non_saudi_total, 0);
  const totalMales = stats.reduce((acc, s) => acc + s.saudi_male + s.non_saudi_male, 0);
  const totalFemales = stats.reduce((acc, s) => acc + s.saudi_female + s.non_saudi_female, 0);
  const grandTotal = stats.reduce((acc, s) => acc + s.grand_total, 0);

  const chartData = stats.map(s => ({
    name: s.position_ar,
    'سعودي': s.saudi_total,
    'غير سعودي': s.non_saudi_total,
  }));

  const genderPieData = [
    { name: 'ذكور', value: totalMales },
    { name: 'إناث', value: totalFemales },
  ];

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
        <h1 className="text-3xl font-bold text-white">إحصائيات أعضاء هيئة التدريس لعام 1444هـ</h1>
        <p className="text-blue-200 mt-1">توزيع أعضاء هيئة التدريس حسب الجنس والجنسية والمرتبة العلمية</p>
      </motion.div>

      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        <StatCard title="إجمالي أعضاء هيئة التدريس" value={grandTotal} icon={GraduationCap} color="bg-blue-500" />
        <StatCard title="السعوديين" value={totalSaudi} icon={UserCheck} color="bg-green-500" />
        <StatCard title="غير السعوديين" value={totalNonSaudi} icon={User} color="bg-orange-500" />
        <StatCard title="إجمالي الذكور" value={totalMales} icon={User} color="bg-indigo-500" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">توزيع أعضاء هيئة التدريس حسب المرتبة والجنسية</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => value.toLocaleString('ar-SA')} />
              <Legend />
              <Bar dataKey="سعودي" stackId="a" fill="#10b981" name="سعودي" />
              <Bar dataKey="غير سعودي" stackId="a" fill="#f59e0b" name="غير سعودي" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div className="space-y-8">
          <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">التوزيع حسب الجنس</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={genderPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {genderPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString('ar-SA')} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">التوزيع حسب الجنسية</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={nationalityPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {nationalityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={NATIONALITY_COLORS[index % NATIONALITY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString('ar-SA')} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
      
      <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">تفاصيل أعضاء هيئة التدريس</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المسمى الوظيفي</TableHead>
                <TableHead className="text-center">سعودي أنثى</TableHead>
                <TableHead className="text-center">سعودي ذكر</TableHead>
                <TableHead className="text-center">إجمالي سعودي</TableHead>
                <TableHead className="text-center">غير سعودي أنثى</TableHead>
                <TableHead className="text-center">غير سعودي ذكر</TableHead>
                <TableHead className="text-center">إجمالي غير سعودي</TableHead>
                <TableHead className="text-center font-bold">الإجمالي الكلي</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map(stat => (
                <TableRow key={stat.id}>
                  <TableCell className="font-medium">{stat.position_ar}</TableCell>
                  <TableCell className="text-center">{stat.saudi_female.toLocaleString('ar-SA')}</TableCell>
                  <TableCell className="text-center">{stat.saudi_male.toLocaleString('ar-SA')}</TableCell>
                  <TableCell className="text-center font-semibold">{stat.saudi_total.toLocaleString('ar-SA')}</TableCell>
                  <TableCell className="text-center">{stat.non_saudi_female.toLocaleString('ar-SA')}</TableCell>
                  <TableCell className="text-center">{stat.non_saudi_male.toLocaleString('ar-SA')}</TableCell>
                  <TableCell className="text-center font-semibold">{stat.non_saudi_total.toLocaleString('ar-SA')}</TableCell>
                  <TableCell className="text-center font-bold text-blue-700">{stat.grand_total.toLocaleString('ar-SA')}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-gray-50/50 font-bold">
                <TableCell>الإجمالي</TableCell>
                <TableCell className="text-center">{totalFemales.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center">{totalMales.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center">{totalSaudi.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center">{stats.reduce((acc, s) => acc + s.non_saudi_female, 0).toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center">{stats.reduce((acc, s) => acc + s.non_saudi_male, 0).toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center">{totalNonSaudi.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center text-lg">{grandTotal.toLocaleString('ar-SA')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}