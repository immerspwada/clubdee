'use client';

import { useState } from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import { createAssignment } from '@/lib/coach/assignment-actions';

interface CreateAssignmentDialogProps {
  athleteId: string;
  athleteName?: string;
}

export function CreateAssignmentDialog({ athleteId, athleteName }: CreateAssignmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    category: 'general' as const,
    targetValue: '',
    targetUnit: '',
    dueDate: '',
    frequency: 'once' as const,
    priority: 'medium' as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await createAssignment({
      athleteId,
      title: formData.title,
      description: formData.description || undefined,
      instructions: formData.instructions || undefined,
      category: formData.category,
      targetValue: formData.targetValue ? parseFloat(formData.targetValue) : undefined,
      targetUnit: formData.targetUnit || undefined,
      dueDate: formData.dueDate,
      frequency: formData.frequency,
      priority: formData.priority,
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsOpen(false);
      setFormData({
        title: '',
        description: '',
        instructions: '',
        category: 'general',
        targetValue: '',
        targetUnit: '',
        dueDate: '',
        frequency: 'once',
        priority: 'medium',
      });
    } else {
      alert(result.error || 'เกิดข้อผิดพลาด');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        <ClipboardList className="h-4 w-4" />
        <span>มอบหมายงาน</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">มอบหมายการฝึก</h2>
              {athleteName && (
                <p className="text-sm text-gray-500">สำหรับ {athleteName}</p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                หัวข้อ *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="เช่น วิ่งเหยาะ 3 กิโลเมตร"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รายละเอียด
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="อธิบายเพิ่มเติม..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                คำแนะนำการฝึก
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ขั้นตอนการฝึก, ข้อควรระวัง..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ประเภท *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">ทั่วไป</option>
                  <option value="strength">ความแข็งแรง</option>
                  <option value="cardio">คาร์ดิโอ</option>
                  <option value="skill">ทักษะ</option>
                  <option value="flexibility">ความยืดหยุ่น</option>
                  <option value="recovery">ฟื้นฟู</option>
                  <option value="technique">เทคนิค</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ความถี่
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="once">ครั้งเดียว</option>
                  <option value="daily">ทุกวัน</option>
                  <option value="weekly">ทุกสัปดาห์</option>
                  <option value="monthly">ทุกเดือน</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เป้าหมาย
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="เช่น 3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  หน่วย
                </label>
                <input
                  type="text"
                  value={formData.targetUnit}
                  onChange={(e) => setFormData({ ...formData, targetUnit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="เช่น กิโลเมตร"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ความสำคัญ
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">ต่ำ</option>
                  <option value="medium">ปานกลาง</option>
                  <option value="high">สูง</option>
                  <option value="urgent">เร่งด่วน</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  กำหนดส่ง *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'กำลังบันทึก...' : 'มอบหมาย'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
