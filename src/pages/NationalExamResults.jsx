import React, { useState, useEffect } from 'react';
import { NationalExamResult } from '@/api/mockEntities';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, UserCheck, UserX, Award, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, unit }) => (
  <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-gray-900 text-right">
        {typeof value === 'number' ? value.toLocaleString('ar-SA') : value}{unit && <span className="text-lg font-normal"> {unit}</span>}
      </div>
    </CardContent>
  </Card>
);

const getPassRateColor = (rate) => {
  if (rate >= 98) return "bg-green-500";
  if (rate >= 95) return "bg-blue-500";
  if (rate >= 90) return "bg-yellow-500";
  return "bg-red-500";
};

const getPassRateText = (rate) => {
  if (rate >= 98) return "ممتاز";
  if (rate >= 95) return "جيد جداً";
  if (rate >= 90) return "جيد";
  return "مقبول";
};

export default function NationalExamResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const data = await NationalExamResult.list();
        const dataWithRates = data.map(item => ({
          ...item,
          pass_rate: ((item.passed_applicants / item.total_applicants) * 100).toFixed(1)
        }));
        setResults(dataWithRates.sort((a, b) => b.pass_rate - a.pass_rate));
      } catch (error) {
        console.error("خطأ في تحميل نتائج الاختبارات:", error);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, []);

  const totalApplicants = results.reduce((acc, r) => acc + r.total_applicants, 0);
  const totalPassed = results.reduce((acc, r) => acc + r.passed_applicants, 0);
  const totalFailed = results.reduce((acc, r) => acc + r.failed_applicants, 0);
  const overallPassRate = totalApplicants > 0 ? ((totalPassed / totalApplicants) * 100).toFixed(1) : 0;

  const chartData = results.map(r => ({
    name: r.college_program_ar.replace('نتائج طلاب ', '').replace(' للفترة 1444', '').substring(0, 20) + '...',
    'معدل النجاح': parseFloat(r.pass_rate),
    'الناجحون': r.passed_applicants,
    'الراسبون': r.failed_applicants
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
        <h1 className="text-3xl font-bold text-white">نتائج الاختبارات الوطنية لعام 1444هـ</h1>
        <p className="text-blue-200 mt-1">أداء طلاب الجامعة في الاختبارات الوطنية للكليات الصحية</p>
      </motion.div>

      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        <StatCard title="إجمالي المتقدمين" value={totalApplicants} icon={Users} color="bg-blue-500" />
        <StatCard title="إجمالي الناجحين" value={totalPassed} icon={UserCheck} color="bg-green-500" />
        <StatCard title="إجمالي الراسبين" value={totalFailed} icon={UserX} color="bg-red-500" />
        <StatCard title="معدل النجاح العام" value={overallPassRate} unit="%" icon={TrendingUp} color="bg-purple-500" />
      </motion.div>

      <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">معدلات النجاح حسب الكلية</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis domain={[85, 100]} />
            <Tooltip formatter={(value, name) => [
              name === 'معدل النجاح' ? `${value}%` : value.toLocaleString('ar-SA'),
              name === 'معدل النجاح' ? 'معدل النجاح' : name
            ]} />
            <Legend />
            <Bar dataKey="معدل النجاح" fill="#10b981" name="معدل النجاح %" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      
      <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">تفاصيل النتائج</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الكلية والبرنامج</TableHead>
                <TableHead className="text-center">إجمالي المتقدmين</TableHead>
                <TableHead className="text-center">الناجحون</TableHead>
                <TableHead className="text-center">الراسبون</TableHead>
                <TableHead className="text-center">معدل النجاح</TableHead>
                <TableHead className="text-center">التقييم</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map(result => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium max-w-xs">
                    {result.college_program_ar.replace('نتائج طلاب ', '').replace(' للفترة 1444', '')}
                  </TableCell>
                  <TableCell className="text-center">{result.total_applicants.toLocaleString('ar-SA')}</TableCell>
                  <TableCell className="text-center text-green-600 font-semibold">{result.passed_applicants.toLocaleString('ar-SA')}</TableCell>
                  <TableCell className="text-center text-red-600 font-semibold">{result.failed_applicants.toLocaleString('ar-SA')}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <span className="font-bold">{result.pass_rate}%</span>
                      <Progress value={parseFloat(result.pass_rate)} className="w-16 h-2" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={`${getPassRateColor(parseFloat(result.pass_rate))} text-white`}>
                      {getPassRateText(parseFloat(result.pass_rate))}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-gray-50/50 font-bold">
                <TableCell>الإجمالي</TableCell>
                <TableCell className="text-center">{totalApplicants.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center text-green-600">{totalPassed.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center text-red-600">{totalFailed.toLocaleString('ar-SA')}</TableCell>
                <TableCell className="text-center text-lg">{overallPassRate}%</TableCell>
                <TableCell className="text-center">
                  <Badge className={`${getPassRateColor(parseFloat(overallPassRate))} text-white`}>
                    {getPassRateText(parseFloat(overallPassRate))}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}