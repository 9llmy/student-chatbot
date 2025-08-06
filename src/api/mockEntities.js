
// mockEntities.js - Fake entity models for local development

export const College = {
  getAll: async () => [
    { id: 1, name: "كلية الهندسة", satisfaction: 87 },
    { id: 2, name: "كلية الطب", satisfaction: 92 },
  ]
};

export const ChatMessage = {
  send: async (message) => ({ id: Date.now(), message, sender: "user", reply: "رد وهمي" })
};

export const ServiceStatistic = { getAll: async () => [] };
export const ResearchChair = { getAll: async () => [] };
export const AcademicProgram = { getAll: async () => [] };
export const ScholarshipStat = { getAll: async () => [] };
export const EmployeeStatistic = { getAll: async () => [] };
export const EmployeeQualification = { getAll: async () => [] };
export const FacultyStatistic = { getAll: async () => [] };
export const FacultyQualificationStat = { getAll: async () => [] };
export const NationalExamResult = { getAll: async () => [] };
export const StudentFundService = { getAll: async () => [] };
export const StudentGrant = { getAll: async () => [] };
export const TrainingProgram = { getAll: async () => [] };
export const User = { login: async () => ({ name: "Test User" }) };
