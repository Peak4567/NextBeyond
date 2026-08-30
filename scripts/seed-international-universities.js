// ข้อมูลมหาวิทยาลัยต่างประเทศ (สหรัฐอเมริกา, จีน) — จัดอันดับตาม QS World University Rankings 2027
// (เผยแพร่ 18 มิ.ย. 2569 โดย QS/topuniversities.com) ข้อมูลพื้นฐาน (ชื่อ, เมือง, อันดับ, เว็บทางการ) เท่านั้น
// ไม่มีเกณฑ์รับสมัครแบบละเอียดเหมือน TCAS เพราะแต่ละมหาวิทยาลัยกำหนดเองและเปลี่ยนทุกปี — admission_note
// เป็นภาพรวมระบบรับสมัครของประเทศนั้น ไม่ใช่เกณฑ์เฉพาะของแต่ละที่ ควรตรวจสอบจากเว็บมหาวิทยาลัยโดยตรง
const mysql = require("mysql2/promise");

const US_ADMISSION_NOTE =
  "โดยทั่วไปสมัครผ่านระบบ Common Application หรือเว็บสมัครของมหาวิทยาลัยเอง ใช้ผลการเรียน (GPA/Transcript), " +
  "เรียงความส่วนตัว (Personal Essay), จดหมายแนะนำจากครู, กิจกรรมนอกหลักสูตร และคะแนนภาษาอังกฤษ (TOEFL/IELTS) " +
  "สำหรับนักเรียนต่างชาติ หลายแห่งเป็น test-optional ไม่บังคับ SAT/ACT แล้ว ปฏิทินหลักคือรอบ Early Decision/Early " +
  "Action (ยื่นประมาณเดือน พ.ย.) และ Regular Decision (ยื่นประมาณเดือน ม.ค.) แต่ละมหาวิทยาลัยกำหนดวันที่และเกณฑ์" +
  "เฉพาะของตัวเอง ควรตรวจสอบจากเว็บไซต์แอดมิชชันของมหาวิทยาลัยนั้นโดยตรง";

const CN_ADMISSION_NOTE =
  "นักเรียนต่างชาติส่วนใหญ่สมัครผ่านระบบรับนักศึกษาต่างชาติ (International Students Admission) ของแต่ละ" +
  "มหาวิทยาลัยโดยตรง ไม่ใช่ระบบเกาเข่า (Gaokao) ที่ใช้กับนักเรียนจีน ใช้ Transcript, แผนการศึกษา/หนังสือแสดง" +
  "เจตจำนง (Study Plan / Statement of Purpose), จดหมายแนะนำ และคะแนนภาษาอังกฤษ (IELTS/TOEFL) หรือคะแนน" +
  "ภาษาจีน HSK สำหรับหลักสูตรที่สอนเป็นภาษาจีน กำหนดการและเกณฑ์ต่างกันมากในแต่ละมหาวิทยาลัย ควรตรวจสอบจาก" +
  "เว็บไซต์แอดมิชชันนานาชาติของมหาวิทยาลัยนั้นโดยตรง";

const US = [
  [1, "Massachusetts Institute of Technology (MIT)", "Cambridge", "https://web.mit.edu"],
  [2, "Stanford University", "Stanford", "https://www.stanford.edu"],
  [5, "Harvard University", "Cambridge", "https://www.harvard.edu"],
  [7, "California Institute of Technology (Caltech)", "Pasadena", "https://www.caltech.edu"],
  [15, "University of Pennsylvania", "Philadelphia", "https://www.upenn.edu"],
  [16, "Cornell University", "Ithaca", "https://www.cornell.edu"],
  [16, "Yale University", "New Haven", "https://www.yale.edu"],
  [20, "Johns Hopkins University", "Baltimore", "https://www.jhu.edu"],
  [20, "University of California, Berkeley (UCB)", "Berkeley", "https://www.berkeley.edu"],
  [24, "University of Chicago", "Chicago", "https://www.uchicago.edu"],
  [27, "Princeton University", "Princeton", "https://www.princeton.edu"],
  [43, "Columbia University", "New York City", "https://www.columbia.edu"],
  [45, "Northwestern University", "Evanston", "https://www.northwestern.edu"],
  [49, "University of California, Los Angeles (UCLA)", "Los Angeles", "https://www.ucla.edu"],
  [51, "University of Michigan-Ann Arbor", "Ann Arbor", "https://umich.edu"],
  [55, "Carnegie Mellon University", "Pittsburgh", "https://www.cmu.edu"],
  [58, "New York University (NYU)", "New York City", "https://www.nyu.edu"],
  [66, "Brown University", "Providence", "https://www.brown.edu"],
  [70, "Duke University", "Durham", "https://www.duke.edu"],
  [72, "University of Texas at Austin", "Austin", "https://www.utexas.edu"],
  [74, "University of Illinois Urbana-Champaign", "Champaign", "https://illinois.edu"],
  [81, "University of California, San Diego (UCSD)", "San Diego", "https://www.ucsd.edu"],
  [92, "Pennsylvania State University", "University Park", "https://www.psu.edu"],
  [92, "University of Washington", "Seattle", "https://www.washington.edu"],
  [94, "Boston University", "Boston", "https://www.bu.edu"],
  [100, "Purdue University", "West Lafayette", "https://www.purdue.edu"],
  [122, "Rice University", "Houston", "https://www.rice.edu"],
  [131, "University of Wisconsin-Madison", "Madison", "https://www.wisc.edu"],
  [137, "University of California, Davis", "Davis", "https://www.ucdavis.edu"],
  [142, "Georgia Institute of Technology", "Atlanta", "https://www.gatech.edu"],
];

const CN = [
  [13, "Peking University", "Beijing", "https://english.pku.edu.cn"],
  [14, "Tsinghua University", "Beijing", "https://www.tsinghua.edu.cn/en/"],
  [26, "Fudan University", "Shanghai", "https://www.fudan.edu.cn/en/"],
  [36, "Shanghai Jiao Tong University", "Shanghai", "https://en.sjtu.edu.cn"],
  [47, "Zhejiang University", "Hangzhou", "https://www.zju.edu.cn/english/"],
  [90, "Nanjing University", "Nanjing", "https://www.nju.edu.cn"],
  [134, "University of Science and Technology of China", "Hefei", "https://en.ustc.edu.cn"],
  [146, "Tongji University", "Shanghai", "https://en.tongji.edu.cn"],
  [165, "Wuhan University", "Wuhan", "https://en.whu.edu.cn"],
  [190, "Harbin Institute of Technology", "Harbin", "https://en.hit.edu.cn"],
  [235, "Tianjin University", "Tianjin", "https://www.tju.edu.cn"],
  [237, "Beijing Normal University", "Beijing", "https://english.bnu.edu.cn"],
  [243, "Beijing Institute of Technology", "Beijing", "https://english.bit.edu.cn"],
  [258, "Sun Yat-sen University", "Guangzhou", "https://www.sysu.edu.cn"],
  [296, "Xi'an Jiaotong University", "Xi'an", "https://en.xjtu.edu.cn"],
  [300, "Sichuan University", "Chengdu", "https://www.scu.edu.cn/English/"],
  [303, "Xiamen University", "Xiamen", "https://en.xmu.edu.cn"],
  [307, "Huazhong University of Science and Technology", "Wuhan", "https://www.hust.edu.cn"],
  [309, "Shandong University", "Jinan", "https://www.en.sdu.edu.cn"],
  [317, "Southern University of Science and Technology (SUSTech)", "Shenzhen", "https://www.sustech.edu.cn/en/"],
  [329, "Nankai University", "Tianjin", "https://en.nankai.edu.cn"],
  [335, "Southeast University", "Nanjing", "https://www.seu.edu.cn/english/"],
  [342, "South China University of Technology", "Guangzhou", "https://www2.scut.edu.cn/en/"],
  [349, "Beihang University", "Beijing", "https://ev.buaa.edu.cn"],
  [360, "University of Chinese Academy of Sciences (UCAS)", "Beijing", "https://www.ucas.ac.cn"],
  [394, "East China Normal University", "Shanghai", "https://english.ecnu.edu.cn"],
  [416, "Shenzhen University", "Shenzhen", "https://www.szu.edu.cn"],
  [425, "Northwestern Polytechnical University", "Xi'an", "https://en.nwpu.edu.cn"],
  [443, "Shanghai University", "Shanghai", "https://en.shu.edu.cn"],
  [443, "University of Science and Technology Beijing", "Beijing", "https://en.ustb.edu.cn"],
];

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "nextbeyond",
  });

  await pool.query("DELETE FROM international_universities WHERE country IN ('United States', 'China')");

  let sortOrder = 0;
  for (const [rank, name, city, url] of US) {
    sortOrder++;
    await pool.query(
      `INSERT INTO international_universities
        (country, country_th, name_en, city, qs_rank, qs_rank_display, website_url, admission_note, sort_order)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      ["United States", "สหรัฐอเมริกา", name, city, rank, String(rank), url, US_ADMISSION_NOTE, sortOrder]
    );
  }

  sortOrder = 0;
  for (const [rank, name, city, url] of CN) {
    sortOrder++;
    await pool.query(
      `INSERT INTO international_universities
        (country, country_th, name_en, city, qs_rank, qs_rank_display, website_url, admission_note, sort_order)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      ["China", "จีน", name, city, rank, String(rank), url, CN_ADMISSION_NOTE, sortOrder]
    );
  }

  console.log(`เพิ่มแล้ว: สหรัฐอเมริกา ${US.length} แห่ง, จีน ${CN.length} แห่ง`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
