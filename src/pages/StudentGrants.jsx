import React, { useState, useEffect, useMemo } from 'react';
import { StudentGrant } from '@/api/mockEntities';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Search, BookOpen, Globe, GraduationCap, School, User } from 'lucide-react';

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

const COLORS = ['#1e40af', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff', '#e0f2fe'];

export default function StudentGrantsPage() {
    const [grants, setGrants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        college: 'all',
        degree: 'all',
        nationality: 'all',
        searchTerm: ''
    });

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const data = await StudentGrant.list();
                setGrants(data);
            } catch (error) {
                console.error("Error loading student grants:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const uniqueColleges = useMemo(() => [...new Set(grants.map(g => g.college).filter(Boolean))].sort(), [grants]);
    const uniqueDegrees = useMemo(() => [...new Set(grants.map(g => g.degree).filter(Boolean))].sort(), [grants]);
    const uniqueNationalities = useMemo(() => [...new Set(grants.map(g => g.nationality).filter(Boolean))].sort(), [grants]);

    const filteredGrants = useMemo(() => {
        return grants.filter(grant => {
            const searchMatch = !filters.searchTerm || grant.specialization?.toLowerCase().includes(filters.searchTerm.toLowerCase());
            const collegeMatch = filters.college === 'all' || grant.college === filters.college;
            const degreeMatch = filters.degree === 'all' || grant.degree === filters.degree;
            const nationalityMatch = filters.nationality === 'all' || grant.nationality === filters.nationality;
            return searchMatch && collegeMatch && degreeMatch && nationalityMatch;
        });
    }, [grants, filters]);

    const { totalStudents, totalMale, totalFemale, nationalityCount } = useMemo(() => {
        return filteredGrants.reduce((acc, grant) => {
            acc.totalStudents += (grant.male_count || 0) + (grant.female_count || 0);
            acc.totalMale += (grant.male_count || 0);
            acc.totalFemale += (grant.female_count || 0);
            acc.nationalities.add(grant.nationality);
            return acc;
        }, { totalStudents: 0, totalMale: 0, totalFemale: 0, nationalities: new Set() });
    }, [filteredGrants]);

    const nationalityChartData = useMemo(() => {
        const counts = filteredGrants.reduce((acc, grant) => {
            const total = (grant.male_count || 0) + (grant.female_count || 0);
            if (total > 0) {
              acc[grant.nationality] = (acc[grant.nationality] || 0) + total;
            }
            return acc;
        }, {});
        return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 10);
    }, [filteredGrants]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({...prev, [filterName]: value}));
    };
    
    if (loading) {
        return <div className="flex items-center justify-center h-full text-white text-xl">جاري تحميل البيانات...</div>;
    }

    return (
        <div dir="rtl" className="p-4 md:p-8 space-y-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-white">إحصائيات طلاب المنح</h1>
                <p className="text-blue-200 mt-1">نظرة تفصيلية على طلاب المنح الدراسية في الجامعة لعام 1445هـ</p>
            </motion.div>

            <motion.div 
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            >
                <StatCard title="إجمالي الطلاب" value={totalStudents} icon={Users} color="bg-blue-500" />
                <StatCard title="الطلاب الذكور" value={totalMale} icon={User} color="bg-indigo-500" />
                <StatCard title="الطالبات الإناث" value={totalFemale} icon={User} color="bg-pink-500" />
                <StatCard title="عدد الجنسيات" value={nationalityCount.size} icon={Globe} color="bg-green-500" />
            </motion.div>

            <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">مرشحات البحث</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Input
                        placeholder="ابحث بالتخصص..."
                        value={filters.searchTerm}
                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                        className="bg-white"
                    />
                    <Select value={filters.college} onValueChange={(v) => handleFilterChange('college', v)}>
                        <SelectTrigger><SelectValue placeholder="اختر الكلية" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">جميع الكليات</SelectItem>
                            {uniqueColleges.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select value={filters.degree} onValueChange={(v) => handleFilterChange('degree', v)}>
                        <SelectTrigger><SelectValue placeholder="اختر الدرجة العلمية" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">جميع الدرجات</SelectItem>
                            {uniqueDegrees.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={filters.nationality} onValueChange={(v) => handleFilterChange('nationality', v)}>
                        <SelectTrigger><SelectValue placeholder="اختر الجنسية" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">جميع الجنسيات</SelectItem>
                            {uniqueNationalities.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">أعلى 10 جنسيات</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={nationalityChartData} layout="vertical" margin={{ right: 20, left: 20 }}>
                           <CartesianGrid strokeDasharray="3 3" />
                           <XAxis type="number" />
                           <YAxis type="category" dataKey="name" width={80} />
                           <Tooltip />
                           <Legend />
                           <Bar dataKey="value" name="عدد الطلاب" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">تفاصيل الطلاب</h3>
                    <div className="overflow-auto h-[400px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>التخصص</TableHead>
                                    <TableHead>الجنسية</TableHead>
                                    <TableHead>الذكور</TableHead>
                                    <TableHead>الإناث</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredGrants.map(grant => (
                                    <TableRow key={grant.id}>
                                        <TableCell>{grant.specialization}</TableCell>
                                        <TableCell>{grant.nationality}</TableCell>
                                        <TableCell>{grant.male_count || 0}</TableCell>
                                        <TableCell>{grant.female_count || 0}</TableCell>
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