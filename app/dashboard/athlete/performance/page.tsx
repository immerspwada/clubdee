import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TrendingUp, ChevronLeft, Activity } from 'lucide-react';
import Link from 'next/link';

interface PerformanceRecord {
  id: string;
  test_date: string;
  test_type: string;
  result_value: number;
  result_unit: string;
  notes?: string;
  coaches?: {
    first_name: string;
    last_name: string;
  };
}

export default async function PerformanceHistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Get athlete profile
  const { data: profile } = (await supabase
    .from('athletes')
    .select('id, first_name, last_name')
    .eq('user_id', user.id)
    .single()) as { data: { id: string; first_name: string; last_name: string } | null };

  if (!profile) {
    redirect('/login');
  }

  // Get all performance records
  const { data: performanceRecords } = (await supabase
    .from('performance_records')
    .select(
      `
      *,
      coaches (
        first_name,
        last_name
      )
    `
    )
    .eq('athlete_id', profile.id)
    .order('test_date', { ascending: false })) as {
    data: PerformanceRecord[] | null;
  };

  // Group by test type for statistics
  const testTypes = new Set(
    performanceRecords?.map((r) => r.test_type) || []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/dashboard/athlete"
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ผลการทดสอบ
              </h1>
              <p className="text-sm text-gray-600">
                ดูผลการทดสอบและความก้าวหน้าของคุณ
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-purple-50 p-4">
              <p className="text-sm text-purple-600">ทั้งหมด</p>
              <p className="mt-1 text-2xl font-bold text-purple-900">
                {performanceRecords?.length || 0}
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-600">ประเภทการทดสอบ</p>
              <p className="mt-1 text-2xl font-bold text-blue-900">
                {testTypes.size}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm text-green-600">ล่าสุด</p>
              <p className="mt-1 text-sm font-bold text-green-900">
                {performanceRecords && performanceRecords.length > 0
                  ? new Date(
                      performanceRecords[0].test_date
                    ).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-lg bg-white shadow">
          {performanceRecords && performanceRecords.length > 0 ? (
            <div className="divide-y">
              {performanceRecords.map((record) => (
                <div key={record.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 rounded-full bg-purple-100 p-2">
                        <Activity className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {record.test_type}
                        </h3>
                        <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                          <span>
                            {new Date(record.test_date).toLocaleDateString(
                              'th-TH',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                weekday: 'long',
                              }
                            )}
                          </span>
                          {record.coaches && (
                            <span className="text-gray-500">
                              โดย {record.coaches.first_name}{' '}
                              {record.coaches.last_name}
                            </span>
                          )}
                        </div>
                        {record.notes && (
                          <p className="mt-2 text-sm text-gray-600">
                            {record.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">
                        {record.result_value}
                      </p>
                      <p className="text-sm text-gray-600">
                        {record.result_unit}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                ยังไม่มีผลการทดสอบ
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                เมื่อโค้ชบันทึกผลการทดสอบของคุณ จะแสดงที่นี่
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
