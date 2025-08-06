import React, { useState, useEffect } from 'react';
import { StudentFundService } from '@/api/mockEntities';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, HandHelping, Gift, TrendingUp, Wallet } from 'lucide-react';

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

const COLORS = ['#1e40af', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff', '#e0f2fe', '#bae6fd'];

export default function StudentFundServicesPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await StudentFundService.list();
        setStats(data.sort((a, b) => b.beneficiaries_count - a.beneficiaries_count));
      } catch (error) {
        console.error("خطأ في تحميل خدمات الصندوق الطلابي:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalBeneficiaries = stats.reduce((acc, s) => acc + s.beneficiaries_count, 0);
  const totalServices = stats.length;
  const topService = stats.length > 0 ? stats[0] : null;

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
        <h1 className="text-3xl font-bold text-white">الخدمات المقدمة من الصندوق الطلابي ١٤٤٥هـ</h1>
        <p className="text-blue-200 mt-1">نظرة شاملة على الخدمات وعدد المستفيدين منها</p>
      </motion.div>

      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        <StatCard title="إجمالي المستفيدين" value={totalBeneficiaries} icon={Users} color="bg-blue-500" />
        <StatCard title="عدد الخدمات المقدمة" value={totalServices} icon={Gift} color="bg-green-500" />
        <StatCard title="الخدمة الأعلى استفادة" value={topService?.service_name_ar || ''} icon={TrendingUp} color="bg-purple-500" />
      </motion.div>
      
       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-3 bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">توزيع المستفيدين حسب الخدمة</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats} layout="vertical" margin={{ right: 20, left: 20, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" tickFormatter={(value) => value.toLocaleString('ar-SA')} />
              <YAxis type="category" dataKey="service_name_ar" width={150} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [value.toLocaleString('ar-SA'), 'عدد المستفيدين']} />
              <Legend />
              <Bar dataKey="beneficiaries_count" fill="#2563eb" name="عدد المستفيدين" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-2 bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">تفاصيل الخدمات</h3>
          <div className="overflow-y-auto h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الخدمة</TableHead>
                  <TableHead className="text-center">المستفيدون</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map(stat => (
                  <TableRow key={stat.id}>
                    <TableCell className="font-medium">{stat.service_name_ar}</TableCell>
                    <TableCell className="text-center font-bold">{stat.beneficiaries_count.toLocaleString('ar-SA')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

    </div>
  );
}