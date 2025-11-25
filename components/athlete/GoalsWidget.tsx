'use client';

import { Target, TrendingUp, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Goal {
  id: string;
  title: string;
  description?: string;
  progress_percentage: number;
  status: string;
  priority: string;
  target_date: string;
  coaches?: {
    first_name: string;
    last_name: string;
  };
}

interface GoalsWidgetProps {
  goals: Goal[];
}

export function GoalsWidget({ goals }: GoalsWidgetProps) {
  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  if (goals.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-black" />
          <h2 className="text-base font-bold text-black">เป้าหมายของฉัน</h2>
        </div>
        <div className="text-xs text-gray-500">
          {completedGoals.length}/{goals.length} สำเร็จ
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-blue-600">{activeGoals.length}</p>
          <p className="text-xs text-blue-600">กำลังดำเนินการ</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-green-600">{completedGoals.length}</p>
          <p className="text-xs text-green-600">สำเร็จแล้ว</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-yellow-600">
            {activeGoals.length > 0
              ? Math.round(
                  activeGoals.reduce((sum, g) => sum + g.progress_percentage, 0) /
                    activeGoals.length
                )
              : 0}
            %
          </p>
          <p className="text-xs text-yellow-600">ความคืบหน้า</p>
        </div>
      </div>

      {/* Active Goals List */}
      <div className="space-y-3">
        {activeGoals.slice(0, 3).map((goal) => (
          <div key={goal.id} className="border border-gray-200 rounded-xl p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-black text-sm line-clamp-1">
                  {goal.title}
                </h4>
                <p className="text-xs text-gray-500">
                  โค้ช{goal.coaches?.first_name || 'ไม่ระบุ'}
                </p>
              </div>
              {goal.priority === 'high' && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                  สำคัญ
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>ความคืบหน้า</span>
                <span className="font-semibold">{goal.progress_percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-blue-600 transition-all"
                  style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                />
              </div>
            </div>

            <div className="text-xs text-gray-500">
              กำหนดเสร็จ: {new Date(goal.target_date).toLocaleDateString('th-TH')}
            </div>
          </div>
        ))}
      </div>

      {activeGoals.length > 3 && (
        <Link
          href="/dashboard/athlete/goals"
          className="block text-center text-sm text-blue-600 font-medium mt-3 hover:text-blue-700"
        >
          ดูเป้าหมายทั้งหมด ({activeGoals.length}) →
        </Link>
      )}
    </div>
  );
}
