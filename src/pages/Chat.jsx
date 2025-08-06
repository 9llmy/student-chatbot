
import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, College } from "@/api/mockEntities";
import { InvokeLLM } from "@/api/mockAPI";
import { motion, AnimatePresence } from "framer-motion";

import MessageBubble from "../components/chat/MessageBubble";
import SuggestionChips from "../components/chat/SuggestionChips";
import TypingIndicator from "../components/chat/TypingIndicator";
import ChatInput from "../components/chat/ChatInput";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [colleges, setColleges] = useState([]);
  const messagesEndRef = useRef(null);
  const sessionId = useRef(Date.now().toString());

  // قاعدة معرفة شاملة بالكليات والأقسام
  const collegeDetails = {
    "كلية الشريعة": {
      departments: ["القرآن وعلومه", "السنة وعلومها", "العقيدة والمذاهب المعاصرة", "الفقه", "أصول الفقه", "الأنظمة"]
    },
    "كلية اللغات والعلوم الإنسانية": {
      departments: ["اللغة العربية وآدابها", "التاريخ والتراث", "الجغرافيا", "الاجتماع والخدمة الاجتماعية", "اللغة الإنجليزية وآدابها", "تعليم اللغة العربية لغير الناطقين بها", "اللغات الأجنبية", "السياحة والآثار", "الإعلام والاتصال", "علم النفس"]
    },
    "كلية الزراعة والأغذية": {
      departments: ["إنتاج النبات", "وقاية النبات", "إنتاج الحيوان والدواجن", "الاقتصاد والإرشاد الزراعي", "علوم الأغذية وتغذية الإنسان", "الهندسة الزراعية والنظم الحيوية", "البيئة والموارد الطبيعية"]
    },
    "كلية الطب البيطري": {
      departments: ["العلوم الطبية الحيوية", "الأمراض والتشخيص المختبري", "الطب الوقائي البيطري", "العلوم الإكلينيكية"]
    },
    "كلية الأعمال والاقتصاد": {
      departments: ["إدارة الأعمال", "التمويل", "المحاسبة", "نظم المعلومات الإدارية", "الاقتصاد", "التأمين", "إدارة العمليات"]
    },
    "كلية العلوم": {
      departments: ["الرياضيات", "الإحصاء وبحوث العمليات", "الفيزياء", "الكيمياء", "الأحياء"]
    },
    "كلية الهندسة": {
      departments: ["الهندسة الكهربائية", "الهندسة المدنية", "الهندسة الميكانيكية", "الهندسة الكيميائية", "الهندسة الصناعية"]
    },
    "كلية العمارة والتخطيط": {
      departments: ["العمارة", "التخطيط"]
    },
    "كلية الطب": {
      departments: ["الطب النفسي", "العظام", "طب وجراحة العيون", "النساء والتوليد", "طب الأسرة والمجتمع", "علم الأمراض", "الجراحة", "الجلدية", "الأشعة والتصوير الطبي", "طب الأطفال", "الأنف والأذن والحنجرة", "الباطنة", "التشريح والأنسجة", "التعليم الطبي", "علم وظائف الأعضاء", "طب الطوارئ والعناية والتخدير", "علم الأحياء والمناعة"]
    },
    "كلية الحاسب": {
      departments: ["علوم الحاسب", "تقنية المعلومات", "هندسة الحاسب", "الأمن السيبراني"]
    },
    "كلية العلوم الطبية التطبيقية": {
      departments: ["العلوم الصحية الأساسية", "تقنية الأشعة", "المختبرات الطبية", "العلاج الطبيعي", "العلاج الوظيفي", "علل النطق والسمع", "الصحة العامة", "البصريات", "المعلومات الصحية"]
    },
    "كلية الصيدلة": {
      departments: ["علم الأدوية والسموم", "ممارسة الصيدلة", "الكيمياء الطبية والعقاقير", "الصيدلانيات"]
    },
    "كلية طب الأسنان": {
      departments: ["علوم تشخيص الفم والوجه والفكين", "علوم الاستعاضة السنية", "علاج وجراحة اللثة وزراعة الأسنان", "التقويم وطب أسنان الأطفال", "جراحة الوجه والفكين", "طب المجتمع لصحة الفم وعلوم الأوبئة", "العلوم الفموية الأساسية وتعليم طب الأسنان", "علوم طب الأسنان التحفظية"]
    },
    "كلية التمريض": {
      departments: ["التعليم التمريضي", "صحة الأم والطفل", "الباطني والجراحي", "الصحة النفسية والعقلية وصحة المجتمع"]
    },
    "كلية التربية": {
      departments: ["أصول التربية", "المناهج وطرق التدريس", "تقنيات التعليم", "التربية الخاصة", "الطفولة المبكرة", "التعليم الأساسي", "القيادة التربوية", "التربية البدنية وعلوم الحركة"]
    },
    "كلية الفنون والتصاميم": {
      departments: ["تصميم الأزياء", "الفن التشكيلي", "التصميم والتصوير الرقمي", "المسرح والدراما", "تصميم الإنتاج", "الإنتاج السينمائي"]
    },
    "الكلية التطبيقية": {
      departments: ["اللغويات التطبيقية", "العلوم الإدارية", "العلوم الهندسية والتصاميم", "العلوم المعلوماتية والحاسوبية", "العلوم الصحية", "علوم الأغذية والحياة", "العلوم الأساسية", "العلوم الاجتماعية"]
    }
  };

  // معلومات إضافية عن الجامعة وإنجازاتها (محدثة من تقرير 1444هـ)
  const universityAchievements = {
    rankings: {
      shanghai: "ضمن أفضل 1000 جامعة في تصنيف شنغهاي الدولي لعام 2023",
      qs_stars: "5 نجوم في تصنيف QS Stars العالمي",
      qs_world: "المرتبة +801 في تصنيف QS العالمي للجامعات",
      times: "المرتبة 801-1000 في تصنيف تايمز العالمي للجامعات",
      academic_programs: "65 برنامجاً أكاديمياً معتمداً (50 وطنياً و 15 دولياً)",
    },
    research: {
      total_publications: "أكثر من 7157 بحثاً منشوراً في منافذ عالمية",
      funded_projects: "1521 مشروعاً بحثياً مدعوماً من ميزانية الجامعة",
      research_centers: "4 مراكز بحثية متخصصة و 7 كراسي بحثية"
    },
    community: {
        beneficiaries: "استفاد 30341 مستفيداً من 247 برنامجاً مجتمعياً متنوعاً"
    }
  };

  const libraryDetails = [
    { name: "مكتبة الأمير د. فيصل بن مشعل بن سعود بن عبدالعزيز", location: "المليداء" },
    { name: "مكتبة مركز الدراسات الجامعية للطالبات", location: "المليداء" },
    { name: "مكتبة كلية الاقتصاد والإدارة (طالبات)", location: "المليداء" },
    { name: "مكتبة كلية العلوم (طالبات)", location: "بريدة" },
    { name: "مكتبة كلية التربية", location: "بريدة" },
    { name: "مكتبة كلية الطب", location: "المليداء" },
    { name: "مكتبة كلية التصاميم والاقتصاد المنزلي (طالبات)", location: "المليداء" },
    { name: "مكتبة كلية اللغات والعلوم الإنسانية (طالبات)", location: "بريدة" },
    { name: "مكتبة الكلية التطبيقية", location: "بريدة" },
    { name: "مكتبة كلية الطب", location: "عنيزة" },
    { name: "مكتبة الكلية التطبيقية", location: "عنيزة" },
    { name: "مكتبة كلية العلوم الصحية التطبيقية", location: "الرس" },
    { name: "مكتبة كلية إدارة الأعمال (طالبات)", location: "الرس" },
    { name: "مكتبة الكلية التطبيقية", location: "المذنب" },
    { name: "مكتبة الكلية التطبيقية", location: "البكيرية" },
    { name: "مكتبة كلية العلوم والآداب في العقلة (طلاب)", location: "العقلة" },
    { name: "مكتبة كلية العلوم والآداب في العقلة (طالبات)", location: "العقلة" },
    { name: "مكتبة الكلية التطبيقية", location: "البدائع" },
    { name: "مكتبة كلية العلوم والآداب بالأسياح (طالبات)", location: "الأسياح" },
  ];

  const researchChairsDetails = [
    { name: "كرسي الشيخ علي بن عبد الرحمن القرعاوي للقرآن وعلومه", description: "في الدراسات القرآنية و خدمة القرآن الكريم وعلومه والمتخصصين فيه من خلال توفير البيئة العلمية المناسبة لإعداد الأبحاث العلمية", location: "المليداء" },
    { name: "كرسي الشيخ صالح بن عبد الله كامل لأبحاث النخيل والتمور", description: "إنتاج وتصنيع وتسويق التمور ومساهمة هذه الدراسات والأبحاث في تجاوز الكثير من المشاكل التي تواجه هذا القطاع خاصه في مجال الإنتاج", location: "المليداء" },
    { name: "كرسي الشيخ عبد الله بن صالح الراشد الحميد لخدمة السيرة والرسول صلى الله عليه وسلم", description: "خدمة السيرة والرسول صلى الله عليه وسلم", location: "المليداء" },
    { name: "كرسي الأمير د. فيصل بن مشعل بن سعود بن عبد العزيز للذكاء الاصطناعي", description: "إعداد الأبحاث العلمية وتعزيز الممارسات النوعية في مجال الذكاء الاصطناعي ودراساته في المملكة العربية السعودية والتحول نحو الاقتصاد المعرفي", location: "المليداء" },
    { name: "كرسي الشيخ عبد العزيز بن صالح بن سليمان السعوي للتنمية الإيجابية وابحاثها في المجتمع", description: "تمويل دراسات وأبحاث علميه في مجال موضوع الإيجابية بأبعادها المختلفة الذاتية ، المؤسسية ، الاسرية، المهنية، البيئية", location: "المليداء" },
    { name: "كرسي الشيخ ابن عثيمين للدراسات الشرعية", description: "تحقيق الأهداف العلمية والبحثية المتمثلة بتراث الشيخ العلمية ودعمها وترجمة النتاج العلمي للشيخ إلى اللغات الحية", location: "المليداء" },
    { name: "كرسي الشيخ فهد بن عبد الله العويضة للوعي الفكري والانتماء الوطني", description: "خدمة الوعي الفكري والانتماء الوطني", location: "المليداء" }
  ];

  useEffect(() => {
    loadColleges();
    // إضافة رسالة ترحيبية
    setMessages([{
      id: 'welcome',
      message: 'أهلاً وسهلاً بك في مساعد جامعة القصيم الذكي! 🎓\n\nيمكنني مساعدتك في:\n• معرفة الكليات المتاحة وأقسامها\n• تفاصيل التخصصات\n• متطلبات القبول\n• معلومات الاتصال\n• مؤشرات الأداء والجودة\n• والمزيد...\n\nكيف يمكنني مساعدتك اليوم؟',
      isBot: true,
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadColleges = async () => {
    try {
      const data = await College.list();
      setColleges(data);
    } catch (error) {
      console.error("خطأ في تحميل بيانات الكليات:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const findCollegeInfo = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // تحسين البحث مع المرادفات
    const aliases = {
        "حاسب": "كلية الحاسب",
        "طب": "كلية الطب", 
        "هندسة": "كلية الهندسة",
        "إدارة": "كلية الاقتصاد والأعمال",
        "اقتصاد": "كلية الاقتصاد والأعمال",
        "علوم": "كلية العلوم",
        "صيدلة": "كلية الصيدلة",
        "تمريض": "كلية التمريض",
        "تربية": "كلية التربية",
        "شريعة": "كلية الشريعة",
        "آداب": "كلية اللغات والعلوم الإنسانية",
        "لغات": "كلية اللغات والعلوم الإنسانية",
        "زراعة": "كلية الزراعة والأغذية",
        "بيطري": "كلية الطب البيطري",
        "عمارة": "كلية العمارة والتخطيط",
        "أسنان": "كلية طب الأسنان",
        "فنون": "كلية الفنون والتصاميم",
        "تصاميم": "كلية الفنون والتصاميم",
        "اعمال": "كلية الأعمال والاقتصاد"
    };

    const normalizedQuery = aliases[lowerQuery] ? aliases[lowerQuery].toLowerCase() : lowerQuery;

    return colleges.find(college => 
      college.name_ar?.toLowerCase().includes(normalizedQuery) ||
      college.name_en?.toLowerCase().includes(normalizedQuery) ||
      Object.keys(aliases).some(key => lowerQuery.includes(key) && aliases[key].toLowerCase().includes(college.name_ar?.toLowerCase()))
    );
  };

  const generateCollegeResponse = (college) => {
    let response = `🏛️ **${college.name_ar}** (${college.name_en})\n`;
    response += `📍 **الموقع:** ${college.location_ar}\n`;  
    response += `🗓️ **سنة التأسيس:** ${college.established_year}\n`;
    response += `🏅 **الاعتماد الأكاديمي:** ${college.accreditation_status_ar}\n\n`;

    // إضافة معلومات الأقسام
    const collegeKey = Object.keys(collegeDetails).find(key => 
      college.name_ar.includes(key.replace("كلية ", "")) || 
      key.includes(college.name_ar.replace("كلية ", "")) ||
      (college.name_ar.includes("الأعمال") && key.includes("الأعمال")) ||
      (college.name_ar.includes("الاقتصاد") && key.includes("الاقتصاد"))
    );
    
    if (collegeKey && collegeDetails[collegeKey]) {
      response += `**📚 الأقسام الأكاديمية:**\n`;
      collegeDetails[collegeKey].departments.forEach((dept, index) => {
        response += `${index + 1}. ${dept}\n`;
      });
      response += `\n`;
    }

    response += `**📊 مؤشرات الجودة:**\n`;
    response += `• رضا الطلاب: ${college.students_satisfaction}%\n`;
    response += `• جودة المناهج: ${college.curriculum_quality}%\n`;
    response += `• جودة هيئة التدريس: ${college.faculty_quality}%\n`;
    response += `• معدل النجاح في الامتحانات الوطنية: ${college.national_exam_pass_rate}%\n\n`;

    response += `**🔬 البحث والابتكار:**\n`;
    response += `• إجمالي الأبحاث المنشورة: ${college.research_publications}\n`;
    response += `• الأبحاث المفهرسة في سكوبوس: ${college.scopus_indexed_publications}\n`;
    response += `• تمويل الأبحاث: ${college.research_funding?.toLocaleString('ar-SA')} ريال\n`;
    response += `• عدد براءات الاختراع: ${college.patents_count}\n\n`;
    
    response += `**🎓 شؤون الخريجين:**\n`;
    response += `• نسبة التوظيف خلال سنة: ${college.graduate_employment_within_1_year}%\n`;
    response += `• رضا جهات التوظيف: ${college.employer_satisfaction_with_graduates}%\n`;
    response += `• متوسط سنوات التخرج: ${college.average_years_to_graduate} سنة\n\n`;

    response += `يمكنك زيارة صفحة الكليات للاطلاع على تفاصيل أوفى ومؤشرات أداء إضافية.`;
    
    return response;
  };

  const generateUniversityInfoResponse = () => {
    let response = `🏛️ **جامعة القصيم - إنجازات متميزة**\n\n`;
    
    response += `**🌟 التصنيفات والاعتمادات:**\n`;
    response += `• ${universityAchievements.rankings.shanghai}\n`;
    response += `• حاصلة على ${universityAchievements.rankings.qs_stars}\n`;
    response += `• تضم ${universityAchievements.rankings.academic_programs}\n\n`;
    
    response += `**🔬 الإنجازات البحثية:**\n`;
    response += `• نشر ${universityAchievements.research.total_publications}\n`;
    response += `• دعم ${universityAchievements.research.funded_projects}\n`;
    response += `• تمتلك الجامعة ${universityAchievements.research.research_centers}\n\n`;

    response += `**🤝 خدمة المجتمع:**\n`;
    response += `• ${universityAchievements.community.beneficiaries}\n\n`;
    
    response += `تعتبر جامعة القصيم من الجامعات الرائدة في المملكة وتساهم بفعالية في تحقيق رؤية 2030.`;
    
    return response;
  };

  const handleSendMessage = async (userMessage) => {
    const newUserMessage = {
      id: Date.now(),
      message: userMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      let response;
      let source = 'local'; // Default source to local for initial checks
      const lowerUserMessage = userMessage.toLowerCase();
      const libraryKeywords = ['مكتبة', 'مكتبات'];
      const researchChairKeywords = ['كرسي', 'كراسي', 'بحثي', 'بحثية'];
      const locations = [...new Set(libraryDetails.map(l => l.location))];
      const foundLocationForLib = locations.find(loc => lowerUserMessage.includes(loc.toLowerCase()));

      // Check for research chair queries
      if (researchChairKeywords.some(keyword => lowerUserMessage.includes(keyword))) {
        // Clean query for matching, removing common prefixes/suffixes
        const cleanedQuery = lowerUserMessage.replace(/كرسي|الشيخ|د\.|الأمير|لـ|للـ|عن/g, "").trim();
        const specificChairQuery = researchChairsDetails.find(chair => 
            lowerUserMessage.includes(chair.name.toLowerCase().replace(/كرسي|الشيخ|د\.|الأمير/g, "").trim()) || // Check full name
            chair.name.toLowerCase().includes(cleanedQuery) // Check if chair name contains cleaned query
        );

        if (specificChairQuery) {
            response = `🖋️ **${specificChairQuery.name}**\n\n**مجالاته:**\n${specificChairQuery.description}\n\n**الموقع:** ${specificChairQuery.location}`;
        } else {
            response = "تضم الجامعة عدة كراسي بحثية متخصصة. إليك القائمة:\n\n";
            researchChairsDetails.forEach(chair => {
                response += `• **${chair.name}**\n`;
            });
            response += "\n\nيمكنك السؤال عن أي كرسي منها بالتحديد أو زيارة صفحة الكراسي البحثية للمزيد من التفاصيل.";
        }
      } 
      // Check for library-related queries
      else if (libraryKeywords.some(keyword => lowerUserMessage.includes(keyword)) || foundLocationForLib) {
        let foundLibs;
        if (foundLocationForLib) {
            foundLibs = libraryDetails.filter(lib => lib.location.toLowerCase() === foundLocationForLib.toLowerCase());
            response = `📚 المكتبات المتوفرة في **${foundLocationForLib}**:\n\n`;
            foundLibs.forEach(lib => { response += `- ${lib.name}\n`; });
        } else {
            // Check if a specific library name (partial or full, excluding "مكتبة ") is mentioned
            const specificLibQuery = libraryDetails.find(lib => 
                lowerUserMessage.includes(lib.name.replace("مكتبة ", "").toLowerCase()) ||
                lowerUserMessage.includes(lib.name.toLowerCase())
            );

            if (specificLibQuery) {
                 response = "🔍 وجدت المكتبة التالية:\n\n";
                 response += `• **${specificLibQuery.name}**\n  📍 الموقع: ${specificLibQuery.location}\n\n`;
            } else {
                response = "📚 إليك قائمة بجميع المكتبات الجامعية ومواقعها:\n\n";
                const groupedByLocation = libraryDetails.reduce((acc, lib) => {
                   acc[lib.location] = acc[lib.location] || [];
                   acc[lib.location].push(lib.name);
                   return acc;
                }, {});

                for (const location in groupedByLocation) {
                   response += `📍 **${location}**:\n`;
                   groupedByLocation[location].forEach(name => {
                       response += `  - ${name}\n`;
                   });
                   response += "\n";
                }
            }
        }
      } // Search for general university info
      else if (lowerUserMessage.includes('جامعة') && (lowerUserMessage.includes('معلومات') || lowerUserMessage.includes('عنها') || lowerUserMessage.includes('تصنيف') || lowerUserMessage.includes('بحث') || lowerUserMessage.includes('إنجازات'))) {
        response = generateUniversityInfoResponse();
      }
      // Search in local database for colleges
      else {
        const foundCollege = findCollegeInfo(userMessage);
        
        if (foundCollege) {
          response = generateCollegeResponse(foundCollege);
        } else {
          source = 'ai'; // Only set source to 'ai' if AI is actually used
          const aiContext = `أنت مساعد ذكي لجامعة القصيم. أجب على الأسئلة باللغة العربية حول:
          - معلومات عامة عن الجامعة
          - إجراءات القبول والتسجيل  
          - الخدمات الطلابية
          - المرافق الجامعية
          - الأقسام والتخصصات
          - مواقع المكتبات
          - الكراسي البحثية
          
          معلومات الكليات والأقسام المتاحة: ${JSON.stringify(collegeDetails, null, 2)}
          معلومات المكتبات الجامعية: ${JSON.stringify(libraryDetails, null, 2)}
          معلومات الكراسي البحثية: ${JSON.stringify(researchChairsDetails, null, 2)}
          إنجازات الجامعة: ${JSON.stringify(universityAchievements, null, 2)}
          
          السؤال: ${userMessage}`;

          const aiResponse = await InvokeLLM({
            prompt: aiContext,
            add_context_from_internet: false
          });

          response = aiResponse || "عذراً، لم أتمكن من فهم سؤالك. يمكنك إعادة صياغته أو اختيار أحد الاقتراحات أعلاه.";
        }
      }

      const botMessage = {
        id: Date.now() + 1,
        message: response,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // حفظ المحادثة
      await ChatMessage.create({
        message: userMessage,
        response: response,
        language: 'ar',
        source: source,
        session_id: sessionId.current
      });

    } catch (error) {
      console.error("خطأ في معالجة الرسالة:", error);
      const errorMessage = {
        id: Date.now() + 1,
        message: "عذراً، حدث خطأ تقني. يرجى المحاولة مرة أخرى.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleSuggestionClick = (suggestion) => {
    if (!isLoading) {
      handleSendMessage(suggestion);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/10 backdrop-blur-md border-b border-white/20 p-6"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            🎓 مساعد جامعة القصيم الذكي
          </h1>
          <p className="text-blue-100 text-lg">
            مساعدك الشخصي للحصول على معلومات شاملة عن الجامعة وكلياتها
          </p>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg.message}
                isBot={msg.isBot}
                timestamp={msg.timestamp}
              />
            ))}
          </AnimatePresence>
          
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestions */}
      <SuggestionChips 
        onSuggestionClick={handleSuggestionClick}
        isLoading={isLoading}
      />

      {/* Input Area */}
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
