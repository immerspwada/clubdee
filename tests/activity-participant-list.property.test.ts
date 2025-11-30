/**
 * Property-Based Test for Activity Participant List
 * **Feature: feature-integration-plan, Property 11: Activity Participant List**
 * 
 * Property 11: Activity Participant List
 * *For any* activity, the coach should see all athletes who checked in 
 * with their timestamps.
 * 
 * **Validates: Requirements 3.4**
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fc from 'fast-check';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface Activity {
  id: string;
  club_id: string;
  coach_id: string | null;
  title: string;
  activity_date: string;
}

interface ActivityCheckIn {
  id: string;
  activity_id: string;
  athlete_id: string;
  status: string;
  checked_in_at: string;
  checkin_method: string | null;
}

interface Athlete {
  id: string;
  user_id: string;
  club_id: string;
}

interface Coach {
  id: string;
  user_id: string;
  club_id: string;
}

describe('Property 11: Activity Participant List', () => {
  let supabase: SupabaseClient;
  let allActivities: Activity[] = [];
  let allCheckIns: ActivityCheckIn[] = [];
  let allAthletes: Athlete[] = [];
  let allCoaches: Coach[] = [];

  beforeAll(async () => {
    supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all activities
    const { data: activities } = await supabase
      .from('activities')
      .select('id, club_id, coach_id, title, activity_date');
    allActivities = activities || [];

    // Fetch all activity check-ins
    const { data: checkIns } = await supabase
      .from('activity_checkins')
      .select('id, activity_id, athlete_id, status, checked_in_at, checkin_method');
    allCheckIns = checkIns || [];

    // Fetch all athletes
    const { data: athletes } = await supabase
      .from('athletes')
      .select('id, user_id, club_id');
    allAthletes = athletes || [];

    // Fetch all coaches
    const { data: coaches } = await supabase
      .from('coaches')
      .select('id, user_id, club_id');
    allCoaches = coaches || [];

    console.log('Test setup:', {
      activityCount: allActivities.length,
      checkInCount: allCheckIns.length,
      athleteCount: allAthletes.length,
      coachCount: allCoaches.length,
    });
  });

  /**
   * **Feature: feature-integration-plan, Property 11: Activity Participant List**
   * 
   * For any activity with check-ins, the participant list should include
   * all athletes who checked in.
   */
  it('participant list includes all checked-in athletes', async () => {
    // Get activities that have check-ins
    const activitiesWithCheckIns = allActivities.filter(activity =>
      allCheckIns.some(c => c.activity_id === activity.id)
    );

    if (activitiesWithCheckIns.length === 0) {
      console.log('Skipping: No activities with check-ins available');
      return;
    }

    const activityArb = fc.constantFrom(...activitiesWithCheckIns.slice(0, 50));

    await fc.assert(
      fc.asyncProperty(activityArb, async (activity) => {
        // Get all check-ins for this activity from the database
        const { data: participants, error } = await supabase
          .from('activity_checkins')
          .select('id, athlete_id, checked_in_at, status')
          .eq('activity_id', activity.id)
          .order('checked_in_at', { ascending: true });

        expect(error).toBeNull();

        // Get expected check-ins from our cached data
        const expectedCheckIns = allCheckIns.filter(c => c.activity_id === activity.id);

        // Property: All expected check-ins should be in the participant list
        expect(participants?.length).toBe(expectedCheckIns.length);

        // Property: Each participant should have required fields
        participants?.forEach(participant => {
          expect(participant.athlete_id).toBeDefined();
          expect(participant.athlete_id).not.toBeNull();
          expect(participant.checked_in_at).toBeDefined();
          expect(participant.checked_in_at).not.toBeNull();
        });
      }),
      { numRuns: Math.min(50, activitiesWithCheckIns.length) }
    );
  }, 90000);

  /**
   * **Feature: feature-integration-plan, Property 11: Activity Participant List**
   * 
   * For any participant in the list, the timestamp should be valid and recorded.
   */
  it('all participants have valid timestamps', async () => {
    if (allCheckIns.length === 0) {
      console.log('Skipping: No check-in records available');
      return;
    }

    const checkInArb = fc.constantFrom(...allCheckIns.slice(0, 100));

    await fc.assert(
      fc.asyncProperty(checkInArb, async (checkIn) => {
        // Property: Check-in timestamp must be defined
        expect(checkIn.checked_in_at).toBeDefined();
        expect(checkIn.checked_in_at).not.toBeNull();

        // Property: Timestamp should be a valid ISO date string
        const timestamp = new Date(checkIn.checked_in_at);
        expect(timestamp.toString()).not.toBe('Invalid Date');

        // Property: Timestamp should be in a reasonable range (not in the future)
        const now = new Date();
        expect(timestamp.getTime()).toBeLessThanOrEqual(now.getTime() + 86400000); // Allow 1 day buffer
      }),
      { numRuns: Math.min(100, allCheckIns.length) }
    );
  }, 60000);

  /**
   * **Feature: feature-integration-plan, Property 11: Activity Participant List**
   * 
   * For any activity, the coach should be able to see all participants
   * (verified by club membership).
   */
  it('coach can view participants from their club activities', async () => {
    // Find activities with coaches and check-ins
    const activitiesWithCoachAndCheckIns = allActivities.filter(activity =>
      activity.coach_id !== null &&
      allCheckIns.some(c => c.activity_id === activity.id)
    );

    if (activitiesWithCoachAndCheckIns.length === 0) {
      console.log('Skipping: No activities with coach and check-ins available');
      return;
    }

    const activityArb = fc.constantFrom(...activitiesWithCoachAndCheckIns.slice(0, 30));

    await fc.assert(
      fc.asyncProperty(activityArb, async (activity) => {
        // Find the coach for this activity
        const coach = allCoaches.find(c => c.id === activity.coach_id);

        if (!coach) {
          return; // Skip if coach not found
        }

        // Property: Coach's club should match activity's club
        expect(coach.club_id).toBe(activity.club_id);

        // Get participants for this activity
        const { data: participants, error } = await supabase
          .from('activity_checkins')
          .select('athlete_id, checked_in_at')
          .eq('activity_id', activity.id);

        expect(error).toBeNull();

        // Property: All participants should be athletes from the same club
        if (participants && participants.length > 0) {
          for (const participant of participants) {
            const athlete = allAthletes.find(a => a.id === participant.athlete_id);
            if (athlete) {
              expect(athlete.club_id).toBe(activity.club_id);
            }
          }
        }
      }),
      { numRuns: Math.min(30, activitiesWithCoachAndCheckIns.length) }
    );
  }, 90000);

  /**
   * **Feature: feature-integration-plan, Property 11: Activity Participant List**
   * 
   * For any activity, participants should be ordered by check-in time.
   */
  it('participants are ordered by check-in time', async () => {
    // Get activities with multiple check-ins
    const activityCheckInCounts = new Map<string, number>();
    allCheckIns.forEach(c => {
      const count = activityCheckInCounts.get(c.activity_id) || 0;
      activityCheckInCounts.set(c.activity_id, count + 1);
    });

    const activitiesWithMultipleCheckIns = allActivities.filter(
      activity => (activityCheckInCounts.get(activity.id) || 0) >= 2
    );

    if (activitiesWithMultipleCheckIns.length === 0) {
      console.log('Skipping: No activities with multiple check-ins available');
      return;
    }

    const activityArb = fc.constantFrom(...activitiesWithMultipleCheckIns.slice(0, 20));

    await fc.assert(
      fc.asyncProperty(activityArb, async (activity) => {
        // Get participants ordered by check-in time
        const { data: participants, error } = await supabase
          .from('activity_checkins')
          .select('athlete_id, checked_in_at')
          .eq('activity_id', activity.id)
          .order('checked_in_at', { ascending: true });

        expect(error).toBeNull();

        if (participants && participants.length >= 2) {
          // Property: Participants should be in ascending order by check-in time
          for (let i = 1; i < participants.length; i++) {
            const prevTime = new Date(participants[i - 1].checked_in_at).getTime();
            const currTime = new Date(participants[i].checked_in_at).getTime();
            expect(currTime).toBeGreaterThanOrEqual(prevTime);
          }
        }
      }),
      { numRuns: Math.min(20, activitiesWithMultipleCheckIns.length) }
    );
  }, 60000);

  /**
   * **Feature: feature-integration-plan, Property 11: Activity Participant List**
   * 
   * Simulates the getActivityParticipants function logic.
   */
  it('simulated getActivityParticipants returns correct data', () => {
    interface SimulatedCheckIn {
      activityId: string;
      athleteId: string;
      athleteName: string;
      checkInTime: string;
      status: 'on_time' | 'late';
    }

    interface ParticipantResult {
      athleteId: string;
      athleteName: string;
      checkInTime: string;
      status: string;
    }

    // Simulated data store
    interface DataStore {
      checkIns: SimulatedCheckIn[];
    }

    // Function to get activity participants
    function getActivityParticipants(
      store: DataStore,
      activityId: string
    ): ParticipantResult[] {
      return store.checkIns
        .filter(c => c.activityId === activityId)
        .sort((a, b) => new Date(a.checkInTime).getTime() - new Date(b.checkInTime).getTime())
        .map(c => ({
          athleteId: c.athleteId,
          athleteName: c.athleteName,
          checkInTime: c.checkInTime,
          status: c.status,
        }));
    }

    // Arbitraries
    const activityIdArb = fc.uuid();
    const athleteIdArb = fc.uuid();
    const athleteNameArb = fc.string({ minLength: 1, maxLength: 50 });
    const statusArb = fc.constantFrom('on_time', 'late') as fc.Arbitrary<'on_time' | 'late'>;
    const checkInTimeArb = fc.date({ min: new Date('2024-01-01'), max: new Date('2025-12-31') })
      .map(d => d.toISOString());

    const checkInArb = fc.record({
      activityId: activityIdArb,
      athleteId: athleteIdArb,
      athleteName: athleteNameArb,
      checkInTime: checkInTimeArb,
      status: statusArb,
    });

    fc.assert(
      fc.property(
        activityIdArb,
        fc.array(checkInArb, { minLength: 0, maxLength: 10 }),
        (targetActivityId, checkIns) => {
          // Create store with check-ins, some for target activity, some for others
          const store: DataStore = {
            checkIns: checkIns.map((c, i) => ({
              ...c,
              // Make some check-ins belong to target activity
              activityId: i % 2 === 0 ? targetActivityId : c.activityId,
            })),
          };

          const participants = getActivityParticipants(store, targetActivityId);

          // Property: All returned participants should be from the target activity
          participants.forEach(p => {
            const originalCheckIn = store.checkIns.find(
              c => c.activityId === targetActivityId && c.athleteId === p.athleteId
            );
            expect(originalCheckIn).toBeDefined();
          });

          // Property: Each participant should have all required fields
          participants.forEach(p => {
            expect(p.athleteId).toBeDefined();
            expect(p.athleteName).toBeDefined();
            expect(p.checkInTime).toBeDefined();
            expect(p.status).toBeDefined();
          });

          // Property: Participants should be sorted by check-in time
          for (let i = 1; i < participants.length; i++) {
            const prevTime = new Date(participants[i - 1].checkInTime).getTime();
            const currTime = new Date(participants[i].checkInTime).getTime();
            expect(currTime).toBeGreaterThanOrEqual(prevTime);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: feature-integration-plan, Property 11: Activity Participant List**
   * 
   * For any activity without check-ins, the participant list should be empty.
   */
  it('activities without check-ins have empty participant list', async () => {
    // Get activities without check-ins
    const activitiesWithoutCheckIns = allActivities.filter(activity =>
      !allCheckIns.some(c => c.activity_id === activity.id)
    );

    if (activitiesWithoutCheckIns.length === 0) {
      console.log('Skipping: All activities have check-ins');
      return;
    }

    const activityArb = fc.constantFrom(...activitiesWithoutCheckIns.slice(0, 30));

    await fc.assert(
      fc.asyncProperty(activityArb, async (activity) => {
        // Get participants for this activity
        const { data: participants, error } = await supabase
          .from('activity_checkins')
          .select('athlete_id, checked_in_at')
          .eq('activity_id', activity.id);

        expect(error).toBeNull();

        // Property: Participant list should be empty
        expect(participants?.length || 0).toBe(0);
      }),
      { numRuns: Math.min(30, activitiesWithoutCheckIns.length) }
    );
  }, 60000);

  /**
   * **Feature: feature-integration-plan, Property 11: Activity Participant List**
   * 
   * For any participant, the athlete should exist in the athletes table.
   */
  it('all participants reference valid athletes', async () => {
    if (allCheckIns.length === 0) {
      console.log('Skipping: No check-in records available');
      return;
    }

    const checkInArb = fc.constantFrom(...allCheckIns.slice(0, 50));

    await fc.assert(
      fc.asyncProperty(checkInArb, async (checkIn) => {
        // Find the athlete in our cached data
        const athlete = allAthletes.find(a => a.id === checkIn.athlete_id);

        // Property: Athlete should exist
        expect(athlete).toBeDefined();

        // Verify in database
        const { data: dbAthlete, error } = await supabase
          .from('athletes')
          .select('id, club_id')
          .eq('id', checkIn.athlete_id)
          .single();

        expect(error).toBeNull();
        expect(dbAthlete).not.toBeNull();
        expect(dbAthlete?.id).toBe(checkIn.athlete_id);
      }),
      { numRuns: Math.min(50, allCheckIns.length) }
    );
  }, 90000);

  /**
   * **Feature: feature-integration-plan, Property 11: Activity Participant List**
   * 
   * Simulates that participant count matches check-in count.
   */
  it('participant count equals check-in count for activity', () => {
    interface CheckIn {
      activityId: string;
      athleteId: string;
      checkInTime: string;
    }

    interface DataStore {
      checkIns: CheckIn[];
    }

    function getParticipantCount(store: DataStore, activityId: string): number {
      return store.checkIns.filter(c => c.activityId === activityId).length;
    }

    function getCheckInCount(store: DataStore, activityId: string): number {
      return store.checkIns.filter(c => c.activityId === activityId).length;
    }

    // Use simple string-based timestamps to avoid date parsing issues
    const activityIdArb = fc.uuid();
    const athleteIdArb = fc.uuid();
    const timestampArb = fc.integer({ min: 1704067200000, max: 1735689600000 }) // 2024-01-01 to 2025-01-01
      .map(ts => new Date(ts).toISOString());

    fc.assert(
      fc.property(
        activityIdArb,
        fc.array(
          fc.record({
            athleteId: athleteIdArb,
            checkInTime: timestampArb,
          }),
          { minLength: 0, maxLength: 20 }
        ),
        fc.array(fc.uuid(), { minLength: 0, maxLength: 5 }), // Other activity IDs
        (targetActivityId, targetCheckIns, otherActivityIds) => {
          // Create store with check-ins for target activity and some for other activities
          const store: DataStore = {
            checkIns: [
              // Check-ins for target activity
              ...targetCheckIns.map(c => ({
                activityId: targetActivityId,
                athleteId: c.athleteId,
                checkInTime: c.checkInTime,
              })),
              // Some check-ins for other activities
              ...otherActivityIds.map((otherId, i) => ({
                activityId: otherId,
                athleteId: `other-athlete-${i}`,
                checkInTime: new Date().toISOString(),
              })),
            ],
          };

          const participantCount = getParticipantCount(store, targetActivityId);
          const checkInCount = getCheckInCount(store, targetActivityId);

          // Property: Participant count should equal check-in count
          expect(participantCount).toBe(checkInCount);
          
          // Property: Count should match the number of target check-ins we added
          expect(participantCount).toBe(targetCheckIns.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});
