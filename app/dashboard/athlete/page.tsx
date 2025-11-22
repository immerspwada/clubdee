import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import DashboardStats from '@/components/athlete/DashboardStats';
import QuickActions from '@/components/athlete/QuickActions';
import RecentActivity from '@/components/athlete/RecentActivity';
import AthleteHeader from '@/components/athlete/AthleteHeader';

interface AthleteProfile {
  id: string;
  first_name: string;
  last_name: string;
  nickname?: string;
  profile_picture_url?: string;
  clubs?: {
    id: string;
    name: string;
  };
}

interface AttendanceLog {
  id: string;
  session_date: string;
  status: string;
  training_sessions?: {
    session_name: string;
    session_type: string;
  };
}

interface PerformanceRecord {
  id: string;
  test_date: string;
  test_type: string;
  result_value: number;
  result_unit: string;
  notes?: string;
}

export default async function AthleteDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Get athlete profile
  const { data: profile, error: profileError } = (await supabase
    .from('athletes')
    .select(
      `
      *,
      clubs (id, name)
    `
    )
    .eq('user_id', user.id)
    .single()) as { data: AthleteProfile | null; error: any };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4 text-red-600">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">ไม่พบข้อมูลนักกีฬา</h2>
          <p className="text-gray-600 mb-6">
            ไม่พบข้อมูลโปรไฟล์นักกีฬาสำหรับบัญชีนี้ กรุณาติดต่อผู้ดูแลระบบ
          </p>
          <div className="space-y-2 text-sm text-left bg-gray-50 p-4 rounded">
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {profileError && <p className="text-red-600"><strong>Error:</strong> {profileError.message}</p>}
          </div>
          <Link
            href="/logout"
            className="mt-6 inline-block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-center"
          >
            ออกจากระบบ
          </Link>
        </div>
      </div>
    );
  }

  // Get statistics
  const { count: totalAttendance } = await supabase
    .from('attendance_logs')
    .select('*', { count: 'exact', head: true })
    .eq('athlete_id', profile.id)
    .eq('status', 'present');

  const { count: totalPerformance } = await supabase
    .from('performance_records')
    .select('*', { count: 'exact', head: true })
    .eq('athlete_id', profile.id);

  // Get recent attendance (last 5)
  const { data: recentAttendance } = (await supabase
    .from('attendance_logs')
    .select(
      `
      *,
      training_sessions (
        session_name,
        session_type
      )
    `
    )
    .eq('athlete_id', profile.id)
    .order('session_date', { ascending: false })
    .limit(5)) as { data: AttendanceLog[] | null };

  // Get recent performance records (last 5)
  const { data: recentPerformance } = (await supabase
    .from('performance_records')
    .select('*')
    .eq('athlete_id', profile.id)
    .order('test_date', { ascending: false })
    .limit(5)) as { data: PerformanceRecord[] | null };

  // Calculate attendance this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: monthlyAttendance } = await supabase
    .from('attendance_logs')
    .select('*', { count: 'exact', head: true })
    .eq('athlete_id', profile.id)
    .eq('status', 'present')
    .gte('session_date', startOfMonth.toISOString());

  // Get upcoming sessions count
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count: upcomingSessionsCount } = await supabase
    .from('training_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('club_id', profile.clubs?.id || '')
    .gte('session_date', today.toISOString());

  const progressPercentage = totalPerformance
    ? Math.min(100, totalPerformance * 10)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AthleteHeader
        firstName={profile.first_name}
        lastName={profile.last_name}
        nickname={profile.nickname}
        clubName={profile.clubs?.name}
        profilePictureUrl={profile.profile_picture_url}
      />

      <div className="mx-auto max-w-7xl p-6">
        {/* Statistics Cards */}
        <div className="mb-8">
          <DashboardStats
            totalAttendance={totalAttendance || 0}
            monthlyAttendance={monthlyAttendance || 0}
            totalPerformance={totalPerformance || 0}
            progressPercentage={progressPercentage}
          />
        </div>

        {/* Upcoming Sessions Banner */}
        {upcomingSessionsCount && upcomingSessionsCount > 0 && (
          <Link
            href="/dashboard/athlete/schedule"
            className="mb-8 block rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white shadow-lg transition-transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-white/20 p-3">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    มีการฝึกซ้อมที่กำลังจะมาถึง
                  </h3>
                  <p className="text-sm text-blue-100">
                    {upcomingSessionsCount} รายการ - คลิกเพื่อดูตารางเต็ม
                  </p>
                </div>
              </div>
              <div className="text-3xl font-bold">{upcomingSessionsCount}</div>
            </div>
          </Link>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Recent Activity */}
        <RecentActivity
          recentAttendance={recentAttendance}
          recentPerformance={recentPerformance}
        />
      </div>
    </div>
  );
}
