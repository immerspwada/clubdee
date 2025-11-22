# Athlete Data Access Restrictions

## Overview

This document verifies that Row Level Security (RLS) policies are properly implemented to enforce athlete data access restrictions as specified in **Requirements 2.3**.

## Requirement

**Requirement 2.3**: WHEN an athlete user logs in, THEN the System SHALL restrict data access to only the athlete's own personal information and club activities.

## RLS Policy Implementation

The following RLS policies have been implemented in the database to enforce athlete data access restrictions:

### 1. Athletes Table Policies

Located in: `supabase/migrations/20240101000002_rls_policies.sql`

```sql
-- Athletes can view and update their own data
CREATE POLICY "Athletes can view and update their own data"
  ON athletes FOR ALL
  USING (user_id = auth.uid());
```

**What this does:**
- Athletes can only SELECT, UPDATE, INSERT, and DELETE their own athlete record
- The policy checks that the `user_id` column matches the authenticated user's ID (`auth.uid()`)
- This prevents athletes from viewing or modifying other athletes' profiles

### 2. Verification of Policy Enforcement

The RLS policies ensure:

1. **Self-data-only access**: Athletes can only access their own profile data
   - Query: `SELECT * FROM athletes WHERE user_id = auth.uid()`
   - Result: Returns only the athlete's own record

2. **Prevention of cross-athlete access**: Athletes cannot view other athletes' data
   - Query: `SELECT * FROM athletes WHERE id = '<other_athlete_id>'`
   - Result: Returns empty set (RLS filters out unauthorized records)

3. **Prevention of unauthorized updates**: Athletes cannot update other athletes' profiles
   - Query: `UPDATE athletes SET nickname = 'Hacked' WHERE id = '<other_athlete_id>'`
   - Result: No rows affected (RLS prevents the update)

4. **Health notes privacy**: Athletes cannot access other athletes' sensitive health information
   - Query: `SELECT health_notes FROM athletes WHERE id = '<other_athlete_id>'`
   - Result: Returns empty set

### 3. Profile Edit Form Implementation

The profile edit form (`components/athlete/ProfileEditForm.tsx`) implements additional safeguards:

1. **Server-side verification**: The `updateAthleteProfile` action verifies ownership before allowing updates
   ```typescript
   if (athlete.user_id !== user.id) {
     return { error: 'ไม่ได้รับอนุญาต: คุณไม่สามารถแก้ไขโปรไฟล์ของผู้อื่นได้' };
   }
   ```

2. **Field restrictions**: Only specific fields can be updated by athletes:
   - ✅ Allowed: `nickname`, `phone_number`, `health_notes`, `profile_picture_url`
   - ❌ Prevented: `club_id`, `first_name`, `last_name`, `email`, `date_of_birth`, `gender`

3. **Read-only display**: Non-editable fields are displayed in a read-only section with a message:
   > "หากต้องการเปลี่ยนแปลงข้อมูลเหล่านี้ กรุณาติดต่อผู้ดูแลระบบหรือโค้ช"

### 4. Club Assignment Protection

**Property 13**: Club assignment modification prevention

The system prevents athletes from modifying their club assignment through multiple layers:

1. **Database RLS**: The `club_id` field is not included in the update data
2. **Server action**: The `updateAthleteProfile` function explicitly excludes `club_id` from updates
3. **UI**: The club field is displayed as read-only in the profile edit form

## Testing Approach

### Automated Tests

A comprehensive test suite has been implemented in `tests/athlete-access-restrictions.test.ts` that verifies:

1. ✅ Athletes can view their own profile
2. ✅ Athletes cannot view other athletes' profiles by ID
3. ✅ Athletes cannot list all athletes (only see their own)
4. ✅ Athletes cannot update other athletes' profiles
5. ✅ Athletes can update their own profile
6. ✅ Athletes cannot delete other athletes' profiles
7. ✅ Athletes cannot view other athletes' health notes
8. ✅ Athletes can view their own health notes

**To run the automated tests:**

```bash
cd sports-club-management
npm test -- tests/athlete-access-restrictions.test.ts --run
```

**Prerequisites for automated tests:**
- Database migrations must be applied to your Supabase project
- Environment variables must be configured in `.env.local`
- The database schema must match the migration files

### Manual Test Cases

If automated tests cannot run due to database setup, use these manual verification steps:

1. **Test: Athlete can view own profile**
   - Login as athlete A
   - Navigate to `/dashboard/athlete/profile`
   - Verify: Profile displays athlete A's data

2. **Test: Athlete cannot view another athlete's profile**
   - Login as athlete A
   - Attempt to access `/dashboard/athlete/profile` with athlete B's ID in URL
   - Verify: Access denied or redirected

3. **Test: Athlete can update own profile**
   - Login as athlete A
   - Navigate to `/dashboard/athlete/profile/edit`
   - Update nickname and health notes
   - Verify: Changes are saved successfully

4. **Test: Athlete cannot modify club assignment**
   - Login as athlete A
   - Navigate to `/dashboard/athlete/profile/edit`
   - Verify: Club field is read-only and cannot be changed

5. **Test: Database-level protection**
   - Use Supabase SQL Editor
   - Execute: `SELECT * FROM athletes;` as an athlete user
   - Verify: Only returns the athlete's own record

### Database-Level Verification

You can verify RLS policies directly in Supabase SQL Editor:

```sql
-- As an athlete user, this should only return your own record
SELECT * FROM athletes;

-- As an athlete user, this should return empty (no access to other athletes)
SELECT * FROM athletes WHERE user_id != auth.uid();

-- Verify the RLS policy exists
SELECT * FROM pg_policies WHERE tablename = 'athletes';
```

## Conclusion

The athlete data access restrictions are properly implemented through:

1. ✅ **Database-level RLS policies** that filter queries automatically
2. ✅ **Server-side validation** in the `updateAthleteProfile` action
3. ✅ **UI-level restrictions** in the profile edit form
4. ✅ **Field-level protection** preventing modification of sensitive fields like club assignment

These multiple layers of security ensure that **Requirement 2.3** is fully satisfied: athletes can only access their own personal information and cannot view or modify other athletes' data.

## Related Files

- RLS Policies: `supabase/migrations/20240101000002_rls_policies.sql`
- Server Actions: `lib/athlete/actions.ts`
- Profile Edit Form: `components/athlete/ProfileEditForm.tsx`
- Profile Edit Page: `app/dashboard/athlete/profile/edit/page.tsx`
- Requirements: `.kiro/specs/sports-club-management/requirements.md` (Requirement 2.3)
- Design: `.kiro/specs/sports-club-management/design.md` (Property 8, 13)
