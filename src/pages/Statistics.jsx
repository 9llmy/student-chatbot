
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { Users, GraduationCap, Building, BookOpen, FlaskConical, AreaChart, Star, Award } from 'lucide-react';

const universityStats = {
  students: 64756,
  faculty: 2519,
  colleges: 38,
  programs: 230,
  researchPapers: 7157,
  area: 46,
};

const studentDistribution = [
  { name: 'بكالوريوس', value: 62187 },
  { name: 'ماجستير', value: 1596 },
  { name: 'دكتوراه', value: 684 },
  { name: 'دبلوم', value: 289 },
];

const facultyNationality = [
  { name: 'سعودي', value: 1831 },
  { name: 'غير سعودي', value: 688 },
];

const rankings = [
    { name: 'QS Stars', value: '5 نجوم', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/QS_Stars_logo.svg/1200px-QS_Stars_logo.svg.png' },
    { name: 'Shanghai Ranking', value: '901-1000', logo: 'https://www.shanghairanking.com/images/shanghairanking-logo.svg' },
    { name: 'Times Higher Education', value: '801-1000', logo: 'https://www.timeshighereducation.com/themes/custom/the_responsive/logo.svg' },
    { name: 'QS World Ranking', value: '801+', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/QS_World_University_Rankings_logo_2022.svg/1280px-QS_World_University_Rankings_logo_2022.svg.png' },
];

const StatCard = ({ title, value, icon: Icon, unit, color }) => (
  <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900 text-right">{value.toLocaleString('ar-SA')} <span className="text-base font-normal">{unit}</span></div>
    </CardContent>
  </Card>
);

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value.toLocaleString('ar-SA')}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};


export default function StatisticsPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  return (
    <div dir="rtl" className="p-4 md:p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">إحصائيات الجامعة</h1>
        <p className="text-blue-200 mt-1">نظرة شاملة على أرقام وإنجازات جامعة القصيم لعام 1444هـ</p>
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {},
        }}
      >
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatCard title="إجمالي الطلاب" value={universityStats.students} unit="طالب وطالبة" icon={Users} color="bg-blue-500" />
        </motion.div>
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatCard title="أعضاء هيئة التدريس" value={universityStats.faculty} unit="عضو" icon={GraduationCap} color="bg-green-500" />
        </motion.div>
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatCard title="الكليات" value={universityStats.colleges} unit="كلية" icon={Building} color="bg-indigo-500" />
        </motion.div>
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatCard title="البرامج الأكاديمية" value={universityStats.programs} unit="برنامج" icon={BookOpen} color="bg-purple-500" />
        </motion.div>
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatCard title="الأبحاث المنشورة" value={universityStats.researchPapers} unit="بحث" icon={FlaskConical} color="bg-yellow-500" />
        </motion.div>
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatCard title="إجمالي المساحة" value={universityStats.area} unit="مليون م²" icon={AreaChart} color="bg-red-500" />
        </motion.div>
      </motion.div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">توزيع الطلاب حسب الدرجة العلمية</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="عدد الطلاب" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        
        <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">توزيع أعضاء هيئة التدريس حسب الجنسية</h3>
          <ResponsiveContainer width="100%" height={300}>
             <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={facultyNationality}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                nameKey="name"
              >
                 {facultyNationality.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#2563eb', '#93c5fd'][index % 2]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>
       </div>
       
       <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Award className="text-yellow-500"/> التصنيفات والاعتمادات الدولية</h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
           {rankings.map(rank => (
             <motion.div key={rank.name} whileHover={{scale: 1.05}} className="flex flex-col items-center justify-center p-4 bg-gray-50/50 rounded-lg">
                <img src={rank.logo} alt={rank.name} className="h-12 mb-3 object-contain"/>
                <p className="font-bold text-gray-800">{rank.name}</p>
                <p className="text-blue-600 font-semibold">{rank.value}</p>
             </motion.div>
           ))}
         </div>
       </Card>
    </div>
  );
}
