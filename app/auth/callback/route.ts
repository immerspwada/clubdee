import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getRedirectUrl } from '@/lib/auth/config';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Get user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      type UserRole = 'admin' | 'coach' | 'athlete';
      const role: UserRole = (roleData as { role: UserRole } | null)?.role || 'athlete';
      const redirectUrl = getRedirectUrl(role);

      return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin));
    }
  }

  // If there's an error, redirect to login
  return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin));
}
