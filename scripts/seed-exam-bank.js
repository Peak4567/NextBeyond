const mysql = require("mysql2/promise");

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "nextbeyond",
  });

  const categories = [
    {
      code: "tgat1",
      name: "TGAT1 การสื่อสารภาษาอังกฤษ",
      group_name: "TGAT",
      description: "ข้อสอบจำลองทักษะการสื่อสารภาษาอังกฤษในชีวิตประจำวันและวิชาการ",
      color: "from-blue-500 to-indigo-600",
      set: { title: "ชุดฝึกหัดที่ 1", duration_minutes: 20 },
      questions: [
        {
          type: "mc",
          question: "Choose the best response: \"Would you mind if I opened the window?\"",
          choices: ["Yes, I would.", "Not at all, go ahead.", "You're welcome.", "I don't think so, thanks."],
          correct: 1,
          explanation: "\"Not at all\" เป็นวิธีตอบรับที่สุภาพเมื่อถูกขออนุญาต หมายถึง \"เชิญเลยครับ/ค่ะ\"",
        },
        {
          type: "mc",
          question: "Complete the sentence: She has been working here _____ five years.",
          choices: ["since", "for", "during", "from"],
          correct: 1,
          explanation: "ใช้ \"for\" กับช่วงเวลา (five years) ส่วน \"since\" ใช้กับจุดเริ่มต้นของเวลา (since 2020)",
        },
        {
          type: "mc",
          question: "What is the most polite way to disagree in a meeting?",
          choices: [
            "You are completely wrong.",
            "I see your point, but I have a different opinion.",
            "That's a bad idea.",
            "No, that's not right.",
          ],
          correct: 1,
          explanation: "การเห็นต่างอย่างสุภาพควรรับฟังความเห็นอีกฝ่ายก่อน แล้วจึงเสนอความเห็นของตนเอง",
        },
        {
          type: "mc",
          question: "Choose the word closest in meaning to \"reluctant\".",
          choices: ["eager", "unwilling", "confident", "curious"],
          correct: 1,
          explanation: "\"Reluctant\" แปลว่าไม่เต็มใจ ใกล้เคียงกับ \"unwilling\" มากที่สุด",
        },
        {
          type: "mc",
          question: "\"Could you tell me where the nearest ATM is?\" is an example of:",
          choices: ["a direct question", "an indirect question", "a command", "an exclamation"],
          correct: 1,
          explanation: "ประโยคนี้เป็น indirect question ใช้โครงสร้าง \"Could you tell me where...\" เพื่อความสุภาพ",
        },
      ],
    },
    {
      code: "tgat2",
      name: "TGAT2 การคิดอย่างมีเหตุผล",
      group_name: "TGAT",
      description: "ข้อสอบจำลองการคิดวิเคราะห์เชิงตรรกะและเหตุผล",
      color: "from-emerald-500 to-teal-600",
      set: { title: "ชุดฝึกหัดที่ 1", duration_minutes: 20 },
      questions: [
        {
          type: "mc",
          question: "ถ้า A มากกว่า B และ B มากกว่า C แล้วข้อใดถูกต้องเสมอ",
          choices: ["A มากกว่า C", "C มากกว่า A", "A เท่ากับ C", "สรุปไม่ได้"],
          correct: 0,
          explanation: "จาก A>B และ B>C ตามหลักสมบัติถ่ายทอด (transitive) จึงสรุปได้ว่า A>C เสมอ",
        },
        {
          type: "mc",
          question: "นักเรียน 5 คน เข้าแถวสูงสุดไปต่ำสุด ถ้า ก สูงกว่า ข แต่เตี้ยกว่า ค และ ง เตี้ยที่สุด ใครน่าจะสูงที่สุดในกลุ่มนี้",
          choices: ["ก", "ข", "ค", "ง"],
          correct: 2,
          explanation: "จากเงื่อนไข ค > ก > ข และ ง เตี้ยสุด ดังนั้น ค มีแนวโน้มสูงที่สุดในข้อมูลที่ให้มา",
        },
        {
          type: "mc",
          question: "ข้อสรุปใดสมเหตุสมผลจากข้อความ: \"นักเรียนทุกคนที่สอบผ่านต้องอ่านหนังสือ สมชายสอบผ่าน\"",
          choices: [
            "สมชายอ่านหนังสือ",
            "สมชายไม่อ่านหนังสือ",
            "คนที่อ่านหนังสือทุกคนสอบผ่าน",
            "สรุปไม่ได้",
          ],
          correct: 0,
          explanation: "เป็นการให้เหตุผลแบบ modus ponens: ถ้า P แล้ว Q, มี P จริง ดังนั้น Q ต้องจริง (สมชายอ่านหนังสือ)",
        },
        {
          type: "mc",
          question: "แบบรูปตัวเลข: 2, 6, 12, 20, 30, ? ตัวถัดไปคือเท่าไร",
          choices: ["36", "40", "42", "44"],
          correct: 2,
          explanation: "ผลต่างระหว่างพจน์เพิ่มขึ้นทีละ 2 (4,6,8,10,12) ดังนั้นพจน์ถัดไปคือ 30+12=42",
        },
        {
          type: "mc",
          question: "ข้อใดคือจุดอ่อนของการให้เหตุผลแบบ \"คนดังทุกคนพูดแบบนี้ ดังนั้นสิ่งนี้ต้องเป็นจริง\"",
          choices: [
            "เป็นการอ้างอำนาจ ไม่ใช่หลักฐานเชิงข้อเท็จจริง",
            "เป็นเหตุผลที่สมบูรณ์แบบ",
            "ไม่มีจุดอ่อนใดๆ",
            "เป็นการอุปนัยที่ถูกต้อง",
          ],
          correct: 0,
          explanation: "นี่คือ Appeal to Authority ซึ่งเป็นความเข้าใจผิดทางตรรกะ เพราะความมีชื่อเสียงไม่ได้รับประกันความถูกต้อง",
        },
      ],
    },
    {
      code: "tgat3",
      name: "TGAT3 สมรรถนะการทำงาน",
      group_name: "TGAT",
      description: "ข้อสอบจำลองสถานการณ์การทำงานร่วมกับผู้อื่นและการแก้ปัญหา",
      color: "from-amber-500 to-orange-600",
      set: { title: "ชุดฝึกหัดที่ 1", duration_minutes: 20 },
      questions: [
        {
          type: "mc",
          question: "เพื่อนร่วมทีมทำงานไม่เสร็จตามกำหนด คุณควรทำอย่างไรก่อนเป็นอันดับแรก",
          choices: [
            "รายงานหัวหน้าทันทีโดยไม่พูดคุยกับเพื่อน",
            "พูดคุยกับเพื่อนเพื่อหาสาเหตุและช่วยกันแก้ปัญหา",
            "ทำงานส่วนนั้นแทนโดยไม่บอกใคร",
            "เพิกเฉยเพราะไม่ใช่หน้าที่ของตน",
          ],
          correct: 1,
          explanation: "การสื่อสารเพื่อเข้าใจสาเหตุก่อนเป็นทักษะการทำงานร่วมกันที่ดี ก่อนจะยกระดับปัญหาไปที่อื่น",
        },
        {
          type: "mc",
          question: "เมื่อได้รับคำวิจารณ์เชิงลบเกี่ยวกับผลงาน สิ่งที่ควรทำคือ",
          choices: [
            "โต้เถียงทันทีเพื่อปกป้องตนเอง",
            "รับฟัง วิเคราะห์ และนำไปปรับปรุง",
            "เก็บไว้ในใจแล้วไม่พูดถึงอีก",
            "โทษว่าเป็นความผิดของคนอื่น",
          ],
          correct: 1,
          explanation: "การรับฟังคำวิจารณ์อย่างเปิดใจและนำไปพัฒนาตนเองเป็นสมรรถนะสำคัญของการทำงาน",
        },
        {
          type: "mc",
          question: "ถ้าต้องบริหารเวลาทำงาน 3 งานที่ deadline ใกล้กัน ควรทำอย่างไร",
          choices: [
            "ทำงานที่ชอบที่สุดก่อน",
            "จัดลำดับความสำคัญและความเร่งด่วนแล้ววางแผน",
            "ทำทุกงานพร้อมกันแบบสุ่ม",
            "เลื่อนทุกงานออกไปก่อน",
          ],
          correct: 1,
          explanation: "การจัดลำดับความสำคัญ (prioritization) เป็นทักษะบริหารเวลาที่มีประสิทธิภาพที่สุด",
        },
        {
          type: "mc",
          question: "ลักษณะของผู้นำทีมที่ดีคือข้อใด",
          choices: [
            "ตัดสินใจทุกอย่างคนเดียวโดยไม่ฟังใคร",
            "รับฟังความเห็นทีมและมอบหมายงานตามความถนัด",
            "ไม่มอบหมายงานให้ใครเลย",
            "ตำหนิสมาชิกทีมต่อหน้าคนอื่น",
          ],
          correct: 1,
          explanation: "ผู้นำที่ดีควรรับฟังทีมและกระจายงานตามจุดแข็งของแต่ละคน เพื่อประสิทธิภาพสูงสุด",
        },
        {
          type: "mc",
          question: "เมื่อเกิดความขัดแย้งในทีมระหว่างทำงานกลุ่ม ควรเริ่มจากอะไร",
          choices: [
            "เลือกข้างฝ่ายใดฝ่ายหนึ่งทันที",
            "รับฟังทุกฝ่ายอย่างเป็นกลางก่อนหาทางออกร่วมกัน",
            "หลีกเลี่ยงและไม่เข้าไปยุ่งเกี่ยว",
            "รายงานอาจารย์ทันทีโดยไม่ลองแก้ไขเอง",
          ],
          correct: 1,
          explanation: "การจัดการความขัดแย้งที่ดีเริ่มจากการรับฟังอย่างเป็นกลางก่อนหาทางออกที่ทุกฝ่ายยอมรับได้",
        },
      ],
    },
    {
      code: "tpat3",
      name: "TPAT3 วิทยาศาสตร์ เทคโนโลยี วิศวกรรมศาสตร์",
      group_name: "TPAT",
      description: "ข้อสอบจำลองความถนัดด้านวิทยาศาสตร์และวิศวกรรมศาสตร์",
      color: "from-purple-500 to-violet-700",
      set: { title: "ชุดฝึกหัดที่ 1", duration_minutes: 25 },
      questions: [
        {
          type: "mc",
          question: "วัตถุมวล 2 กก. เคลื่อนที่ด้วยความเร่ง 3 m/s² แรงลัพธ์ที่กระทำต่อวัตถุมีค่ากี่นิวตัน",
          choices: ["1.5 N", "5 N", "6 N", "9 N"],
          correct: 2,
          explanation: "จาก F = ma = 2 กก. × 3 m/s² = 6 นิวตัน",
        },
        {
          type: "mc",
          question: "วงจรไฟฟ้าแบบขนาน เมื่อเพิ่มตัวต้านทานอีกตัวขนานเข้าไป ความต้านทานรวมของวงจรจะ",
          choices: ["เพิ่มขึ้น", "ลดลง", "คงเดิม", "ขึ้นอยู่กับแรงดันไฟฟ้า"],
          correct: 1,
          explanation: "ในวงจรขนาน ยิ่งมีตัวต้านทานขนานมากขึ้น ความต้านทานรวมจะยิ่งลดลง ตามสูตร 1/Rrวม = 1/R1+1/R2+...",
        },
        {
          type: "mc",
          question: "ปฏิกิริยาเคมีที่ดูดความร้อนจากสิ่งแวดล้อมเรียกว่าอะไร",
          choices: ["Exothermic", "Endothermic", "Catalytic", "Combustion"],
          correct: 1,
          explanation: "ปฏิกิริยาดูดความร้อน (Endothermic) จะทำให้อุณหภูมิโดยรอบลดลง ตรงข้ามกับ Exothermic ที่คายความร้อน",
        },
        {
          type: "mc",
          question: "อัลกอริทึมการเรียงลำดับข้อมูลแบบใดมีความซับซ้อนเวลาเฉลี่ยต่ำที่สุดโดยทั่วไป",
          choices: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
          correct: 2,
          explanation: "Merge Sort มีความซับซ้อนเวลา O(n log n) ซึ่งดีกว่า Bubble/Selection/Insertion Sort ที่เป็น O(n²)",
        },
        {
          type: "mc",
          question: "โครงสร้างสะพานแบบโครงถัก (Truss) นิยมใช้เพราะเหตุผลใด",
          choices: [
            "กระจายแรงผ่านสามเหลี่ยมทำให้แข็งแรงและใช้วัสดุน้อย",
            "มีราคาแพงที่สุด",
            "ไม่สามารถรับน้ำหนักได้มาก",
            "ใช้เฉพาะกับสะพานขนาดเล็กเท่านั้น",
          ],
          correct: 0,
          explanation: "รูปสามเหลี่ยมในโครงถักช่วยกระจายแรงได้อย่างมีประสิทธิภาพ ทำให้โครงสร้างแข็งแรงโดยใช้วัสดุน้อยกว่ารูปแบบอื่น",
        },
      ],
    },
    {
      code: "a-level-math1",
      name: "A-Level คณิตศาสตร์ประยุกต์ 1",
      group_name: "A-Level",
      description: "ข้อสอบจำลองคณิตศาสตร์ประยุกต์ 1 สำหรับสายวิทย์-คณิต",
      color: "from-rose-500 to-pink-700",
      set: { title: "ชุดฝึกหัดที่ 1", duration_minutes: 30 },
      questions: [
        {
          type: "mc",
          question: "ถ้า f(x) = 2x² - 3x + 1 แล้ว f(2) มีค่าเท่าใด",
          choices: ["1", "3", "5", "7"],
          correct: 1,
          explanation: "f(2) = 2(2)² - 3(2) + 1 = 8 - 6 + 1 = 3",
        },
        {
          type: "mc",
          question: "หาผลเฉลยของสมการ 2x + 5 = 15",
          choices: ["3", "5", "7", "10"],
          correct: 1,
          explanation: "2x + 5 = 15 → 2x = 10 → x = 5",
        },
        {
          type: "mc",
          question: "ความน่าจะเป็นที่จะทอดลูกเต๋า 1 ลูกแล้วได้เลขคู่คือเท่าใด",
          choices: ["1/6", "1/3", "1/2", "2/3"],
          correct: 2,
          explanation: "เลขคู่บนลูกเต๋ามี 3 หน้า (2,4,6) จาก 6 หน้า ดังนั้นความน่าจะเป็น = 3/6 = 1/2",
        },
        {
          type: "mc",
          question: "ลำดับเลขคณิต 3, 7, 11, 15, ... พจน์ที่ 10 มีค่าเท่าใด",
          choices: ["37", "39", "41", "43"],
          correct: 1,
          explanation: "an = a1 + (n-1)d = 3 + (10-1)(4) = 3 + 36 = 39",
        },
        {
          type: "mc",
          question: "ค่า sin(30°) + cos(60°) เท่ากับเท่าใด",
          choices: ["0.5", "1", "1.5", "2"],
          correct: 1,
          explanation: "sin(30°) = 0.5 และ cos(60°) = 0.5 ดังนั้นผลรวม = 0.5+0.5 = 1",
        },
      ],
    },
    {
      code: "english-error-id",
      name: "ภาษาอังกฤษ: หาจุดผิดในประโยค (Error Identification)",
      group_name: "ภาษาอังกฤษ (IELTS / TOEFL / CU-TEP)",
      description: "ฝึกคลิกเลือกจุดที่ผิดไวยากรณ์ในประโยค รูปแบบเดียวกับข้อสอบ CU-TEP และ TOEFL",
      color: "from-cyan-500 to-blue-700",
      set: { title: "ชุดฝึกหัดที่ 1", duration_minutes: 15 },
      questions: [
        {
          type: "error_id",
          question: "คลิกส่วนที่ขีดเส้นใต้ซึ่งผิดไวยากรณ์",
          segments: ["She ", "don't", " like coffee, but ", "she", " enjoys ", "tea very much", "."],
          underlineIndexes: [1, 3, 5],
          correct: 0,
          explanation: "ควรใช้ \"doesn't\" ไม่ใช่ \"don't\" เพราะประธาน \"She\" เป็นเอกพจน์บุรุษที่ 3",
        },
        {
          type: "error_id",
          question: "คลิกส่วนที่ขีดเส้นใต้ซึ่งผิดไวยากรณ์",
          segments: ["Each of the students ", "have", " submitted ", "their", " assignment ", "on time", "."],
          underlineIndexes: [1, 3, 5],
          correct: 0,
          explanation: "\"Each of the students\" เป็นประธานเอกพจน์ ต้องใช้ \"has\" ไม่ใช่ \"have\"",
        },
        {
          type: "error_id",
          question: "คลิกส่วนที่ขีดเส้นใต้ซึ่งผิดไวยากรณ์",
          segments: ["I have been ", "living", " here since ", "three years", ", and I love ", "the neighborhood", "."],
          underlineIndexes: [1, 3, 5],
          correct: 1,
          explanation: "ควรใช้ \"for three years\" เพราะ \"since\" ใช้กับจุดเริ่มต้นเวลา (เช่น since 2021) ส่วน \"for\" ใช้กับช่วงระยะเวลา",
        },
        {
          type: "error_id",
          question: "คลิกส่วนที่ขีดเส้นใต้ซึ่งผิดไวยากรณ์",
          segments: ["The number of applicants ", "are", " increasing ", "rapidly", " every ", "single year", "."],
          underlineIndexes: [1, 3, 5],
          correct: 0,
          explanation: "\"The number of\" ตามด้วยกริยาเอกพจน์ \"is\" ไม่ใช่ \"are\" (ต่างจาก \"A number of\" ที่ใช้กริยาพหูพจน์)",
        },
        {
          type: "error_id",
          question: "คลิกส่วนที่ขีดเส้นใต้ซึ่งผิดไวยากรณ์",
          segments: ["By the time she ", "arrives", " tomorrow, we ", "will finish", " ", "the whole project", "."],
          underlineIndexes: [1, 3, 5],
          correct: 1,
          explanation: "ควรใช้ \"will have finished\" (Future Perfect) เพราะเหตุการณ์จะเสร็จก่อนอีกเหตุการณ์หนึ่งในอนาคต",
        },
      ],
    },
    {
      code: "english-listening",
      name: "ภาษาอังกฤษ: ฝึกฟัง (Listening Practice)",
      group_name: "ภาษาอังกฤษ (IELTS / TOEFL / CU-TEP)",
      description: "ฝึกฟังบทสนทนา/ประกาศภาษาอังกฤษแล้วตอบคำถาม รูปแบบเดียวกับข้อสอบ IELTS Listening",
      color: "from-sky-500 to-cyan-700",
      set: { title: "ชุดฝึกหัดที่ 1: ประกาศจากห้องสมุด", duration_minutes: 15 },
      questions: [
        {
          type: "listening",
          audio: "/audio/exam-bank/listening-1.wav",
          question: "During which period will the library be open 24 hours a day?",
          choices: ["Every weekend", "The final exam period", "The first week of semester", "National holidays"],
          correct: 1,
          explanation: "ผู้บรรยายกล่าวว่า \"the library will be open twenty four hours a day during the final exam period\"",
        },
        {
          type: "listening",
          audio: "/audio/exam-bank/listening-1.wav",
          question: "What must students do before studying overnight?",
          choices: [
            "Pay an extra fee",
            "Register their student ID card at the front desk",
            "Bring their own food",
            "Book a seat one month in advance",
          ],
          correct: 1,
          explanation: "ผู้บรรยายระบุว่าต้อง \"register their student identification card at the front desk before ten p m\"",
        },
        {
          type: "listening",
          audio: "/audio/exam-bank/listening-1.wav",
          question: "What is now allowed inside the reading rooms according to the announcement?",
          choices: ["Food", "Drinks with a lid", "Pets", "Loud music"],
          correct: 1,
          explanation: "ผู้บรรยายกล่าวว่า \"drinks with a lid are permitted\" แม้ว่าอาหารยังคงห้ามนำเข้า",
        },
      ],
    },
  ];

  let categorySort = 0;
  for (const cat of categories) {
    categorySort += 1;
    const [catResult] = await pool.query(
      `INSERT INTO exam_categories (code, name, group_name, description, color, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [cat.code, cat.name, cat.group_name, cat.description, cat.color, categorySort]
    );
    const categoryId = catResult.insertId;

    const [setResult] = await pool.query(
      `INSERT INTO exam_sets (category_id, title, description, duration_minutes, sort_order)
       VALUES (?, ?, ?, ?, 1)`,
      [categoryId, cat.set.title, cat.description, cat.set.duration_minutes]
    );
    const examSetId = setResult.insertId;

    let qSort = 0;
    for (const q of cat.questions) {
      qSort += 1;
      if (q.type === "error_id") {
        await pool.query(
          `INSERT INTO exam_questions (exam_set_id, question_type, passage_text, question_text, choices, correct_index, explanation, sort_order)
           VALUES (?, 'error_id', NULL, ?, ?, ?, ?, ?)`,
          [
            examSetId,
            q.question,
            JSON.stringify({ segments: q.segments, underlineIndexes: q.underlineIndexes }),
            q.correct,
            q.explanation,
            qSort,
          ]
        );
      } else if (q.type === "listening") {
        await pool.query(
          `INSERT INTO exam_questions (exam_set_id, question_type, audio_path, question_text, choices, correct_index, explanation, sort_order)
           VALUES (?, 'listening', ?, ?, ?, ?, ?, ?)`,
          [examSetId, q.audio, q.question, JSON.stringify(q.choices), q.correct, q.explanation, qSort]
        );
      } else {
        await pool.query(
          `INSERT INTO exam_questions (exam_set_id, question_type, question_text, choices, correct_index, explanation, sort_order)
           VALUES (?, 'mc', ?, ?, ?, ?, ?)`,
          [examSetId, q.question, JSON.stringify(q.choices), q.correct, q.explanation, qSort]
        );
      }
    }

    console.log(`Inserted category "${cat.name}" (id ${categoryId}) with exam set #${examSetId} (${cat.questions.length} questions)`);
  }

  await pool.end();
}

main().catch((e) => {
  console.error("ERROR", e);
  process.exit(1);
});
