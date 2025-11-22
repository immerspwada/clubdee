import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Create admin client for role checking (bypasses RLS)
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // No need to set cookies for admin client
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect routes based on authentication
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Role-based routing for authenticated users
  if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
    // Get user role from database using admin client (bypasses RLS)
    const { data: userRoleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    const userRole = userRoleData?.role || 'athlete';

    // If accessing /dashboard root, redirect to role-specific dashboard
    if (request.nextUrl.pathname === '/dashboard') {
      const url = request.nextUrl.clone();
      if (userRole === 'admin') {
        url.pathname = '/dashboard/admin';
      } else if (userRole === 'coach') {
        url.pathname = '/dashboard/coach';
      } else if (userRole === 'athlete') {
        url.pathname = '/dashboard/athlete';
      } else {
        // Default to athlete if no role specified
        url.pathname = '/dashboard/athlete';
      }
      return NextResponse.redirect(url);
    }

    // Prevent users from accessing dashboards they don't have permission for
    if (
      userRole === 'athlete' &&
      !request.nextUrl.pathname.startsWith('/dashboard/athlete')
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard/athlete';
      return NextResponse.redirect(url);
    }

    if (
      userRole === 'coach' &&
      !request.nextUrl.pathname.startsWith('/dashboard/coach')
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard/coach';
      return NextResponse.redirect(url);
    }

    if (
      userRole === 'admin' &&
      !request.nextUrl.pathname.startsWith('/dashboard/admin')
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard/admin';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
