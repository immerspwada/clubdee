import { createClient } from '@/lib/supabase/server';
import { SimpleLoginForm } from '@/components/auth/SimpleLoginForm';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <SimpleLoginForm />
    </div>
  );
}
