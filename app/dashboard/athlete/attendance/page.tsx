import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Calendar, ChevronLeft, Filter } from 'lucide-react';
import Link from 'next/link';

interface AttendanceLog {
  id: string;
  session_date: string;
  status: string;
  notes?: string;
  training_sessions?: {
    session_name: string;
    session_type: string;
    location?: string;
  };
}

export default async function AttendanceHistoryPage() {
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

  // Get all attendance logs
  const { data: attendanceLogs } = (await supabase
    .from('attendance_logs')
    .select(
      `
      *,
      training_sessions (
        session_name,
        session_type,
        location
      )
    `
    )
    .eq('athlete_id', profile.id)
    .order('session_date', { ascending: false })) as {
    data: AttendanceLog[] | null;
  };

  // Calculate statistics
  const totalSessions = attendanceLogs?.length || 0;
  const presentCount =
    attendanceLogs?.filter((log) => log.status === 'present').length || 0;
  const absentCount =
    attendanceLogs?.filter((log) => log.status === 'absent').length || 0;
  const excusedCount =
    attendanceLogs?.filter((log) => log.status === 'excused').length || 0;

  const attendanceRate =
    totalSessions > 0 ? ((presentCount / totalSessions) * 100).toFixed(1) : 0;

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
                ประวัติการเข้าร่วม
              </h1>
              <p className="text-sm text-gray-600">
                ดูประวัติการเข้าร่วมการฝึกซ้อมทั้งหมด
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-600">ทั้งหมด</p>
              <p className="mt-1 text-2xl font-bold text-blue-900">
                {totalSessions}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm text-green-600">เข้าร่วม</p>
              <p className="mt-1 text-2xl font-bold text-green-900">
                {presentCount}
              </p>
            </div>
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-600">ขาด</p>
              <p className="mt-1 text-2xl font-bold text-red-900">
                {absentCount}
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4">
              <p className="text-sm text-purple-600">อัตราการเข้าร่วม</p>
              <p className="mt-1 text-2xl font-bold text-purple-900">
                {attendanceRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-lg bg-white shadow">
          {attendanceLogs && attendanceLogs.length > 0 ? (
            <div className="divide-y">
              {attendanceLogs.map((log) => (
                <div key={log.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1 h-3 w-3 rounded-full ${
                          log.status === 'present'
                            ? 'bg-green-500'
                            : log.status === 'absent'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {log.training_sessions?.session_name || 'การฝึกซ้อม'}
                        </h3>
                        <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(log.session_date).toLocaleDateString(
                              'th-TH',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                weekday: 'long',
                              }
                            )}
                          </span>
                          {log.training_sessions?.session_type && (
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                              {log.training_sessions.session_type}
                            </span>
                          )}
                        </div>
                        {log.training_sessions?.location && (
                          <p className="mt-1 text-sm text-gray-500">
                            📍 {log.training_sessions.location}
                          </p>
                        )}
                        {log.notes && (
                          <p className="mt-2 text-sm text-gray-600">
                            {log.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        log.status === 'present'
                          ? 'bg-green-100 text-green-700'
                          : log.status === 'absent'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {log.status === 'present'
                        ? 'เข้าร่วม'
                        : log.status === 'absent'
                        ? 'ขาด'
                        : 'ลา'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                ยังไม่มีประวัติการเข้าร่วม
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                เมื่อคุณเข้าร่วมการฝึกซ้อม ประวัติจะแสดงที่นี่
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
