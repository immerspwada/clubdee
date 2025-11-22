import { createClient } from '@/lib/supabase/server';
import { RegistrationForm } from '@/components/auth/RegistrationForm';
import { redirect } from 'next/navigation';

export default async function RegisterPage() {
  const supabase = await createClient();

  // Check if user is already logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  // Fetch available clubs
  const { data: clubs } = await supabase.from('clubs').select('id, name, sport_type').order('name');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <RegistrationForm clubs={clubs || []} />
    </div>
  );
}
