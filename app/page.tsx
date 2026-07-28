import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const COURSES = [
  {
    title: "วิศวกรรมคอมพิวเตอร์",
    university: "มหาวิทยาลัยเกษตรศาสตร์",
    quota: "100",
    criteria: "TGAT / TPAT",
    qualification: "แผนการเรียน วิทย์-คณิต, Software, Hardware หรือ อาชีวะ",
    gpa: "ไม่ระบุ",
  },
  {
    title: "วิศวกรรมคอมพิวเตอร์",
    university: "มหาวิทยาลัยเกษตรศาสตร์",
    quota: "100",
    criteria: "TGAT / TPAT",
    qualification: "แผนการเรียน วิทย์-คณิต, Software, Hardware หรือ อาชีวะ",
    gpa: "ไม่ระบุ",
  },
  {
    title: "วิศวกรรมคอมพิวเตอร์",
    university: "มหาวิทยาลัยเกษตรศาสตร์",
    quota: "100",
    criteria: "TGAT / TPAT",
    qualification: "แผนการเรียน วิทย์-คณิต, Software, Hardware หรือ อาชีวะ",
    gpa: "ไม่ระบุ",
  },
  {
    title: "วิศวกรรมคอมพิวเตอร์",
    university: "มหาวิทยาลัยเกษตรศาสตร์",
    quota: "100",
    criteria: "TGAT / TPAT",
    qualification: "แผนการเรียน วิทย์-คณิต, Software, Hardware หรือ อาชีวะ",
    gpa: "ไม่ระบุ",
  },
  {
    title: "วิศวกรรมคอมพิวเตอร์",
    university: "มหาวิทยาลัยเกษตรศาสตร์",
    quota: "100",
    criteria: "TGAT / TPAT",
    qualification: "แผนการเรียน วิทย์-คณิต, Software, Hardware หรือ อาชีวะ",
    gpa: "ไม่ระบุ",
  },
  {
    title: "วิศวกรรมคอมพิวเตอร์",
    university: "มหาวิทยาลัยเกษตรศาสตร์",
    quota: "100",
    criteria: "TGAT / TPAT",
    qualification: "แผนการเรียน วิทย์-คณิต, Software, Hardware หรือ อาชีวะ",
    gpa: "ไม่ระบุ",
  },
];

const TEAM = [
  { name: "นายศรัณยกร เทพสุนทร", role: "FOUNDER / NextBeyond", image: "/img/peak.png" },
  { name: "นายศรัณยกร เทพสุนทร", role: "FOUNDER / NextBeyond", image: "/img/peak.png" },
  { name: "นายศรัณยกร เทพสุนทร", role: "FOUNDER / NextBeyond", image: "/img/peak.png" },
  { name: "นายศรัณยกร เทพสุนทร", role: "FOUNDER / NextBeyond", image: "/img/peak.png" },
  { name: "นายศรัณยกร เทพสุนทร", role: "FOUNDER / NextBeyond", image: "/img/peak.png" },
  { name: "นายศรัณยกร เทพสุนทร", role: "FOUNDER / NextBeyond", image: "/img/peak.png" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fbff]">
      <Navbar />

      <main className="flex-1 overflow-hidden">
        <section className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="text-3xl font-extrabold leading-tight text-[#003b73] sm:text-3xl lg:text-5xl">
                ก้าวเข้าสู่รั้วมหาวิทยาลัย
                <br />
                ด้วยระบบ <span className="text-[#e25a3a]">Next Beyond</span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-gray-500 sm:text-base">
                ศูนย์รวมคลังข้อสอบและสรุปเนื้อหา พร้อมระบบจำลองสอบ อัปเดตข่าวสาร
                24 ชั่วโมง
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button className="rounded-md bg-[#005a9c] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#004880] shadow-md">
                  ค้นหา Portfolio
                </button>
                <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                  </svg>
                  ทำแบบทดสอบค้นหาตนเอง
                </button>
              </div>
            </div>

            <div className="relative mx-auto flex items-center justify-center lg:justify-end w-full">
              <img
                src="/img/next-person.png"
                alt="Student studying illustration"
                className="w-full max-w-md object-contain"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div>
            <h2 className="text-2xl font-bold text-[#003b73] sm:text-3xl">
              กลุ่มสาขายอดนิยม
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              รวบรวมหลักสูตรและคณะยอดนิยมที่น้องๆ
              เลือกเรียนเพื่อเตรียมสอบเข้ามหาวิทยาลัย
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COURSES.map((course, index) => (
              <div
                key={index}
                className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div>
                  <h3 className="text-lg font-bold text-[#005a9c]">
                    {course.title}
                  </h3>
                  <p className="text-sm font-medium text-[#e25a3a]">
                    {course.university}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span>จำนวนรับสมัคร (รอบ x)</span>
                      <span className="font-bold text-[#005a9c]">
                        รับ {course.quota}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span>การคัดเลือก</span>
                      <span className="font-bold text-[#005a9c]">
                        {course.criteria}
                      </span>
                    </div>
                    <div className="pt-1">
                      <span className="block text-gray-500 mb-1">
                        คุณสมบัติผู้สมัคร:
                      </span>
                      <span className="font-medium">
                        {course.qualification}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="mt-6 w-full rounded-md bg-[#6699cc] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5282b3]">
                  ดูรายละเอียดเพิ่มเติม
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
          <div className="relative overflow-hidden rounded-3xl bg-[#71bbee] px-8 py-10 shadow-sm sm:px-14 lg:py-14">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-4 border-yellow-300 opacity-50" />
            <div className="absolute right-12 bottom-0 h-40 w-40 rounded-full border-4 border-yellow-300 opacity-30" />

            <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
              <div>
                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  เริ่มวางแผนเข้ามหาวิทยาลัยแล้ววันนี้
                </h3>
                <p className="mt-2 text-sm text-white/90">
                  ปรึกษาฟรี ไม่มีค่าใช้จ่าย พร้อมทีมแนะแนวมืออาชีพดูแลทุกขั้นตอน
                </p>
              </div>
              <button className="whitespace-nowrap rounded-full bg-[#fcd116] px-8 py-3 text-sm font-bold text-[#003b73] shadow-md transition-all hover:-translate-y-0.5 hover:bg-yellow-400">
                ติดต่อสอบถาม
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-[#003b73] sm:text-3xl">
              ผู้พัฒนา NextBeyond
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              ทีมงานผู้เชี่ยวชาญที่มุ่งมั่นพัฒนาระบบแนะแนวการศึกษาที่มีประสิทธิภาพสูงสุดสำหรับคุณ
            </p>
          </div>

          <div className="mt-12 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((member, index) => (
              <div
                key={index}
                className="relative flex items-center rounded-2xl bg-white px-6 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] min-h-[110px]"
              >
                <div className="z-10 w-3/5">
                  <h4 className="text-[17px] font-bold text-[#1e3a8a]">
                    {member.name}
                  </h4>
                  <p className="text-[11px] font-bold text-gray-900 mt-0.5">
                    {member.role}
                  </p>
                </div>

                <div className="absolute bottom-0 right-4 h-[160px] w-auto">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-contain object-bottom drop-shadow-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
