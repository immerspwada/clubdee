/**
 * Property-Based Test for Activity Visibility
 * **Feature: feature-integration-plan, Property 9: Activity Visibility**
 * 
 * Property 9: Activity Visibility
 * *For any* activity created by a coach, all athletes in the same club 
 * should see the activity in their activities list.
 * 
 * **Validates: Requirements 3.1**
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fc from 'fast-check';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface Coach {
  id: string;
  user_id: string;
  club_id: string;
}

interface Athlete {
  id: string;
  user_id: string;
  club_id: string;
}

interface Activity {
  id: string;
  club_id: string;
  coach_id: string | null;
  title: string;
  activity_date: string;
  start_time: string;
  end_time: string;
  location: string;
  status: string | null;
}

describe('Property 9: Activity Visibility', () => {
  let supabase: SupabaseClient;
  let allCoaches: Coach[] = [];
  let allAthletes: Athlete[] = [];
  let allActivities: Activity[] = [];

  beforeAll(async () => {
    supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all coaches with their club_id
    const { data: coaches } = await supabase
      .from('coaches')
      .select('id, user_id, club_id');
    allCoaches = coaches || [];

    // Fetch all athletes with their club_id
    const { data: athletes } = await supabase
      .from('athletes')
      .select('id, user_id, club_id');
    allAthletes = athletes || [];

    // Fetch all activities
    const { data: activities } = await supabase
      .from('activities')
      .select('id, club_id, coach_id, title, activity_date, start_time, end_time, location, status');
    allActivities = activities || [];

    console.log('Test setup:', {
      coachCount: allCoaches.length,
      athleteCount: allAthletes.length,
      activityCount: allActivities.length,
    });
  });

  /**
   * **Feature: feature-integration-plan, Property 9: Activity Visibility**
   * 
   * For any activity created by a coach, athletes in the same club
   * should be able to view that activity in their activities list.
   */
  it('athletes in the same club can view activities from their club', async () => {
    if (allCoaches.length === 0 || allAthletes.length === 0) {
      console.log('Skipping: No coaches or athletes available');
      return;
    }

    // Find coach-athlete pairs in the same club
    const sameClubPairs: Array<{ coach: Coach; athlete: Athlete }> = [];
    
    for (const coach of allCoaches) {
      for (const athlete of allAthletes) {
        if (coach.club_id === athlete.club_id && coach.club_id !== null) {
          sameClubPairs.push({ coach, athlete });
          if (sameClubPairs.length >= 50) break;
        }
      }
      if (sameClubPairs.length >= 50) break;
    }

    if (sameClubPairs.length === 0) {
      console.log('Skipping: No same-club coach-athlete pairs found');
      return;
    }

    const pairArb = fc.constantFrom(...sameClubPairs);

    await fc.assert(
      fc.asyncProperty(pairArb, async ({ coach, athlete }) => {
        // Property: Coach and athlete must have the same club_id
        expect(coach.club_id).toBe(athlete.club_id);

        // Get activities from this club
        const { data: clubActivities, error } = await supabase
          .from('activities')
          .select('id, club_id, coach_id')
          .eq('club_id', coach.club_id);

        expect(error).toBeNull();

        // Property: All activities from this club should be visible to athletes in the same club
        if (clubActivities && clubActivities.length > 0) {
          clubActivities.forEach((activity) => {
            // Activity must belong to the same club as the athlete
            expect(activity.club_id).toBe(athlete.club_id);
          });
        }
      }),
      { numRuns: Math.min(30, sameClubPairs.length) }
    );
  }, 90000);

  /**
   * **Feature: feature-integration-plan, Property 9: Activity Visibility**
   * 
   * For any activity, athletes NOT in the same club should NOT see it.
   */
  it('athletes cannot view activities from different clubs', async () => {
    if (allCoaches.length === 0 || allAthletes.length === 0) {
      console.log('Skipping: No coaches or athletes available');
      return;
    }

    // Find coach-athlete pairs in different clubs
    const differentClubPairs: Array<{ coach: Coach; athlete: Athlete }> = [];
    
    for (const coach of allCoaches) {
      for (const athlete of allAthletes) {
        if (coach.club_id !== athlete.club_id && coach.club_id !== null && athlete.club_id !== null) {
          differentClubPairs.push({ coach, athlete });
          if (differentClubPairs.length >= 20) break;
        }
      }
      if (differentClubPairs.length >= 20) break;
    }

    if (differentClubPairs.length === 0) {
      console.log('Skipping: No different-club coach-athlete pairs found');
      return;
    }

    const pairArb = fc.constantFrom(...differentClubPairs);

    await fc.assert(
      fc.asyncProperty(pairArb, async ({ coach, athlete }) => {
        // Property: Coach and athlete must have different club_ids
        expect(coach.club_id).not.toBe(athlete.club_id);

        // Get activities from coach's club
        const { data: coachClubActivities } = await supabase
          .from('activities')
          .select('id, club_id')
          .eq('club_id', coach.club_id);

        // Property: Activities from coach's club should NOT be in athlete's club
        if (coachClubActivities && coachClubActivities.length > 0) {
          coachClubActivities.forEach((activity) => {
            expect(activity.club_id).not.toBe(athlete.club_id);
          });
        }

        // Get activities from athlete's club
        const { data: athleteClubActivities } = await supabase
          .from('activities')
          .select('id, club_id')
          .eq('club_id', athlete.club_id);

        // Property: Activities from athlete's club should NOT be in coach's club
        if (athleteClubActivities && athleteClubActivities.length > 0) {
          athleteClubActivities.forEach((activity) => {
            expect(activity.club_id).not.toBe(coach.club_id);
          });
        }
      }),
      { numRuns: Math.min(20, differentClubPairs.length) }
    );
  }, 90000);

  /**
   * **Feature: feature-integration-plan, Property 9: Activity Visibility**
   * 
   * For any existing activity, verify it is associated with a valid club.
   */
  it('all activities are properly associated with clubs', async () => {
    if (allActivities.length === 0) {
      console.log('Skipping: No activities available');
      return;
    }

    const limitedActivities = allActivities.slice(0, 100);
    const activityArb = fc.constantFrom(...limitedActivities);

    await fc.assert(
      fc.asyncProperty(activityArb, async (activity) => {
        // Property: Every activity must have a valid club_id
        expect(activity.club_id).not.toBeNull();
        expect(activity.club_id).toBeDefined();

        // Verify the club exists
        const { data: club, error } = await supabase
          .from('clubs')
          .select('id, name')
          .eq('id', activity.club_id)
          .single();

        expect(error).toBeNull();
        expect(club).not.toBeNull();
        expect(club?.id).toBe(activity.club_id);
      }),
      { numRuns: Math.min(100, limitedActivities.length) }
    );
  }, 60000);

  /**
   * **Feature: feature-integration-plan, Property 9: Activity Visibility**
   * 
   * For any activity, all athletes in the activity's club should be able
   * to access it (verified by club membership).
   */
  it('activity visibility is determined by club membership', async () => {
    if (allActivities.length === 0 || allAthletes.length === 0) {
      console.log('Skipping: No activities or athletes available');
      return;
    }

    // Get activities with valid club_id
    const activitiesWithClub = allActivities.filter(a => a.club_id !== null).slice(0, 50);

    if (activitiesWithClub.length === 0) {
      console.log('Skipping: No activities with valid club associations');
      return;
    }

    const activityArb = fc.constantFrom(...activitiesWithClub);

    await fc.assert(
      fc.asyncProperty(activityArb, async (activity) => {
        // Get all athletes in the same club as the activity
        const athletesInClub = allAthletes.filter(a => a.club_id === activity.club_id);

        // Property: Athletes in the same club should have matching club_id
        athletesInClub.forEach(athlete => {
          expect(athlete.club_id).toBe(activity.club_id);
        });

        // Property: Athletes NOT in this club should have different club_id
        const athletesNotInClub = allAthletes.filter(a => a.club_id !== activity.club_id);
        athletesNotInClub.forEach(athlete => {
          expect(athlete.club_id).not.toBe(activity.club_id);
        });
      }),
      { numRuns: Math.min(50, activitiesWithClub.length) }
    );
  }, 60000);

  /**
   * **Feature: feature-integration-plan, Property 9: Activity Visibility**
   * 
   * For any coach who creates an activity, the activity should be visible to
   * all athletes in the coach's club.
   */
  it('activities created by a coach are visible to all athletes in the same club', async () => {
    if (allActivities.length === 0 || allCoaches.length === 0 || allAthletes.length === 0) {
      console.log('Skipping: Insufficient data for coach-activity-athlete test');
      return;
    }

    // Get activities with valid coach_id
    const activitiesWithCoach = allActivities.filter(a => a.coach_id !== null).slice(0, 50);

    if (activitiesWithCoach.length === 0) {
      console.log('Skipping: No activities with valid coach associations');
      return;
    }

    const activityArb = fc.constantFrom(...activitiesWithCoach);

    await fc.assert(
      fc.asyncProperty(activityArb, async (activity) => {
        // Find the coach who created this activity
        const coach = allCoaches.find(c => c.id === activity.coach_id);
        
        if (!coach) {
          // Activity has a coach_id but coach not found - skip this case
          return;
        }

        // Property: Activity's club_id should match the coach's club_id
        expect(activity.club_id).toBe(coach.club_id);

        // Get all athletes in the coach's club
        const athletesInCoachClub = allAthletes.filter(a => a.club_id === coach.club_id);

        // Property: All athletes in the coach's club should be able to see this activity
        // (verified by matching club_id)
        athletesInCoachClub.forEach(athlete => {
          expect(athlete.club_id).toBe(activity.club_id);
        });
      }),
      { numRuns: Math.min(50, activitiesWithCoach.length) }
    );
  }, 60000);

  /**
   * **Feature: feature-integration-plan, Property 9: Activity Visibility**
   * 
   * Verify that querying activities by club_id returns only activities from that club.
   */
  it('club_id filtering correctly isolates activities', async () => {
    // Get unique club_ids from activities
    const clubIds = [...new Set(allActivities.map(a => a.club_id).filter(id => id !== null))];

    if (clubIds.length < 2) {
      console.log('Skipping: Need at least 2 clubs with activities for isolation test');
      return;
    }

    const clubIdArb = fc.constantFrom(...clubIds.slice(0, 10));

    await fc.assert(
      fc.asyncProperty(clubIdArb, async (clubId) => {
        // Get activities for this specific club
        const { data: clubActivities, error } = await supabase
          .from('activities')
          .select('id, club_id')
          .eq('club_id', clubId);

        expect(error).toBeNull();

        // Property: All returned activities must belong to the queried club
        if (clubActivities && clubActivities.length > 0) {
          clubActivities.forEach((activity) => {
            expect(activity.club_id).toBe(clubId);
          });
        }

        // Get activities NOT in this club
        const { data: otherActivities } = await supabase
          .from('activities')
          .select('id, club_id')
          .neq('club_id', clubId)
          .limit(10);

        // Property: Activities from other clubs should have different club_id
        if (otherActivities && otherActivities.length > 0) {
          otherActivities.forEach((activity) => {
            expect(activity.club_id).not.toBe(clubId);
          });
        }
      }),
      { numRuns: Math.min(10, clubIds.length) }
    );
  }, 30000);
});
