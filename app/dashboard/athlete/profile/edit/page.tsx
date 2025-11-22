import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileEditForm from '@/components/athlete/ProfileEditForm';

export default async function AthleteProfileEditPage() {
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
  const { data: athlete, error: profileError } = await supabase
    .from('athletes')
    .select(
      `
      *,
      clubs (
        id,
        name
      )
    `
    )
    .eq('user_id', user.id)
    .single();

  if (profileError || !athlete) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900">แก้ไขโปรไฟล์</h1>
        <p className="mt-4 text-red-600">ไม่พบข้อมูลโปรไฟล์</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">แก้ไขโปรไฟล์</h1>
          <p className="mt-2 text-gray-600">
            อัปเดตข้อมูลส่วนตัวของคุณ
          </p>
        </div>

        <ProfileEditForm athlete={athlete} />
      </div>
    </div>
  );
}
