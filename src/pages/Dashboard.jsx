import React, { useState, useEffect } from 'react';
import { ServiceStatistic } from '@/api/mockEntities';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, User, UserCog, Pill, HandHelping, Stethoscope, Syringe, BookUser } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon }) => (
  <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
      <Icon className="h-5 w-5 text-blue-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900 text-right">{value.toLocaleString('ar-SA')}</div>
    </CardContent>
  </Card>
);

const serviceIcons = {
  "الفعاليات التوعوية": Users,
  "التثقيف التغذوي": BookUser,
  "العمليات الجراحية": Stethoscope,
  "الخدمات الصيدلانية": Pill,
  "الخدمات الاجتماعية": HandHelping,
  "الدورات التدريبية": UserCog,
  "مركز اللقاحات": Syringe,
};

const COLORS = ['#1e40af', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

export default function DashboardPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await ServiceStatistic.list();
        setStats(data.sort((a, b) => b.total_count - a.total_count));
      } catch (error) {
        console.error("خطأ في تحميل الإحصائيات:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalBeneficiaries = stats.reduce((acc, s) => acc + s.total_count, 0);
  const totalMales = stats.reduce((acc, s) => acc + s.male_count, 0);
  const totalFemales = stats.reduce((acc, s) => acc + s.female_count, 0);

  const chartData = stats.map(s => ({
    name: s.service_name_ar.split(' ').slice(3).join(' '),
    'ذكور': s.male_count,
    'إناث': s.female_count
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
        <h1 className="text-3xl font-bold text-white">لوحة التحكم الرئيسية</h1>
        <p className="text-blue-200 mt-1">نظرة شاملة على إحصائيات الخدمات الجامعية</p>
      </motion.div>

      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        <StatCard title="إجمالي المستفيدين" value={totalBeneficiaries} icon={Users} />
        <StatCard title="إجمالي الذكور" value={totalMales} icon={User} />
        <StatCard title="إجمالي الإناث" value={totalFemales} icon={User} />
        <StatCard title="أنواع الخدمات" value={stats.length} icon={UserCog} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">توزيع المستفيدين حسب الخدمة والجنس</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} layout="vertical" margin={{ right: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" tickFormatter={(value) => value.toLocaleString('ar-SA')} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => value.toLocaleString('ar-SA')} />
              <Legend />
              <Bar dataKey="ذكور" fill="#3b82f6" name="ذكور" />
              <Bar dataKey="إناث" fill="#ec4899" name="إناث" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">نسبة الخدمات</h3>
           <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={stats} dataKey="total_count" nameKey="service_name_ar" cx="50%" cy="50%" outerRadius={120} labelLine={false}>
                {stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value.toLocaleString('ar-SA'), name.split(' ').slice(3).join(' ')]} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">تفاصيل إحصائيات الخدمات</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الخدمة</TableHead>
              <TableHead className="text-right">ذكور</TableHead>
              <TableHead className="text-right">إناث</TableHead>
              <TableHead className="text-right">المجموع</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map(stat => (
              <TableRow key={stat.id}>
                <TableCell className="font-medium">{stat.service_name_ar.replace('عدد المستفيدين من ', '').replace('عدد ', '')}</TableCell>
                <TableCell>{stat.male_count.toLocaleString('ar-SA')}</TableCell>
                <TableCell>{stat.female_count.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="font-bold">{stat.total_count.toLocaleString('ar-SA')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}