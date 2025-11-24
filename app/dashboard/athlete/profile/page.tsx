import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { User, Mail, Phone, Calendar, Heart, Building2 } from 'lucide-react';

interface AthleteProfile {
  id: string;
  user_id: string;
  club_id: string;
  first_name: string;
  last_name: string;
  nickname?: string;
  date_of_birth: string;
  phone_number: string;
  email: string;
  gender: string;
  health_notes?: string;
  profile_picture_url?: string;
  clubs?: {
    id: string;
    name: string;
    description?: string;
  };
}

export default async function AthleteProfilePage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Get athlete profile
  const { data: profile, error: profileError } = await supabase
    .from('athletes')
    .select(
      `
      *,
      clubs (
        id,
        name,
        description
      )
    `
    )
    .eq('user_id', user.id)
    .single() as { data: AthleteProfile | null; error: any };

  if (profileError || !profile) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900">ข้อมูลส่วนตัว</h1>
        <p className="mt-4 text-red-600">ไม่พบข้อมูลโปรไฟล์</p>
      </div>
    );
  }

  const athleteId = profile.id;

  // Get training history count
  const { count: trainingCount } = await supabase
    .from('attendance_logs')
    .select('*', { count: 'exact', head: true })
    .eq('athlete_id', athleteId)
    .eq('status', 'present');

  // Get performance records count
  const { count: performanceCount } = await supabase
    .from('performance_records')
    .select('*', { count: 'exact', head: true })
    .eq('athlete_id', athleteId);

  return (
    <div className="max-w-lg mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-sm p-6 mb-4 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
              {profile.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {profile.first_name} {profile.last_name}
              </h1>
              {profile.nickname && (
                <p className="text-sm opacity-90">({profile.nickname})</p>
              )}
              <p className="text-xs opacity-75 mt-1">นักกีฬา</p>
            </div>
          </div>
          <a
            href="/dashboard/athlete/profile/edit"
            className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-medium hover:bg-white/30 transition-colors"
          >
            แก้ไข
          </a>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{trainingCount || 0}</p>
            <p className="text-xs opacity-75 mt-1">ครั้งฝึก</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{performanceCount || 0}</p>
            <p className="text-xs opacity-75 mt-1">ผลทดสอบ</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">A+</p>
            <p className="text-xs opacity-75 mt-1">เกรด</p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">ข้อมูลส่วนตัว</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600">อีเมล</p>
              <p className="text-sm font-medium text-gray-900 truncate">{profile.email}</p>
            </div>
          </div>

          {profile.phone_number && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600">เบอร์โทร</p>
                <p className="text-sm font-medium text-gray-900">{profile.phone_number}</p>
              </div>
            </div>
          )}

          {profile.date_of_birth && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600">วันเกิด</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(profile.date_of_birth).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}

          {profile.clubs && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600">สโมสร</p>
                <p className="text-sm font-medium text-gray-900">{profile.clubs.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Health Notes */}
      {profile.health_notes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow-sm p-5 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-900 mb-1">บันทึกสุขภาพ</h3>
              <p className="text-sm text-yellow-800">{profile.health_notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">เมนูด่วน</h2>
        <div className="space-y-2">
          <a
            href="/dashboard/athlete/attendance"
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">ประวัติการเข้าร่วม</p>
              <p className="text-xs text-gray-600">ดูประวัติการฝึกซ้อม</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          <a
            href="/dashboard/athlete/performance"
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <Heart className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">ผลการทดสอบ</p>
              <p className="text-xs text-gray-600">ดูผลงานและความก้าวหน้า</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          <a
            href="/dashboard/athlete/applications"
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">ใบสมัครของฉัน</p>
              <p className="text-xs text-gray-600">ดูสถานะการสมัคร</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
