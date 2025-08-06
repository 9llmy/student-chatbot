
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  MessageCircle,
  GraduationCap,
  LayoutDashboard,
  BarChart3,
  Feather,
  BookOpen,
  BookUp,
  Users as UsersIcon,
  Briefcase,
  Award,
  UsersRound,
  FileText,
  BookMarked,
  Wallet,
  ClipboardList,
  Menu, // New Icon
  X, // New Icon
  Sun, // New Icon
  Moon // New Icon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger } from
"@/components/ui/sidebar";

const navigationItems = [
{
  title: "المساعد الذكي",
  title_en: "AI Assistant",
  url: createPageUrl("Chat"),
  icon: MessageCircle
},
{
  title: "لوحة التحكم",
  title_en: "Dashboard",
  url: createPageUrl("Dashboard"),
  icon: LayoutDashboard
},
{
  title: "إحصائيات عامة",
  title_en: "General Statistics",
  url: createPageUrl("Statistics"),
  icon: BarChart3
},
{
  title: "الكليات",
  title_en: "Colleges",
  url: createPageUrl("Colleges"),
  icon: GraduationCap
},
{
  title: "البرامج الأكاديمية",
  title_en: "Academic Programs",
  url: createPageUrl("AcademicPrograms"),
  icon: BookOpen
},
{
  title: "الكراسي البحثية",
  title_en: "Research Chairs",
  url: createPageUrl("ResearchChairs"),
  icon: Feather
},
{
  title: "المبتعثون",
  title_en: "Scholarships",
  url: createPageUrl("Scholarships"),
  icon: BookUp
},
{
  title: "طلاب المنح",
  title_en: "Student Grants",
  url: createPageUrl("StudentGrants"),
  icon: ClipboardList
},
{
  title: "الدورات التدريبية",
  title_en: "Training Programs",
  url: createPageUrl("TrainingPrograms"),
  icon: BookMarked
},
{
  title: "نتائج الاختبارات الوطنية",
  title_en: "National Exam Results",
  url: createPageUrl("NationalExamResults"),
  icon: Award
},
{
  title: "خدمات الصندوق الطلابي",
  title_en: "Student Fund Services",
  url: createPageUrl("StudentFundServices"),
  icon: Wallet
},
{
  title: "أعضاء هيئة التدريس",
  title_en: "Faculty",
  url: createPageUrl("FacultyStatistics"),
  icon: UsersRound
},
{
  title: "مؤهلات هيئة التدريس",
  title_en: "Faculty Qualifications",
  url: createPageUrl("FacultyQualifications"),
  icon: Award
},
{
  title: "إحصائيات الموظفين",
  title_en: "Employee Statistics",
  url: createPageUrl("EmployeeStatistics"),
  icon: Briefcase
},
{
  title: "مؤهلات الموظفين",
  title_en: "Employee Qualifications",
  url: createPageUrl("EmployeeQualifications"),
  icon: FileText
}];



export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const currentPage = navigationItems.find((item) => item.url === location.pathname);

  return (
    <div dir="rtl" className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className={`bg-white dark:bg-gray-900 border-l dark:border-gray-700 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
          <div className="flex flex-col h-full">
              <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
                <Link to={createPageUrl("Chat")} className={`flex items-center gap-3 overflow-hidden transition-all ${isSidebarOpen ? 'w-auto' : 'w-0'}`}>
                    <div className="bg-blue-600 rounded-lg p-2">
                      <GraduationCap className="text-white w-6 h-6" />
                    </div>
                    <span className="font-bold text-lg dark:text-white">جامعة القصيم</span>
                </Link>
                <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300">
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
              </div>

              <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                  {navigationItems.map((item) =>
            <Link
              key={item.title}
              to={item.url}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
              location.pathname === item.url ?
              'bg-blue-600 text-white shadow-md' :
              'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`
              }>

                          <item.icon className="w-6 h-6 flex-shrink-0" />
                          <span className={`transition-all duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>{item.title}</span>
                      </Link>
            )}
              </nav>

              <div className="p-4 border-t dark:border-gray-700">
                <button onClick={toggleTheme} className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
              </div>
          </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-800 overflow-hidden">
          <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 p-4 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {currentPage?.title || "مساعد جامعة القصيم"}
            </h1>
          </header>
          <main className="px-6 py-2 flex-1 overflow-y-auto">
            {children}
          </main>
      </div>
    </div>);

}
