'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface DashboardStats {
  totalUsers: number;
  totalClubs: number;
  totalAthletes: number;
  totalCoaches: number;
  recentActivities: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const supabase = await createClient();

    // Get total clubs
    const { count: clubsCount } = await supabase
      .from('clubs')
      .select('*', { count: 'exact', head: true });

    // Get total athletes
    const { count: athletesCount } = await supabase
      .from('athletes')
      .select('*', { count: 'exact', head: true });

    // Get total coaches
    const { count: coachesCount } = await supabase
      .from('coaches')
      .select('*', { count: 'exact', head: true });

    // Get recent training sessions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: sessionsCount } = await supabase
      .from('training_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('session_date', thirtyDaysAgo.toISOString().split('T')[0]);

    return {
      totalUsers: (athletesCount || 0) + (coachesCount || 0),
      totalClubs: clubsCount || 0,
      totalAthletes: athletesCount || 0,
      totalCoaches: coachesCount || 0,
      recentActivities: sessionsCount || 0,
    };
  } catch {
    return {
      totalUsers: 0,
      totalClubs: 0,
      totalAthletes: 0,
      totalCoaches: 0,
      recentActivities: 0,
    };
  }
}

export async function getAllClubs() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .order('name');

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch clubs',
    };
  }
}

export async function createClub(name: string, sportType: string, description?: string) {
  try {
    const supabase = await createClient();

    const insertData: {
      name: string;
      sport_type: string;
      description?: string;
    } = {
      name,
      sport_type: sportType,
    };

    if (description) {
      insertData.description = description;
    }

    const { data, error } = await supabase
      .from('clubs')
      .insert(insertData as never)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/admin/clubs');

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create club',
    };
  }
}

export async function updateClub(
  id: string,
  name: string,
  sportType: string,
  description?: string
) {
  try {
    const supabase = await createClient();

    const updateData: {
      name: string;
      sport_type: string;
      description?: string;
    } = {
      name,
      sport_type: sportType,
    };

    if (description) {
      updateData.description = description;
    }

    const { data, error } = await supabase
      .from('clubs')
      .update(updateData as never)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/admin/clubs');

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update club',
    };
  }
}

export async function deleteClub(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('clubs').delete().eq('id', id);

    if (error) throw error;

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/admin/clubs');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete club',
    };
  }
}

export async function getAllCoaches() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('coaches')
      .select(
        `
        *,
        clubs (
          id,
          name,
          sport_type
        )
      `
      )
      .order('first_name');

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch coaches',
    };
  }
}

export async function assignCoachToClub(coachId: string, clubId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('coaches')
      .update({ club_id: clubId } as never)
      .eq('id', coachId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/admin/coaches');

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to assign coach',
    };
  }
}

export async function getAllAthletes() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('athletes')
      .select(
        `
        *,
        clubs (
          id,
          name,
          sport_type
        )
      `
      )
      .order('first_name');

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch athletes',
    };
  }
}

export async function deleteUser(userId: string, userType: 'athlete' | 'coach') {
  try {
    const supabase = await createClient();

    const table = userType === 'athlete' ? 'athletes' : 'coaches';

    // Delete from the specific table (will cascade to user_roles and auth.users)
    const { error } = await supabase.from(table).delete().eq('user_id', userId);

    if (error) throw error;

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/admin/coaches');
    revalidatePath('/dashboard/admin/athletes');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete user',
    };
  }
}
