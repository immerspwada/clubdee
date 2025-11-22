import { FileText } from 'lucide-react';

export default function AuditLogsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">บันทึกการตรวจสอบ</h1>
        <p className="mt-2 text-gray-600">ดูกิจกรรมระบบและการกระทำของผู้ใช้</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-12">
        <FileText className="mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">ระบบบันทึกการตรวจสอบกำลังจะมาเร็วๆ นี้</h3>
        <p className="text-center text-gray-600">
          ฟังก์ชันการบันทึกการตรวจสอบจะติดตามเหตุการณ์ทั้งหมดในระบบ รวมถึง:
          <br />
          การเข้าสู่ระบบของผู้ใช้ การแก้ไขข้อมูล และการดำเนินการของผู้ดูแลระบบ
        </p>
      </div>
    </div>
  );
}
