import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CoachActivityList } from '@/components/coach/CoachActivityList';
import { CreateActivityDialog } from '@/components/coach/CreateActivityDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function CoachActivitiesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Get coach profile
  const { data: coach } = await supabase
    .from('coaches')
    .select('id, club_id')
    .eq('user_id', user.id)
    .single();

  if (!coach) {
    return <div>ไม่พบข้อมูลโค้ช</div>;
  }

  // Get all activities
  const { data: activities } = await supabase
    .from('activities')
    .select(`
      *,
      activity_registrations (
        id,
        status,
        athlete_id,
        athletes (first_name, last_name)
      ),
      activity_checkins (
        id,
        status,
        checked_in_at,
        athlete_id,
        athletes (first_name, last_name)
      )
    `)
    .eq('club_id', (coach as any).club_id)
    .order('activity_date', { ascending: false })
    .order('start_time', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">จัดการกิจกรรม</h1>
            <p className="text-gray-600 mt-2">
              สร้างกิจกรรม สร้าง QR Code และจัดการการลงทะเบียน
            </p>
          </div>
          <CreateActivityDialog>
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              สร้างกิจกรรม
            </Button>
          </CreateActivityDialog>
        </div>

        <CoachActivityList activities={activities || []} />
      </div>
    </div>
  );
}
