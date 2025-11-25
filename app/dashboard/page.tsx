import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Smart Dashboard Router
 * Automatically redirects users to their role-specific dashboard
 * - Admin → /dashboard/admin
 * - Coach → /dashboard/coach
 * - Athlete → /dashboard/athlete
 */
export default async function DashboardPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Get user role from user_roles table
  const { data: userRole, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (roleError || !userRole) {
    // If no role found, check if user has a profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role) {
      // Redirect based on profile role
      switch (profile.role) {
        case 'admin':
          redirect('/dashboard/admin');
        case 'coach':
          redirect('/dashboard/coach');
        case 'athlete':
          redirect('/dashboard/athlete');
        default:
          redirect('/pending-approval');
      }
    }

    // No role found, redirect to pending approval
    redirect('/pending-approval');
  }

  // Redirect based on user role
  switch (userRole.role) {
    case 'admin':
      redirect('/dashboard/admin');
    case 'coach':
      redirect('/dashboard/coach');
    case 'athlete':
      redirect('/dashboard/athlete');
    default:
      redirect('/pending-approval');
  }
}
