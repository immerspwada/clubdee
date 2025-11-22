import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ChevronLeft, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function CoachSessionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Get coach profile
  const { data: coach } = await supabase
    .from('coaches')
    .select('id, club_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!coach) {
    redirect('/dashboard/coach');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl p-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/coach"
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ตารางฝึกซ้อม
              </h1>
              <p className="text-sm text-gray-600">
                สร้างและจัดการตารางการฝึกซ้อม
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            ฟีเจอร์กำลังพัฒนา
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            ระบบจัดการตารางฝึกซ้อมจะพร้อมใช้งานเร็วๆ นี้
          </p>
        </div>
      </div>
    </div>
  );
}
