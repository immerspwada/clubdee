export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="flex flex-col items-center gap-8 px-8 py-16 text-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            ระบบจัดการสโมสรกีฬา
          </h1>
          <p className="text-xl text-gray-600">
            แพลตฟอร์มครบวงจรสำหรับการจัดการนักกีฬา โค้ช และกิจกรรมการฝึกซ้อม
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="/login"
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            เข้าสู่ระบบ
          </a>
          <a
            href="/register"
            className="rounded-lg border-2 border-blue-600 px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
          >
            สมัครสมาชิก
          </a>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">สำหรับนักกีฬา</h3>
            <p className="text-sm text-gray-600">
              ติดตามความก้าวหน้า ดูตารางฝึกซ้อม และเชื่อมต่อกับสโมสรของคุณ
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">สำหรับโค้ช</h3>
            <p className="text-sm text-gray-600">
              จัดการนักกีฬา บันทึกการเข้าร่วม และติดตามผลการฝึกซ้อม
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">สำหรับผู้ดูแลระบบ</h3>
            <p className="text-sm text-gray-600">
              ควบคุมระบบทั้งหมด จัดการผู้ใช้ และสร้างรายงานแบบครบวงจร
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
