const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Fuse = require('fuse.js'); // اضافة مكتبة البحث الضبابي

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FOLDER = path.join(__dirname, 'data');

// تحميل جميع ملفات JSON من مجلد data/
function loadAllColleges() {
    if (!fs.existsSync(DATA_FOLDER)) {
        return [];
    }

    const allFiles = fs.readdirSync(DATA_FOLDER).filter(file => file.endsWith('.json'));
    let allColleges = [];

    for (const file of allFiles) {
        try {
            const filePath = path.join(DATA_FOLDER, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (Array.isArray(content.colleges)) {
                allColleges = allColleges.concat(content.colleges);
            }
        } catch (e) {
            console.error(`خطأ في تحميل ملف ${file}:`, e.message);
        }
    }

    return allColleges;
}

const colleges = loadAllColleges();

// تهيئة محرك البحث الضبابي
const fuseOptions = {
    keys: ['name_ar', 'name_en'],
    threshold: 0.3,
    includeScore: true
};
const fuse = new Fuse(colleges, fuseOptions);
// مرادفات وأسئلة
const fieldMappings = [
    // البيانات الأساسية
    {
        label: "اسم الكلية",
        field: "name_ar",
        synonyms: ["اسم الكلية", "الكلية", "الاسم", "الجامعة", "المعهد"]
    },
    {
        label: "الموقع",
        field: "location_ar",
        synonyms: ["الموقع", "المكان", "العنوان", "المقر", "الفروع", "الفرع"]
    },
    {
        label: "سنة التأسيس",
        field: "established_year",
        synonyms: ["سنة التأسيس", "تاريخ الإنشاء", "العام", "سنة البدء", "تاريخ التأسيس"]
    },

    // الأكاديمية والجودة
    {
        label: "رضا الطلاب",
        field: "students_satisfaction",
        synonyms: ["رضا الطلاب", "استبيان الطلاب", "مستوى الرضا", "تقييم الطلاب", "رأي الطلاب"]
    },
    {
        label: "صعوبة المقررات",
        field: "course_difficulty",
        synonyms: ["صعوبة المقررات", "مستوى الصعوبة", "صعوبة المواد", "صعوبة المناهج", "تحدي المقررات"]
    },
    {
        label: "جودة أعضاء هيئة التدريس",
        field: "faculty_quality",
        synonyms: ["أعضاء هيئة التدريس", "جودة المعلمين", "كفاءة الكادر", "المدرسين", "الأساتذة", "كفاءة المحاضرين"]
    },
    {
        label: "تحقيق مخرجات التعلم",
        field: "learning_outcome_achievement",
        synonyms: ["جودة التعليم", "كفاءة التعليم", "مخرجات التعلم", "مستوى التعليم", "النتائج التعليمية"]
    },
    {
        label: "نسبة النجاح في الاختبارات الوطنية",
        field: "national_exam_pass_rate",
        synonyms: ["نسبة النجاح", "نتائج الاختبارات", "اختبارات وطنية", "امتحانات وطنية", "معدل النجاح"]
    },
    {
        label: "متوسط سنوات التخرج",
        field: "average_years_to_graduate",
        synonyms: ["عدد سنوات التخرج", "مدة الدراسة", "سنوات الدراسة", "متوسط التخرج", "مدة التخرج"]
    },
    {
        label: "معدل التسرب",
        field: "dropout_rate",
        synonyms: ["معدل التسرب", "نسبة الانسحاب", "الطلاب المنسحبين", "نسبة التسرب", "الانسحاب الدراسي"]
    },
    {
        label: "جودة المناهج",
        field: "curriculum_quality",
        synonyms: ["جودة المناهج", "كفاءة المقررات", "المحتوى الدراسي", "المقررات", "الخطط الدراسية"]
    },
    {
        label: "الاعتماد الأكاديمي",
        field: "accreditation_status_ar",
        synonyms: ["الاعتماد الأكاديمي", "هل معتمد", "الاعتماد الدولي", "شهادة الاعتماد", "جودة الاعتماد"]
    },
    {
        label: "نتيجة مراجعة الجودة",
        field: "internal_quality_audit_score",
        synonyms: ["مراجعة الجودة", "تدقيق الجودة", "تقييم الجودة", "مراقبة الجودة", "ضمان الجودة"]
    },
    {
        label: "مبادرات تحسين الجودة",
        field: "quality_improvement_initiatives",
        synonyms: ["تحسين الجودة", "مبادرات الجودة", "تطوير الجودة", "خطة التحسين", "تطوير الأكاديمي"]
    },

    // البحث والابتكار
    {
        label: "عدد الأبحاث",
        field: "research_publications",
        synonyms: ["عدد الأبحاث", "المنشورات العلمية", "أبحاث", "بحوث", "المقالات", "الأوراق العلمية"]
    },
    {
        label: "أبحاث سكوبس",
        field: "scopus_indexed_publications",
        synonyms: ["أبحاث سكوبس", "منشورات مفهرسة", "سكوبس", "أبحاث مصنفة", "مستودع سكوبس"]
    },
    {
        label: "المشاريع البحثية",
        field: "active_research_projects",
        synonyms: ["المشاريع البحثية", "أبحاث نشطة", "مشاريع علمية", "البحث العلمي", "المشاريع الجارية"]
    },
    {
        label: "التعاون البحثي الدولي",
        field: "international_research_collaborations",
        synonyms: ["تعاون بحثي", "شراكات بحثية", "تعاون دولي", "أبحاث مشتركة", "شراكات علمية"]
    },
    {
        label: "تمويل البحوث",
        field: "research_funding",
        synonyms: ["تمويل البحوث", "ميزانية الأبحاث", "دعم البحث العلمي", "التمويل البحثي", "رأس مال الأبحاث"]
    },
    {
        label: "براءات الاختراع",
        field: "patents_count",
        synonyms: ["براءات الاختراع", "اختراعات", "عدد براءات", "البراءات", "الإنجازات العلمية"]
    },
    {
        label: "تعاون مع الصناعة",
        field: "faculty_industry_collaboration_projects",
        synonyms: ["تعاون صناعي", "شراكة مع الشركات", "ربط الصناعة", "مشاريع مشتركة", "التعاون مع القطاع الخاص"]
    },
    {
        label: "أبحاث البيانات الضخمة",
        field: "big_data_research_projects",
        synonyms: ["بيانات ضخمة", "أبحاث البيانات", "البحث في البيانات", "التحليل الضخم", "big data"]
    },

    // الشراكات الدولية
    {
        label: "الشراكات الدولية",
        field: "international_partnerships",
        synonyms: ["الشراكات الدولية", "العلاقات الخارجية", "تعاون دولي", "شراكات عالمية", "مذكرات تفاهم"]
    },
    {
        label: "مذكرات التفاهم",
        field: "mous_signed",
        synonyms: ["مذكرات التفاهم", "اتفاقيات", "مذكرات تعاون", "عقود شراكة", "اتفاقيات دولية"]
    },
    {
        label: "تبادل الطلاب",
        field: "student_exchange_opportunities",
        synonyms: ["تبادل الطلاب", "برامج التبادل", "الدراسة بالخارج", "تبادل ثقافي", "الطلاب الدوليين"]
    },
    {
        label: "تبادل أعضاء هيئة التدريس",
        field: "faculty_exchange_programs",
        synonyms: ["تبادل الأساتذة", "تبادل أعضاء التدريس", "برامج التبادل الأكاديمي", "زمالات تدريسية"]
    },

    // الحياة الطلابية
    {
        label: "نشاط الأندية",
        field: "student_club_activity",
        synonyms: ["نشاط الأندية", "الأندية الطلابية", "فعاليات طلابية", "أنشطة طلابية", "نشاطات ترفيهية"]
    },
    {
        label: "برامج الإرشاد",
        field: "student_mentorship_programs",
        synonyms: ["برامج الإرشاد", "التوجيه الطلابي", "مرشدين أكاديميين", "دعم الطلاب", "الإرشاد الأكاديمي"]
    },
    {
        label: "خدمات الإرشاد",
        field: "student_counseling_usage",
        synonyms: ["خدمات الإرشاد", "استشارات طلابية", "دعم نفسي", "الإرشاد الوظيفي", "التوجيه النفسي"]
    },
    {
        label: "مشاركة الطلاب",
        field: "student_engagement_in_activities",
        synonyms: ["مشاركة الطلاب", "تفاعل الطلاب", "الأنشطة اللاصفية", "الفعاليات", "النشاط الطلابي"]
    },
    {
        label: "ملف الإنجاز",
        field: "student_portfolio_system_usage",
        synonyms: ["ملف الإنجاز", "السجل الأكاديمي", "محفظة الأعمال", "السيرة الطلابية", "تتبع الإنجازات"]
    },

    // التوظيف والمهنية
    {
        label: "توظيف الخريجين",
        field: "graduate_employment_within_1_year",
        synonyms: ["نسبة التوظيف", "توظيف الخريجين", "بعد التخرج", "وظائف", "معدل التشغيل", "توظيف خلال سنة"]
    },
    {
        label: "رضا أصحاب العمل",
        field: "employer_satisfaction_with_graduates",
        synonyms: ["رضا أصحاب العمل", "تقييم أرباب العمل", "جودة الخريجين", "تقيم الشركات", "رضا جهات التوظيف"]
    },
    {
        label: "برامج الإعداد المهني",
        field: "career_preparation_programs",
        synonyms: ["الإعداد المهني", "التأهيل الوظيفي", "برامج التوظيف", "التدريب المهني", "تهيئة سوق العمل"]
    },
    {
        label: "مواءمة السوق",
        field: "market_needs_alignment",
        synonyms: ["مواءمة السوق", "احتياجات سوق العمل", "ملاءمة التوظيف", "متطلبات التوظيف", "ربط السوق"]
    },
    {
        label: "خدمات التوظيف",
        field: "career_services_satisfaction",
        synonyms: ["خدمات التوظيف", "مكتب التوظيف", "التوجيه الوظيفي", "دعم التوظيف", "الخدمات المهنية"]
    },
    {
        label: "مجلس المستشارين",
        field: "employer_advisory_board_meetings",
        synonyms: ["مجلس المستشارين", "لجان استشارية", "استشارات أرباب العمل", "مجلس التوظيف", "مستشاري التوظيف"]
    },

    // التكنولوجيا والابتكار
    {
        label: "التسجيل الإلكتروني",
        field: "online_registration_success_rate",
        synonyms: ["التسجيل الإلكتروني", "التسجيل عبر الإنترنت", "التسجيل الرقمي", "نظام التسجيل", "التسجيل الالكتروني"]
    },
    {
        label: "الخدمات الرقمية",
        field: "digital_services_coverage",
        synonyms: ["الخدمات الرقمية", "التغطية الرقمية", "التحول الرقمي", "الخدمات الإلكترونية", "التقنية الرقمية"]
    },
    {
        label: "المشاريع الابتكارية",
        field: "innovation_projects_supported",
        synonyms: ["المشاريع الابتكارية", "دعم الابتكار", "مشاريع إبداعية", "الابتكار", "الأفكار الجديدة"]
    },
    {
        label: "مسابقات ريادة الأعمال",
        field: "entrepreneurship_competitions",
        synonyms: ["مسابقات ريادة الأعمال", "مسابقات الابتكار", "مسابقات الشركات الناشئة", "تحديات ريادة الأعمال"]
    },
    {
        label: "خدمات الحوسبة السحابية",
        field: "cloud_services_utilization",
        synonyms: ["الحوسبة السحابية", "السحابة الإلكترونية", "خدمات سحابية", "التخزين السحابي", "cloud computing"]
    },
    {
        label: "دمج الذكاء الاصطناعي",
        field: "ai_curriculum_integration",
        synonyms: ["ذكاء اصطناعي", "الذكاء", "هل تدرس ai", "مناهج ai", "مناهج الذكاء", "التعلم الآلي", "الذكاء الصناعي"]
    },

    // الإدارة والعمليات
    {
        label: "كفاءة العمليات",
        field: "administrative_process_efficiency",
        synonyms: ["كفاءة العمليات", "الإدارة الفعالة", "جودة الإدارة", "فعالية الإجراءات", "الإنتاجية الإدارية"]
    },
    {
        label: "حل الشكاوى",
        field: "complaint_resolution_time_days",
        synonyms: ["حل الشكاوى", "وقت الاستجابة", "معالجة الشكاوى", "دعم المستخدمين", "الشكاوي"]
    },
    {
        label: "رضا أعضاء هيئة التدريس",
        field: "faculty_satisfaction",
        synonyms: ["رضا الأساتذة", "رأي أعضاء التدريس", "استطلاع هيئة التدريس", "مستوى رضا الكادر الأكاديمي"]
    },
    {
        label: "تدريب الإداريين",
        field: "administrative_training_hours",
        synonyms: ["تدريب الإداريين", "ساعات تدريبية", "تطوير الكادر الإداري", "ورش عمل إدارية", "التدريب الوظيفي"]
    },
    {
        label: "دوران الموظفين",
        field: "staff_turnover_rate",
        synonyms: ["دوران الموظفين", "استقرار الموظفين", "نسبة الاستقالات", "ثبات الكوادر", "تنقل الموظفين"]
    }

    //  أضف المزيد حسب الحاجة
];

// دالة محسنة لتحليل السؤال والرد
function answerQuestion(question) {
    const q = question.toLowerCase().replace(/\s+/g, ' ').trim();

    // 1. البحث عن الكلية باستخدام البحث الضبابي
    const searchResults = fuse.search(q);
    const matchedColleges = searchResults
        .filter(result => result.score < 0.4)
        .map(result => result.item);

    if (matchedColleges.length === 0) {
        return "❌ لم أتمكن من تحديد الكلية في سؤالك. يرجى التأكد من ذكر اسم الكلية بشكل صحيح.";
    }


    if (matchedColleges.length === 0) {
        return " لم أتمكن من تحديد الكلية في سؤالك. يرجى التأكد من ذكر اسم الكلية بشكل صحيح.";
    }

    // 2. البحث عن الحقول بدقة
    let matchedField = null;
    for (const item of fieldMappings) {
        const foundSynonym = item.synonyms.find(syn => {
            const regex = new RegExp(`\\b${syn.toLowerCase()}\\b`);
            return regex.test(q);
        });

        if (foundSynonym) {
            matchedField = item;
            break;
        }
    }

    if (!matchedField) {
        return "❌ لم أفهم ما الذي تريد معرفته عن الكلية. يرجى صياغة السؤال بشكل أوضح.";
    }
    // 3. معالجة الردود
    const responses = matchedColleges.map(college => {
        const value = college[matchedField.field];


        // تنسيق الردود حسب نوع البيانات
        if (typeof value === 'boolean') {
            return value ?
                `✅ نعم، ${matchedField.label} متوفر في ${college.name_ar}` :
                `❌ لا، ${matchedField.label} غير متوفر في ${college.name_ar}`;
        }

        // تنسيق النسب المئوية
        if (matchedField.field.includes('satisfaction') ||
            matchedField.field.includes('rate') ||
            matchedField.field.includes('quality')) {
            return `${matchedField.label} في ${college.name_ar}: ${value}%`;
        }

        // تنسيق الأموال
        if (matchedField.field === 'research_funding') {
            const formatted = new Intl.NumberFormat('ar-SA').format(value);
            return `${matchedField.label} في ${college.name_ar}: ${formatted} ريال`; // إصلاح هنا
        }

        // الرد العام
        return `${matchedField.label} في ${college.name_ar}: ${value}`;
    });

    return responses.join('\n\n');
}

// نقطة نهاية API
app.post('/ask', (req, res) => {
    const question = req.body.question?.trim();
    if (!question) return res.status(400).json({ answer: "يرجى إدخال سؤال." });

    try {
        const answer = answerQuestion(question);
        res.json({ answer });
    } catch (e) {
        res.status(500).json({ error: "حدث خطأ أثناء معالجة السؤال" });
    }
});

// نقطة نهاية للحصول على قائمة الكليات
app.get('/colleges', (req, res) => {
    res.json(colleges.map(c => ({
        id: c.college_id,
        name_ar: c.name_ar,
        name_en: c.name_en
    })));
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ API تعمل على http://localhost:${PORT}`);
});