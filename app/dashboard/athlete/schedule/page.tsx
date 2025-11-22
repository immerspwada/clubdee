import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Calendar, ChevronLeft, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

interface TrainingSession {
  id: string;
  session_name: string;
  session_type: string;
  session_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  description?: string;
  coaches?: {
    first_name: string;
    last_name: string;
  };
}

export default async function SchedulePage() {
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
    .select('id, club_id')
    .eq('user_id', user.id)
    .single()) as { data: { id: string; club_id: string } | null };

  if (!profile) {
    redirect('/login');
  }

  // Get upcoming training sessions
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: upcomingSessions } = (await supabase
    .from('training_sessions')
    .select(
      `
      *,
      coaches (
        first_name,
        last_name
      )
    `
    )
    .eq('club_id', profile.club_id)
    .gte('session_date', today.toISOString())
    .order('session_date', { ascending: true })
    .order('start_time', { ascending: true })
    .limit(20)) as { data: TrainingSession[] | null };

  // Group sessions by date
  const sessionsByDate = upcomingSessions?.reduce((acc, session) => {
    const date = session.session_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, TrainingSession[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl p-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/athlete"
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ตารางการฝึกซ้อม
              </h1>
              <p className="text-sm text-gray-600">
                ดูตารางการฝึกซ้อมที่กำลังจะมาถึง
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl p-6">
        {sessionsByDate && Object.keys(sessionsByDate).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(sessionsByDate).map(([date, sessions]) => (
              <div key={date} className="rounded-lg bg-white shadow">
                <div className="border-b bg-gray-50 px-6 py-4">
                  <h2 className="font-semibold text-gray-900">
                    {new Date(date).toLocaleDateString('th-TH', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h2>
                </div>
                <div className="divide-y">
                  {sessions.map((session) => (
                    <div key={session.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {session.session_name}
                          </h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>
                                {session.start_time.slice(0, 5)} -{' '}
                                {session.end_time.slice(0, 5)} น.
                              </span>
                            </div>
                            {session.location && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>{session.location}</span>
                              </div>
                            )}
                            {session.coaches && (
                              <p className="text-sm text-gray-600">
                                โค้ช: {session.coaches.first_name}{' '}
                                {session.coaches.last_name}
                              </p>
                            )}
                            {session.description && (
                              <p className="mt-2 text-sm text-gray-600">
                                {session.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                          {session.session_type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              ยังไม่มีตารางการฝึกซ้อม
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              ตารางการฝึกซ้อมจะแสดงที่นี่เมื่อโค้ชสร้างขึ้น
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
