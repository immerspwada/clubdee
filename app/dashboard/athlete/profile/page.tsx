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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ข้อมูลส่วนตัว</h1>
          <p className="mt-2 text-gray-600">ข้อมูลส่วนตัวและสถิติของคุณ</p>
        </div>

        {/* Profile Card */}
        <div className="rounded-lg bg-white p-8 shadow">
          {/* Profile Picture and Basic Info */}
          <div className="flex items-start gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
              {profile.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-blue-600" />
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {profile.first_name} {profile.last_name}
                {profile.nickname && (
                  <span className="ml-2 text-lg text-gray-600">
                    ({profile.nickname})
                  </span>
                )}
              </h2>
              <p className="mt-1 text-gray-600">นักกีฬา</p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                {profile.phone_number && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{profile.phone_number}</span>
                  </div>
                )}
                {profile.date_of_birth && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(profile.date_of_birth).toLocaleDateString(
                        'th-TH',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                )}
                {profile.clubs && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm">{profile.clubs.name}</span>
                  </div>
                )}
              </div>

              {profile.health_notes && (
                <div className="mt-4 rounded-lg bg-yellow-50 p-3">
                  <div className="flex items-start gap-2">
                    <Heart className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">
                        บันทึกสุขภาพ
                      </p>
                      <p className="text-sm text-yellow-700">
                        {profile.health_notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a
              href="/dashboard/athlete/profile/edit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              แก้ไขโปรไฟล์
            </a>
          </div>

          {/* Statistics */}
          <div className="mt-8 grid gap-4 border-t pt-8 sm:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">การฝึกซ้อม</h3>
              </div>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {trainingCount || 0}
              </p>
              <p className="text-sm text-gray-600">ครั้งที่เข้าร่วม</p>
            </div>

            <div className="rounded-lg bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">ผลการทดสอบ</h3>
              </div>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {performanceCount || 0}
              </p>
              <p className="text-sm text-gray-600">บันทึกทั้งหมด</p>
            </div>

            <div className="rounded-lg bg-purple-50 p-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">สโมสร</h3>
              </div>
              <p className="mt-2 text-lg font-bold text-purple-600">
                {profile.clubs?.name || 'ไม่ระบุ'}
              </p>
              <p className="text-sm text-gray-600">สมาชิก</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a
            href="/dashboard/athlete/attendance"
            className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md"
          >
            <Calendar className="mb-2 h-8 w-8 text-blue-600" />
            <h3 className="font-semibold text-gray-900">ประวัติการเข้าร่วม</h3>
            <p className="mt-1 text-sm text-gray-600">
              ดูประวัติการเข้าร่วมการฝึกซ้อม
            </p>
          </a>

          <a
            href="/dashboard/athlete/performance"
            className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md"
          >
            <Heart className="mb-2 h-8 w-8 text-green-600" />
            <h3 className="font-semibold text-gray-900">ผลการทดสอบ</h3>
            <p className="mt-1 text-sm text-gray-600">
              ดูผลการทดสอบและความก้าวหน้า
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
