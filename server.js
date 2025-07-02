try {
  require('dotenv').config();
} catch (err) {
  console.warn('⚠️  dotenv not installed, skipping .env loading');
}
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const collegesRaw = JSON.parse(fs.readFileSync('colleges.json', 'utf8'));
const collegesData = collegesRaw.colleges;

function convertCollegesToText(data) {
  return data.map(college => `
📘 ${college.name_ar} (${college.name_en})
- الموقع: ${college.location_ar}
- سنة التأسيس: ${college.established_year}
- نسبة رضا الطلاب: ${college.students_satisfaction}%
- جودة التعليم: ${college.learning_outcome_achievement}%
- نسبة النجاح في الاختبارات الوطنية: ${college.national_exam_pass_rate}%
- عدد الأبحاث المنشورة: ${college.research_publications}
- عدد براءات الاختراع: ${college.patents_count}
- نسبة التوظيف خلال سنة من التخرج: ${college.graduate_employment_within_1_year}%
- رضا جهات التوظيف: ${college.employer_satisfaction_with_graduates}%
- الخدمات الرقمية: ${college.digital_services_coverage}%
- مدمج فيه الذكاء الاصطناعي؟ ${college.ai_curriculum_integration ? "نعم" : "لا"}
`).join('\n');
}

const collegesText = convertCollegesToText(collegesData);

app.post('/ask', async (req, res) => {
  const question = req.body.question?.trim();
  if (!question) return res.status(400).json({ answer: "يرجى كتابة سؤال صالح." });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `أنت مساعد ذكي للطلاب في جامعة القصيم. أجب فقط باستخدام المعلومات التالية:\n${collegesText}`
        },
        { role: 'user', content: question }
      ]
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    res.status(500).json({ answer: "حدث خطأ أثناء الاتصال بالخادم." });
  }
});

app.listen(3000, () => {
  console.log("✅ API تعمل على http://localhost:3000");
});
