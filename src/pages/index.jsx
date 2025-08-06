import Layout from "./Layout.jsx";

import Chat from "./Chat";

import Colleges from "./Colleges";

import Dashboard from "./Dashboard";

import Statistics from "./Statistics";

import ResearchChairs from "./ResearchChairs";

import AcademicPrograms from "./AcademicPrograms";

import Scholarships from "./Scholarships";

import EmployeeStatistics from "./EmployeeStatistics";

import EmployeeQualifications from "./EmployeeQualifications";

import FacultyStatistics from "./FacultyStatistics";

import FacultyQualifications from "./FacultyQualifications";

import NationalExamResults from "./NationalExamResults";

import StudentFundServices from "./StudentFundServices";

import StudentGrants from "./StudentGrants";

import TrainingPrograms from "./TrainingPrograms";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Chat: Chat,
    
    Colleges: Colleges,
    
    Dashboard: Dashboard,
    
    Statistics: Statistics,
    
    ResearchChairs: ResearchChairs,
    
    AcademicPrograms: AcademicPrograms,
    
    Scholarships: Scholarships,
    
    EmployeeStatistics: EmployeeStatistics,
    
    EmployeeQualifications: EmployeeQualifications,
    
    FacultyStatistics: FacultyStatistics,
    
    FacultyQualifications: FacultyQualifications,
    
    NationalExamResults: NationalExamResults,
    
    StudentFundServices: StudentFundServices,
    
    StudentGrants: StudentGrants,
    
    TrainingPrograms: TrainingPrograms,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Chat />} />
                
                
                <Route path="/Chat" element={<Chat />} />
                
                <Route path="/Colleges" element={<Colleges />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Statistics" element={<Statistics />} />
                
                <Route path="/ResearchChairs" element={<ResearchChairs />} />
                
                <Route path="/AcademicPrograms" element={<AcademicPrograms />} />
                
                <Route path="/Scholarships" element={<Scholarships />} />
                
                <Route path="/EmployeeStatistics" element={<EmployeeStatistics />} />
                
                <Route path="/EmployeeQualifications" element={<EmployeeQualifications />} />
                
                <Route path="/FacultyStatistics" element={<FacultyStatistics />} />
                
                <Route path="/FacultyQualifications" element={<FacultyQualifications />} />
                
                <Route path="/NationalExamResults" element={<NationalExamResults />} />
                
                <Route path="/StudentFundServices" element={<StudentFundServices />} />
                
                <Route path="/StudentGrants" element={<StudentGrants />} />
                
                <Route path="/TrainingPrograms" element={<TrainingPrograms />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}