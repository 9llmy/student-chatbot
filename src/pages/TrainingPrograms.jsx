import React, { useState, useEffect, useMemo } from 'react';
import { TrainingProgram } from '@/api/mockEntities';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, BookMarked, UserCheck, Search, Calendar } from 'lucide-react';

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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function TrainingProgramsPage() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        searchTerm: '',
        targetAudience: 'all',
    });

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const data = await TrainingProgram.list('-date_hijri');
                setPrograms(data);
            } catch (error) {
                console.error("Error loading training programs:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const uniqueAudiences = useMemo(() => [...new Set(programs.map(p => p.target_audience_ar).filter(Boolean))].sort(), [programs]);

    const filteredPrograms = useMemo(() => {
        return programs.filter(program => {
            const searchMatch = !filters.searchTerm || 
                program.course_name_ar?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                program.trainer_name_ar?.toLowerCase().includes(filters.searchTerm.toLowerCase());
            const audienceMatch = filters.targetAudience === 'all' || program.target_audience_ar === filters.targetAudience;
            return searchMatch && audienceMatch;
        });
    }, [programs, filters]);

    const { totalPrograms, totalAttendees, avgAttendees, audienceDistribution } = useMemo(() => {
        if (filteredPrograms.length === 0) {
            return { totalPrograms: 0, totalAttendees: 0, avgAttendees: 0, audienceDistribution: [] };
        }
        const totalAttendees = filteredPrograms.reduce((acc, p) => acc + (p.attendees_count || 0), 0);
        const distribution = filteredPrograms.reduce((acc, p) => {
            const audience = p.target_audience_ar;
            if (audience) {
                acc[audience] = (acc[audience] || 0) + (p.attendees_count || 0);
            }
            return acc;
        }, {});
        
        return {
            totalPrograms: filteredPrograms.length,
            totalAttendees: totalAttendees,
            avgAttendees: (totalAttendees / filteredPrograms.length).toFixed(1),
            audienceDistribution: Object.entries(distribution).map(([name, value]) => ({name, value})).sort((a,b) => b.value - a.value)
        };
    }, [filteredPrograms]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({...prev, [filterName]: value}));
    };
    
    if (loading) {
        return <div className="flex items-center justify-center h-full text-white text-xl">جاري تحميل البيانات...</div>;
    }

    return (
        <div dir="rtl" className="p-4 md:p-8 space-y-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-white">الدورات التدريبية المقدمة من عمادة التطوير المهني</h1>
                <p className="text-blue-200 mt-1">نظرة على الدورات التدريبية لعام 1444هـ</p>
            </motion.div>

            <motion.div 
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            >
                <StatCard title="إجمالي الدورات" value={totalPrograms} icon={BookMarked} color="bg-blue-500" />
                <StatCard title="إجمالي الحضور" value={totalAttendees} icon={Users} color="bg-green-500" />
                <StatCard title="متوسط الحضور" value={avgAttendees} icon={UserCheck} color="bg-purple-500" />
            </motion.div>

            <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">مرشحات البحث</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        placeholder="ابحث باسم الدورة أو المدرب..."
                        value={filters.searchTerm}
                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                        className="bg-white"
                    />
                    <Select value={filters.targetAudience} onValueChange={(v) => handleFilterChange('targetAudience', v)}>
                        <SelectTrigger><SelectValue placeholder="اختر الفئة المستهدفة" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">جميع الفئات</SelectItem>
                            {uniqueAudiences.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">قائمة الدورات التدريبية</h3>
                    <div className="overflow-auto h-[400px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>اسم الدورة</TableHead>
                                    <TableHead>المدرب</TableHead>
                                    <TableHead>الفئة المستهدفة</TableHead>
                                    <TableHead>التاريخ</TableHead>
                                    <TableHead>الحضور</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPrograms.map(program => (
                                    <TableRow key={program.id}>
                                        <TableCell className="font-medium">{program.course_name_ar}</TableCell>
                                        <TableCell>{program.trainer_name_ar}</TableCell>
                                        <TableCell>{program.target_audience_ar}</TableCell>
                                        <TableCell>{program.date_hijri}</TableCell>
                                        <TableCell className="font-bold text-center">{program.attendees_count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
                <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">توزيع الحضور حسب الفئة</h3>
                    <ResponsiveContainer width="100%" height={400}>
                         <PieChart>
                            <Pie 
                                data={audienceDistribution} 
                                dataKey="value" 
                                nameKey="name" 
                                cx="50%" 
                                cy="50%" 
                                outerRadius={120} 
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {audienceDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => value.toLocaleString('ar-SA')} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
}