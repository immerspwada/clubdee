# Membership System Troubleshooting Guide

**Last Updated:** November 23, 2024  
**Version:** 1.0  
**Related Docs:** [MEMBERSHIP_APPROVAL_SYSTEM.md](./MEMBERSHIP_APPROVAL_SYSTEM.md), [MEMBERSHIP_DIAGNOSTIC_REPORT.md](./MEMBERSHIP_DIAGNOSTIC_REPORT.md)

## Table of Contents

1. [Common Issues](#common-issues)
2. [Data Inconsistency Issues](#data-inconsistency-issues)
3. [Access Control Issues](#access-control-issues)
4. [Application Workflow Issues](#application-workflow-issues)
5. [Diagnostic Queries](#diagnostic-queries)
6. [Recovery Procedures](#recovery-procedures)
7. [Prevention Best Practices](#prevention-best-practices)

---

## Common Issues

### Issue 1: Athlete Cannot Access Dashboard After Approval

**Symptoms:**
- Application shows as "approved" in database
- Athlete still redirected to `/pending-approval` page
- No error messages displayed

**Root Cause:**
Profile `membership_status` not updated to 'active' when application was approved.

**Diagnosis:**
```sql
-- Check profile status vs application status
SELECT 
  p.user_id,
  p.email,
  p.membership_status as profile_status,
  ma.status as application_status,
  ma.id as application_id
FROM profiles p
LEFT JOIN membership_applications ma ON ma.user_id = p.user_id
WHERE p.email = 'athlete@example.com';
```

**Solution:**
```sql
-- Fix single user
UPDATE profiles
SET membership_status = 'active'
WHERE user_id = (
  SELECT user_id FROM membership_applications 
  WHERE id = 'application-uuid-here' AND status = 'approved'
);
```

**Prevention:**
Ensure `reviewApplication()` function updates both tables atomically in a transaction.

---


### Issue 2: Coach Cannot See Applications

**Symptoms:**
- Coach logs in successfully
- Applications page shows empty list
- No pending applications visible

**Root Cause:**
- Coach's profile missing `club_id`
- RLS policies filter applications by coach's club
- No club = no applications visible

**Diagnosis:**
```sql
-- Check coach's club assignment
SELECT 
  p.user_id,
  p.email,
  p.role,
  p.club_id,
  c.name as club_name
FROM profiles p
LEFT JOIN clubs c ON c.id = p.club_id
WHERE p.email = 'coach@example.com';

-- Check if applications exist for that club
SELECT COUNT(*) as pending_count
FROM membership_applications
WHERE club_id = 'coach-club-id-here'
  AND status = 'pending';
```

**Solution:**
```sql
-- Assign coach to club
UPDATE profiles
SET club_id = 'club-uuid-here'
WHERE user_id = 'coach-user-id-here';
```

**Prevention:**
- Always assign `club_id` when creating coach profiles
- Add NOT NULL constraint on `profiles.club_id` for coaches
- Validate club assignment in coach creation workflow

---

### Issue 3: Duplicate Application Error

**Symptoms:**
- User tries to submit application
- Error: "มีคำขอรออนุมัติอยู่แล้ว" (Already have pending application)
- User claims they never submitted before

**Root Cause:**
- Previous application stuck in 'pending' status
- Application may be old or orphaned
- User forgot about previous submission

**Diagnosis:**
```sql
-- Find user's pending applications
SELECT 
  ma.id,
  ma.status,
  ma.created_at,
  ma.club_id,
  c.name as club_name,
  EXTRACT(DAY FROM NOW() - ma.created_at) as days_pending
FROM membership_applications ma
LEFT JOIN clubs c ON c.id = ma.club_id
WHERE ma.user_id = 'user-uuid-here'
  AND ma.status = 'pending'
ORDER BY ma.created_at DESC;
```

**Solutions:**

**Option A: Expire Old Application (if > 30 days)**
```sql
-- Manually expire old application
UPDATE membership_applications
SET 
  status = 'rejected',
  rejection_reason = 'คำขอหมดอายุ (เกิน 30 วัน)',
  reviewed_at = NOW(),
  updated_at = NOW()
WHERE id = 'application-uuid-here'
  AND status = 'pending'
  AND created_at < NOW() - INTERVAL '30 days';

-- Update profile status
UPDATE profiles
SET membership_status = 'rejected'
WHERE user_id = 'user-uuid-here';
```

**Option B: Cancel Pending Application (coach/admin decision)**
```sql
-- Cancel with reason
UPDATE membership_applications
SET 
  status = 'rejected',
  rejection_reason = 'ยกเลิกตามคำขอของผู้สมัคร',
  reviewed_by = 'admin-or-coach-uuid',
  reviewed_at = NOW(),
  updated_at = NOW()
WHERE id = 'application-uuid-here';

-- Update profile
UPDATE profiles
SET membership_status = 'rejected'
WHERE user_id = 'user-uuid-here';
```

**Prevention:**
- Run `expire_old_applications()` function daily
- Set up automated reminders for coaches
- Add UI to show pending application status to users

---

### Issue 4: Athlete Has No Club or Coach Assignment

**Symptoms:**
- Athlete can access dashboard
- Profile shows `club_id = NULL` or `coach_id = NULL`
- Cannot see training sessions or club information

**Root Cause:**
- Application approved but profile not updated with club/coach
- Migration from old system incomplete
- Bug in approval workflow

**Diagnosis:**
```sql
-- Find active athletes without club/coach
SELECT 
  p.user_id,
  p.email,
  p.membership_status,
  p.club_id,
  p.coach_id,
  ma.club_id as application_club_id,
  ma.assigned_coach_id as application_coach_id
FROM profiles p
LEFT JOIN membership_applications ma ON ma.user_id = p.user_id AND ma.status = 'approved'
WHERE p.role = 'athlete'
  AND p.membership_status = 'active'
  AND (p.club_id IS NULL OR p.coach_id IS NULL);
```

**Solution:**
```sql
-- Fix from approved application data
UPDATE profiles p
SET 
  club_id = ma.club_id,
  coach_id = ma.assigned_coach_id
FROM membership_applications ma
WHERE p.user_id = ma.user_id
  AND ma.status = 'approved'
  AND p.role = 'athlete'
  AND (p.club_id IS NULL OR p.coach_id IS NULL);
```

**Prevention:**
- Ensure approval workflow updates all fields atomically
- Add CHECK constraint: `active` status requires `club_id`
- Add database trigger to validate on status change

---


### Issue 5: Application Stuck in Pending Forever

**Symptoms:**
- Application submitted weeks/months ago
- Still shows as 'pending'
- No coach action taken

**Root Cause:**
- Coach not notified of new application
- Coach doesn't have access to review interface
- Application expiry not running

**Diagnosis:**
```sql
-- Find old pending applications
SELECT 
  ma.id,
  ma.user_id,
  p.email as applicant_email,
  ma.club_id,
  c.name as club_name,
  ma.created_at,
  EXTRACT(DAY FROM NOW() - ma.created_at) as days_pending,
  coach_p.email as coach_email
FROM membership_applications ma
JOIN profiles p ON p.user_id = ma.user_id
LEFT JOIN clubs c ON c.id = ma.club_id
LEFT JOIN profiles coach_p ON coach_p.club_id = ma.club_id AND coach_p.role = 'coach'
WHERE ma.status = 'pending'
  AND ma.created_at < NOW() - INTERVAL '7 days'
ORDER BY ma.created_at ASC;
```

**Solutions:**

**Option A: Notify Coach**
```typescript
// Send notification to coach
const coaches = await getCoachesForClub(application.club_id);
for (const coach of coaches) {
  await sendEmail({
    to: coach.email,
    subject: 'คำขอสมัครรอการอนุมัติ',
    body: `มีคำขอสมัครใหม่รอการพิจารณา...`
  });
}
```

**Option B: Auto-expire (if > 30 days)**
```sql
-- Run expiry function
SELECT * FROM expire_old_applications();
```

**Option C: Manual Review**
```sql
-- Approve manually (as admin)
UPDATE membership_applications
SET 
  status = 'approved',
  reviewed_by = 'admin-uuid',
  reviewed_at = NOW(),
  assigned_coach_id = 'coach-uuid'
WHERE id = 'application-uuid-here';

-- Update profile
UPDATE profiles
SET 
  membership_status = 'active',
  club_id = 'club-uuid',
  coach_id = 'coach-uuid'
WHERE user_id = 'user-uuid-here';
```

**Prevention:**
- Set up daily cron job for `expire_old_applications()`
- Implement email notifications for new applications
- Add reminder emails 7 days before expiry
- Create admin dashboard to monitor pending applications

---

## Data Inconsistency Issues

### Issue 6: Orphaned Athlete Records

**Symptoms:**
- Athlete exists in `athletes` table
- No corresponding `membership_applications` record
- Cannot track approval history

**Diagnosis:**
```sql
-- Find orphaned athletes
SELECT 
  a.id as athlete_id,
  a.user_id,
  a.email,
  a.first_name,
  a.last_name,
  a.club_id,
  c.name as club_name,
  ma.id as application_id
FROM athletes a
LEFT JOIN clubs c ON c.id = a.club_id
LEFT JOIN membership_applications ma ON ma.user_id = a.user_id
WHERE ma.id IS NULL;
```

**Solution:**
```sql
-- Create retroactive applications for orphaned athletes
INSERT INTO membership_applications (
  user_id,
  club_id,
  status,
  created_at,
  reviewed_at,
  reviewed_by,
  assigned_coach_id,
  personal_info,
  activity_log
)
SELECT 
  a.user_id,
  a.club_id,
  'approved',
  a.created_at,
  a.created_at,
  (SELECT user_id FROM profiles WHERE club_id = a.club_id AND role = 'coach' LIMIT 1),
  (SELECT user_id FROM profiles WHERE club_id = a.club_id AND role = 'coach' LIMIT 1),
  jsonb_build_object(
    'full_name', CONCAT(a.first_name, ' ', a.last_name),
    'email', a.email,
    'note', 'Retroactively created for legacy athlete'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'action', 'approved',
      'timestamp', a.created_at,
      'note', 'Legacy data migration'
    )
  )
FROM athletes a
LEFT JOIN membership_applications ma ON ma.user_id = a.user_id
WHERE ma.id IS NULL;

-- Update profiles
UPDATE profiles p
SET 
  membership_status = 'active',
  club_id = a.club_id
FROM athletes a
WHERE p.user_id = a.user_id
  AND p.role = 'athlete';
```

**Prevention:**
- Always create application before athlete record
- Add foreign key constraint if possible
- Use database triggers to enforce relationship

---

### Issue 7: Status Mismatch Between Tables

**Symptoms:**
- `profiles.membership_status` doesn't match `membership_applications.status`
- Example: profile is 'active' but application is 'pending'

**Diagnosis:**
```sql
-- Find all status mismatches
SELECT 
  p.user_id,
  p.email,
  p.membership_status as profile_status,
  ma.status as application_status,
  ma.id as application_id,
  ma.created_at,
  ma.reviewed_at
FROM profiles p
JOIN membership_applications ma ON ma.user_id = p.user_id
WHERE p.role = 'athlete'
  AND (
    (p.membership_status = 'pending' AND ma.status != 'pending') OR
    (p.membership_status = 'active' AND ma.status != 'approved') OR
    (p.membership_status = 'rejected' AND ma.status != 'rejected')
  );
```

**Solution:**
```sql
-- Sync profile status from application status (application is source of truth)
UPDATE profiles p
SET membership_status = CASE 
  WHEN ma.status = 'pending' THEN 'pending'::membership_status
  WHEN ma.status = 'approved' THEN 'active'::membership_status
  WHEN ma.status = 'rejected' THEN 'rejected'::membership_status
  ELSE p.membership_status
END
FROM membership_applications ma
WHERE p.user_id = ma.user_id
  AND p.role = 'athlete'
  AND (
    (p.membership_status = 'pending' AND ma.status != 'pending') OR
    (p.membership_status = 'active' AND ma.status != 'approved') OR
    (p.membership_status = 'rejected' AND ma.status != 'rejected')
  );
```

**Prevention:**
- Use database transactions for all status updates
- Add trigger to sync statuses automatically
- Implement application-level validation

---


## Access Control Issues

### Issue 8: Pending Athlete Can Access Dashboard

**Symptoms:**
- Athlete with 'pending' status can access `/dashboard/athlete`
- Should be redirected to `/pending-approval`
- Middleware not blocking access

**Root Cause:**
- Middleware not checking `membership_status`
- Access control logic inconsistent
- Caching issue with profile data

**Diagnosis:**
```sql
-- Check athlete's current status
SELECT 
  p.user_id,
  p.email,
  p.role,
  p.membership_status,
  ma.status as application_status
FROM profiles p
LEFT JOIN membership_applications ma ON ma.user_id = p.user_id
WHERE p.email = 'athlete@example.com';
```

**Solution:**

**Check Middleware Logic:**
```typescript
// lib/supabase/middleware.ts
// Ensure this logic exists:
if (profile.role === 'athlete' && profile.membership_status !== 'active') {
  return NextResponse.redirect(new URL('/pending-approval', request.url));
}
```

**Clear Cache:**
```typescript
// Force profile refresh
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', user.id)
  .single();
```

**Prevention:**
- Add integration tests for access control
- Implement consistent caching strategy
- Use single source of truth for status checks

---

### Issue 9: Coach Sees Applications from Other Clubs

**Symptoms:**
- Coach sees applications they shouldn't have access to
- RLS policies not working correctly
- Security vulnerability

**Root Cause:**
- RLS policy misconfigured
- Coach has multiple club assignments
- Admin role bypassing RLS

**Diagnosis:**
```sql
-- Check coach's club assignment
SELECT 
  p.user_id,
  p.email,
  p.role,
  p.club_id,
  c.name as club_name
FROM profiles p
LEFT JOIN clubs c ON c.id = p.club_id
WHERE p.email = 'coach@example.com';

-- Check what applications they can see
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims.sub = 'coach-user-id-here';

SELECT 
  ma.id,
  ma.club_id,
  c.name as club_name,
  ma.status
FROM membership_applications ma
LEFT JOIN clubs c ON c.id = ma.club_id;

RESET ROLE;
```

**Solution:**

**Verify RLS Policy:**
```sql
-- Check existing policy
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'membership_applications'
  AND policyname LIKE '%coach%';

-- Recreate policy if needed
DROP POLICY IF EXISTS "coach_view_own_club_applications" ON membership_applications;

CREATE POLICY "coach_view_own_club_applications"
ON membership_applications FOR SELECT
TO authenticated
USING (
  club_id IN (
    SELECT club_id FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'coach'
  )
);
```

**Prevention:**
- Test RLS policies with different user roles
- Add automated RLS policy tests
- Regular security audits

---

### Issue 10: Admin Cannot Override Coach Decisions

**Symptoms:**
- Admin tries to approve/reject application
- Permission denied or no effect
- Admin should have full access

**Root Cause:**
- RLS policy too restrictive for admins
- Admin role not properly configured
- Missing admin override policy

**Diagnosis:**
```sql
-- Check admin's role
SELECT user_id, email, role
FROM profiles
WHERE email = 'admin@example.com';

-- Check admin RLS policies
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'membership_applications'
  AND policyname LIKE '%admin%';
```

**Solution:**
```sql
-- Add admin override policy
CREATE POLICY "admin_full_access_applications"
ON membership_applications FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);
```

**Prevention:**
- Always include admin override policies
- Test admin access separately
- Document admin capabilities

---

## Application Workflow Issues

### Issue 11: Application Approval Fails Silently

**Symptoms:**
- Coach clicks "Approve" button
- No error message shown
- Application remains in 'pending' status

**Root Cause:**
- Database transaction failed
- Missing required fields
- RLS policy blocking update
- Network error not handled

**Diagnosis:**

**Check Browser Console:**
```javascript
// Look for errors in browser console
// Check Network tab for failed requests
```

**Check Database Logs:**
```sql
-- Check recent failed updates
SELECT 
  query,
  state,
  wait_event_type,
  wait_event
FROM pg_stat_activity
WHERE state = 'idle in transaction (aborted)'
  AND query LIKE '%membership_applications%';
```

**Test Manually:**
```sql
-- Try manual update as coach
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims.sub = 'coach-user-id-here';

UPDATE membership_applications
SET 
  status = 'approved',
  reviewed_by = 'coach-user-id-here',
  reviewed_at = NOW()
WHERE id = 'application-uuid-here';

RESET ROLE;
```

**Solution:**

**Add Error Handling:**
```typescript
// lib/membership/actions.ts
export async function reviewApplication(
  applicationId: string,
  action: 'approve' | 'reject',
  reason?: string
) {
  try {
    // ... approval logic ...
    
    if (error) {
      console.error('Approval error:', error);
      return { 
        success: false, 
        error: `Failed to ${action}: ${error.message}` 
      };
    }
    
    return { success: true };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { 
      success: false, 
      error: 'เกิดข้อผิดพลาดที่ไม่คาดคิด' 
    };
  }
}
```

**Prevention:**
- Add comprehensive error handling
- Log all errors to monitoring service
- Show user-friendly error messages
- Add retry logic for transient failures

---


### Issue 12: Rejection Reason Not Saved

**Symptoms:**
- Coach rejects application with reason
- Rejection recorded but reason is NULL
- Athlete doesn't see why they were rejected

**Root Cause:**
- Frontend not sending `rejection_reason` field
- Backend validation not enforcing required field
- Database column allows NULL

**Diagnosis:**
```sql
-- Find rejections without reasons
SELECT 
  ma.id,
  ma.user_id,
  p.email,
  ma.status,
  ma.rejection_reason,
  ma.reviewed_at,
  ma.reviewed_by
FROM membership_applications ma
JOIN profiles p ON p.user_id = ma.user_id
WHERE ma.status = 'rejected'
  AND (ma.rejection_reason IS NULL OR ma.rejection_reason = '');
```

**Solution:**

**Add Validation:**
```typescript
// lib/membership/actions.ts
export async function reviewApplication(
  applicationId: string,
  action: 'approve' | 'reject',
  reason?: string
) {
  if (action === 'reject' && (!reason || reason.trim() === '')) {
    return {
      success: false,
      error: 'กรุณาระบุเหตุผลในการปฏิเสธ'
    };
  }
  
  // ... rest of logic
}
```

**Fix Existing Data:**
```sql
-- Update rejections without reasons
UPDATE membership_applications
SET rejection_reason = 'ไม่ระบุเหตุผล'
WHERE status = 'rejected'
  AND (rejection_reason IS NULL OR rejection_reason = '');
```

**Prevention:**
- Add NOT NULL constraint with CHECK
- Validate on frontend before submission
- Add database trigger to enforce

---

### Issue 13: Multiple Approvals for Same Application

**Symptoms:**
- Application approved multiple times
- Multiple activity log entries
- Data inconsistency

**Root Cause:**
- No idempotency check
- Race condition with multiple coaches
- Button not disabled after click

**Diagnosis:**
```sql
-- Check application history
SELECT 
  ma.id,
  ma.status,
  ma.reviewed_at,
  ma.reviewed_by,
  ma.activity_log
FROM membership_applications ma
WHERE ma.id = 'application-uuid-here';
```

**Solution:**

**Add Idempotency Check:**
```typescript
// lib/membership/actions.ts
export async function reviewApplication(
  applicationId: string,
  action: 'approve' | 'reject',
  reason?: string
) {
  // Check current status
  const { data: application } = await supabase
    .from('membership_applications')
    .select('status')
    .eq('id', applicationId)
    .single();
  
  if (application.status !== 'pending') {
    return {
      success: false,
      error: 'คำขอนี้ได้รับการพิจารณาแล้ว'
    };
  }
  
  // ... rest of logic with optimistic locking
}
```

**Add Optimistic Locking:**
```sql
-- Update with version check
UPDATE membership_applications
SET 
  status = 'approved',
  reviewed_at = NOW(),
  updated_at = NOW()
WHERE id = 'application-uuid-here'
  AND status = 'pending'  -- Only update if still pending
RETURNING *;
```

**Prevention:**
- Disable button after click
- Add optimistic locking
- Use database constraints

---

## Diagnostic Queries

### Quick Health Check

```sql
-- Overall system health
SELECT 
  'Total Athletes' as metric,
  COUNT(*) as count
FROM profiles
WHERE role = 'athlete'

UNION ALL

SELECT 
  'Active Athletes',
  COUNT(*)
FROM profiles
WHERE role = 'athlete' AND membership_status = 'active'

UNION ALL

SELECT 
  'Pending Athletes',
  COUNT(*)
FROM profiles
WHERE role = 'athlete' AND membership_status = 'pending'

UNION ALL

SELECT 
  'Total Applications',
  COUNT(*)
FROM membership_applications

UNION ALL

SELECT 
  'Pending Applications',
  COUNT(*)
FROM membership_applications
WHERE status = 'pending'

UNION ALL

SELECT 
  'Approved Applications',
  COUNT(*)
FROM membership_applications
WHERE status = 'approved'

UNION ALL

SELECT 
  'Rejected Applications',
  COUNT(*)
FROM membership_applications
WHERE status = 'rejected';
```

### Data Consistency Check

```sql
-- Find all inconsistencies
WITH inconsistencies AS (
  -- Orphaned athletes
  SELECT 
    'orphaned_athlete' as issue_type,
    a.user_id,
    a.email,
    'Athlete without application' as description
  FROM athletes a
  LEFT JOIN membership_applications ma ON ma.user_id = a.user_id
  WHERE ma.id IS NULL
  
  UNION ALL
  
  -- Status mismatches
  SELECT 
    'status_mismatch',
    p.user_id,
    p.email,
    CONCAT('Profile: ', p.membership_status, ', App: ', ma.status)
  FROM profiles p
  JOIN membership_applications ma ON ma.user_id = p.user_id
  WHERE p.role = 'athlete'
    AND (
      (p.membership_status = 'active' AND ma.status != 'approved') OR
      (p.membership_status = 'pending' AND ma.status != 'pending') OR
      (p.membership_status = 'rejected' AND ma.status != 'rejected')
    )
  
  UNION ALL
  
  -- Missing club assignments
  SELECT 
    'missing_club',
    p.user_id,
    p.email,
    'Active athlete without club_id'
  FROM profiles p
  WHERE p.role = 'athlete'
    AND p.membership_status = 'active'
    AND p.club_id IS NULL
  
  UNION ALL
  
  -- Missing coach assignments
  SELECT 
    'missing_coach',
    p.user_id,
    p.email,
    'Active athlete without coach_id'
  FROM profiles p
  WHERE p.role = 'athlete'
    AND p.membership_status = 'active'
    AND p.coach_id IS NULL
)
SELECT 
  issue_type,
  COUNT(*) as count,
  STRING_AGG(email, ', ') as affected_users
FROM inconsistencies
GROUP BY issue_type
ORDER BY count DESC;
```

### Application Pipeline Analysis

```sql
-- Analyze application flow
SELECT 
  ma.status,
  COUNT(*) as total,
  AVG(EXTRACT(DAY FROM COALESCE(ma.reviewed_at, NOW()) - ma.created_at)) as avg_days_to_review,
  MIN(ma.created_at) as oldest_application,
  MAX(ma.created_at) as newest_application
FROM membership_applications ma
GROUP BY ma.status
ORDER BY 
  CASE ma.status
    WHEN 'pending' THEN 1
    WHEN 'approved' THEN 2
    WHEN 'rejected' THEN 3
  END;
```

### Coach Workload Analysis

```sql
-- See which coaches have pending applications
SELECT 
  c.id as club_id,
  c.name as club_name,
  COUNT(DISTINCT coach_p.user_id) as coach_count,
  COUNT(ma.id) as pending_applications,
  STRING_AGG(DISTINCT coach_p.email, ', ') as coaches
FROM clubs c
LEFT JOIN profiles coach_p ON coach_p.club_id = c.id AND coach_p.role = 'coach'
LEFT JOIN membership_applications ma ON ma.club_id = c.id AND ma.status = 'pending'
GROUP BY c.id, c.name
HAVING COUNT(ma.id) > 0
ORDER BY pending_applications DESC;
```

### Old Pending Applications

```sql
-- Find applications that should be expired
SELECT 
  ma.id,
  ma.user_id,
  p.email,
  ma.club_id,
  c.name as club_name,
  ma.created_at,
  EXTRACT(DAY FROM NOW() - ma.created_at) as days_pending,
  CASE 
    WHEN EXTRACT(DAY FROM NOW() - ma.created_at) > 30 THEN 'Should be expired'
    WHEN EXTRACT(DAY FROM NOW() - ma.created_at) > 23 THEN 'Expiring soon (< 7 days)'
    ELSE 'OK'
  END as status
FROM membership_applications ma
JOIN profiles p ON p.user_id = ma.user_id
LEFT JOIN clubs c ON c.id = ma.club_id
WHERE ma.status = 'pending'
ORDER BY ma.created_at ASC;
```

---


## Recovery Procedures

### Procedure 1: Complete System Data Integrity Fix

**When to Use:**
- After discovering multiple data inconsistencies
- After system migration or upgrade
- As part of regular maintenance

**Steps:**

1. **Backup Current State**
```bash
# Export current data
./scripts/run-sql-via-api.sh scripts/backup-membership-data.sql > backup-$(date +%Y%m%d).sql
```

2. **Run Diagnostic**
```bash
./scripts/run-sql-via-api.sh scripts/36-diagnose-membership-consistency.sql
```

3. **Fix Orphaned Athletes**
```bash
./scripts/run-sql-via-api.sh scripts/37-fix-orphaned-athletes.sql
```

4. **Fix Approved Applications Without Profiles**
```bash
./scripts/run-sql-via-api.sh scripts/38-fix-approved-without-profile.sql
```

5. **Sync Membership Status**
```bash
./scripts/run-sql-via-api.sh scripts/39-sync-membership-status.sql
```

6. **Add Constraints**
```bash
./scripts/run-sql-via-api.sh scripts/40-add-membership-constraints.sql
```

7. **Verify Fixes**
```bash
./scripts/run-sql-via-api.sh scripts/verify-membership-migration.sql
```

8. **Test Application Flow**
- Submit new application as athlete
- Approve as coach
- Verify athlete can access dashboard
- Check all data is consistent

---

### Procedure 2: Emergency Access Grant

**When to Use:**
- Athlete approved but cannot access system
- Urgent need to grant access
- Bypass normal workflow temporarily

**Steps:**

1. **Verify Identity**
```sql
-- Confirm user identity
SELECT user_id, email, role, membership_status
FROM profiles
WHERE email = 'athlete@example.com';
```

2. **Check Application Status**
```sql
-- Find their application
SELECT id, status, club_id, created_at
FROM membership_applications
WHERE user_id = 'user-uuid-here'
ORDER BY created_at DESC
LIMIT 1;
```

3. **Grant Emergency Access**
```sql
BEGIN;

-- Update application if exists
UPDATE membership_applications
SET 
  status = 'approved',
  reviewed_by = 'admin-uuid',
  reviewed_at = NOW(),
  assigned_coach_id = 'coach-uuid',
  activity_log = activity_log || jsonb_build_array(
    jsonb_build_object(
      'action', 'emergency_approval',
      'timestamp', NOW(),
      'by', 'admin-uuid',
      'note', 'Emergency access granted'
    )
  )
WHERE user_id = 'user-uuid-here'
  AND id = 'application-uuid-here';

-- Update profile
UPDATE profiles
SET 
  membership_status = 'active',
  club_id = 'club-uuid',
  coach_id = 'coach-uuid'
WHERE user_id = 'user-uuid-here';

-- Create athlete record if missing
INSERT INTO athletes (user_id, club_id, email, first_name, last_name)
SELECT 
  user_id,
  'club-uuid',
  email,
  first_name,
  last_name
FROM profiles
WHERE user_id = 'user-uuid-here'
ON CONFLICT (user_id, club_id) DO NOTHING;

COMMIT;
```

4. **Notify User**
```typescript
await sendEmail({
  to: 'athlete@example.com',
  subject: 'การเข้าถึงระบบได้รับการอนุมัติแล้ว',
  body: 'คุณสามารถเข้าใช้งานระบบได้แล้ว...'
});
```

5. **Document Action**
```sql
-- Log in audit table
INSERT INTO audit_logs (
  user_id,
  action,
  details,
  performed_by
) VALUES (
  'user-uuid-here',
  'emergency_access_grant',
  jsonb_build_object(
    'reason', 'Urgent access needed',
    'application_id', 'application-uuid-here'
  ),
  'admin-uuid'
);
```

---

### Procedure 3: Bulk Application Expiry

**When to Use:**
- Many old pending applications
- Cleanup before system migration
- Regular maintenance

**Steps:**

1. **Preview Affected Applications**
```sql
-- See what will be expired
SELECT 
  ma.id,
  p.email,
  c.name as club_name,
  ma.created_at,
  EXTRACT(DAY FROM NOW() - ma.created_at) as days_pending
FROM membership_applications ma
JOIN profiles p ON p.user_id = ma.user_id
LEFT JOIN clubs c ON c.id = ma.club_id
WHERE ma.status = 'pending'
  AND ma.created_at < NOW() - INTERVAL '30 days'
ORDER BY ma.created_at ASC;
```

2. **Notify Affected Users (Optional)**
```typescript
const oldApplications = await getOldPendingApplications();
for (const app of oldApplications) {
  await sendEmail({
    to: app.email,
    subject: 'คำขอสมัครของคุณกำลังจะหมดอายุ',
    body: 'คำขอสมัครของคุณจะหมดอายุใน 7 วัน...'
  });
}
```

3. **Run Expiry Function**
```sql
-- Expire old applications
SELECT * FROM expire_old_applications();
```

4. **Verify Results**
```sql
-- Check expired count
SELECT 
  COUNT(*) as expired_count,
  MIN(reviewed_at) as first_expired,
  MAX(reviewed_at) as last_expired
FROM membership_applications
WHERE status = 'rejected'
  AND rejection_reason LIKE '%หมดอายุ%'
  AND reviewed_at > NOW() - INTERVAL '1 hour';
```

5. **Notify Coaches**
```typescript
await sendEmail({
  to: 'coaches@club.com',
  subject: 'คำขอสมัครที่หมดอายุ',
  body: `มีคำขอสมัคร ${expiredCount} รายการที่หมดอายุ...`
});
```

---

### Procedure 4: Reset User Application Status

**When to Use:**
- User wants to reapply after rejection
- Application stuck in bad state
- Testing purposes

**Steps:**

1. **Verify Current State**
```sql
-- Check user's current applications
SELECT 
  ma.id,
  ma.status,
  ma.created_at,
  ma.reviewed_at,
  ma.rejection_reason
FROM membership_applications ma
WHERE ma.user_id = 'user-uuid-here'
ORDER BY ma.created_at DESC;
```

2. **Archive Old Application (Don't Delete)**
```sql
-- Mark as archived instead of deleting
UPDATE membership_applications
SET 
  status = 'rejected',
  rejection_reason = COALESCE(rejection_reason, 'Reset for reapplication'),
  activity_log = activity_log || jsonb_build_array(
    jsonb_build_object(
      'action', 'archived',
      'timestamp', NOW(),
      'note', 'Archived to allow reapplication'
    )
  )
WHERE user_id = 'user-uuid-here'
  AND status IN ('pending', 'rejected');
```

3. **Reset Profile Status**
```sql
-- Allow user to reapply
UPDATE profiles
SET 
  membership_status = 'rejected',
  club_id = NULL,
  coach_id = NULL
WHERE user_id = 'user-uuid-here';
```

4. **Verify User Can Reapply**
```sql
-- Check duplicate prevention
SELECT * FROM check_duplicate_pending_application('user-uuid-here');
-- Should return has_pending = false
```

5. **Notify User**
```typescript
await sendEmail({
  to: 'user@example.com',
  subject: 'คุณสามารถสมัครใหม่ได้แล้ว',
  body: 'สถานะของคุณได้รับการรีเซ็ตแล้ว...'
});
```

---

### Procedure 5: Fix Coach-Club Assignment

**When to Use:**
- Coach cannot see applications
- Coach assigned to wrong club
- New coach needs access

**Steps:**

1. **Verify Current Assignment**
```sql
-- Check coach's current club
SELECT 
  p.user_id,
  p.email,
  p.role,
  p.club_id,
  c.name as current_club
FROM profiles p
LEFT JOIN clubs c ON c.id = p.club_id
WHERE p.email = 'coach@example.com';
```

2. **Check Target Club**
```sql
-- Verify target club exists
SELECT id, name, sport_type
FROM clubs
WHERE id = 'target-club-uuid';
```

3. **Update Assignment**
```sql
BEGIN;

-- Update coach's club
UPDATE profiles
SET club_id = 'target-club-uuid'
WHERE user_id = 'coach-uuid'
  AND role = 'coach';

-- Update any existing applications they reviewed
UPDATE membership_applications
SET assigned_coach_id = 'coach-uuid'
WHERE club_id = 'target-club-uuid'
  AND status = 'approved'
  AND assigned_coach_id IS NULL;

COMMIT;
```

4. **Verify Access**
```sql
-- Check what applications coach can now see
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims.sub = 'coach-uuid';

SELECT 
  ma.id,
  ma.status,
  c.name as club_name
FROM membership_applications ma
LEFT JOIN clubs c ON c.id = ma.club_id;

RESET ROLE;
```

5. **Test in UI**
- Log in as coach
- Navigate to applications page
- Verify correct applications visible
- Test approval workflow

---


## Prevention Best Practices

### 1. Database Constraints

**Add Essential Constraints:**

```sql
-- Ensure active athletes have club assignment
ALTER TABLE profiles
ADD CONSTRAINT check_active_has_club
CHECK (
  role != 'athlete' OR 
  membership_status != 'active' OR 
  club_id IS NOT NULL
);

-- Ensure rejection has reason
ALTER TABLE membership_applications
ADD CONSTRAINT check_rejection_has_reason
CHECK (
  status != 'rejected' OR 
  (rejection_reason IS NOT NULL AND rejection_reason != '')
);

-- Ensure reviewed applications have reviewer
ALTER TABLE membership_applications
ADD CONSTRAINT check_reviewed_has_reviewer
CHECK (
  status = 'pending' OR 
  (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL)
);
```

### 2. Database Triggers

**Auto-sync Status:**

```sql
-- Trigger to sync profile status when application status changes
CREATE OR REPLACE FUNCTION sync_membership_status()
RETURNS TRIGGER AS $
BEGIN
  IF NEW.status != OLD.status THEN
    UPDATE profiles
    SET 
      membership_status = CASE 
        WHEN NEW.status = 'pending' THEN 'pending'::membership_status
        WHEN NEW.status = 'approved' THEN 'active'::membership_status
        WHEN NEW.status = 'rejected' THEN 'rejected'::membership_status
      END,
      club_id = CASE 
        WHEN NEW.status = 'approved' THEN NEW.club_id
        ELSE club_id
      END,
      coach_id = CASE 
        WHEN NEW.status = 'approved' THEN NEW.assigned_coach_id
        ELSE coach_id
      END
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER sync_membership_status_trigger
AFTER UPDATE ON membership_applications
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION sync_membership_status();
```

**Prevent Status Regression:**

```sql
-- Prevent changing approved back to pending
CREATE OR REPLACE FUNCTION prevent_status_regression()
RETURNS TRIGGER AS $
BEGIN
  IF OLD.status = 'approved' AND NEW.status = 'pending' THEN
    RAISE EXCEPTION 'Cannot change approved application back to pending';
  END IF;
  
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_status_regression_trigger
BEFORE UPDATE ON membership_applications
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION prevent_status_regression();
```

### 3. Application-Level Validation

**Comprehensive Validation:**

```typescript
// lib/membership/validation.ts

export function validateApplicationSubmission(data: ApplicationData): ValidationResult {
  const errors: string[] = [];
  
  // Required fields
  if (!data.club_id) errors.push('กรุณาเลือกชมรม');
  if (!data.personal_info?.full_name) errors.push('กรุณาระบุชื่อ-นามสกุล');
  if (!data.personal_info?.phone_number) errors.push('กรุณาระบุเบอร์โทรศัพท์');
  
  // Phone number format
  if (data.personal_info?.phone_number && 
      !/^0\d{9}$/.test(data.personal_info.phone_number)) {
    errors.push('เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็น 10 หลัก)');
  }
  
  // Age validation
  if (data.personal_info?.date_of_birth) {
    const age = calculateAge(data.personal_info.date_of_birth);
    if (age < 6) errors.push('อายุต้องมากกว่า 6 ปี');
    if (age > 100) errors.push('วันเกิดไม่ถูกต้อง');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateApplicationReview(
  action: 'approve' | 'reject',
  reason?: string
): ValidationResult {
  const errors: string[] = [];
  
  if (action === 'reject') {
    if (!reason || reason.trim() === '') {
      errors.push('กรุณาระบุเหตุผลในการปฏิเสธ');
    } else if (reason.length < 10) {
      errors.push('เหตุผลต้องมีความยาวอย่างน้อย 10 ตัวอักษร');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

### 4. Automated Testing

**Integration Tests:**

```typescript
// tests/membership-workflow.test.ts

describe('Membership Workflow', () => {
  it('should maintain data consistency through approval flow', async () => {
    // Submit application
    const { applicationId } = await submitApplication(testData);
    
    // Verify profile status is pending
    const profile = await getProfile(testUserId);
    expect(profile.membership_status).toBe('pending');
    
    // Approve application
    await reviewApplication(applicationId, 'approve');
    
    // Verify all fields updated atomically
    const updatedProfile = await getProfile(testUserId);
    expect(updatedProfile.membership_status).toBe('active');
    expect(updatedProfile.club_id).toBe(testClubId);
    expect(updatedProfile.coach_id).toBe(testCoachId);
    
    const application = await getApplication(applicationId);
    expect(application.status).toBe('approved');
    expect(application.reviewed_by).toBe(testCoachId);
  });
  
  it('should prevent duplicate pending applications', async () => {
    // Submit first application
    await submitApplication(testData);
    
    // Try to submit second application
    const result = await submitApplication(testData);
    expect(result.error).toContain('มีคำขอรออนุมัติอยู่แล้ว');
  });
});
```

### 5. Monitoring and Alerts

**Set Up Monitoring:**

```sql
-- Create monitoring view
CREATE OR REPLACE VIEW membership_health_metrics AS
SELECT 
  (SELECT COUNT(*) FROM membership_applications WHERE status = 'pending') as pending_count,
  (SELECT COUNT(*) FROM membership_applications WHERE status = 'pending' 
   AND created_at < NOW() - INTERVAL '7 days') as old_pending_count,
  (SELECT COUNT(*) FROM profiles WHERE role = 'athlete' 
   AND membership_status = 'active' AND club_id IS NULL) as active_without_club,
  (SELECT COUNT(*) FROM profiles p 
   LEFT JOIN membership_applications ma ON ma.user_id = p.user_id
   WHERE p.role = 'athlete' AND ma.id IS NULL) as athletes_without_application;
```

**Alert Conditions:**

```typescript
// monitoring/membership-alerts.ts

export async function checkMembershipHealth() {
  const { data: metrics } = await supabase
    .from('membership_health_metrics')
    .select('*')
    .single();
  
  const alerts: Alert[] = [];
  
  if (metrics.old_pending_count > 5) {
    alerts.push({
      severity: 'warning',
      message: `${metrics.old_pending_count} applications pending > 7 days`,
      action: 'Review old applications or run expiry function'
    });
  }
  
  if (metrics.active_without_club > 0) {
    alerts.push({
      severity: 'error',
      message: `${metrics.active_without_club} active athletes without club`,
      action: 'Run data integrity fix'
    });
  }
  
  if (metrics.athletes_without_application > 0) {
    alerts.push({
      severity: 'error',
      message: `${metrics.athletes_without_application} orphaned athletes`,
      action: 'Run migration script 37'
    });
  }
  
  return alerts;
}
```

### 6. Regular Maintenance Tasks

**Daily Tasks:**

```bash
#!/bin/bash
# scripts/daily-membership-maintenance.sh

# Expire old applications
echo "Expiring old applications..."
./scripts/run-sql-via-api.sh scripts/expire-old-applications.sql

# Check data consistency
echo "Checking data consistency..."
./scripts/run-sql-via-api.sh scripts/36-diagnose-membership-consistency.sql

# Generate health report
echo "Generating health report..."
./scripts/run-sql-via-api.sh scripts/membership-health-report.sql
```

**Weekly Tasks:**

```bash
#!/bin/bash
# scripts/weekly-membership-maintenance.sh

# Full data integrity check
echo "Running full integrity check..."
./scripts/run-sql-via-api.sh scripts/verify-membership-migration.sql

# Analyze application pipeline
echo "Analyzing application pipeline..."
./scripts/run-sql-via-api.sh scripts/analyze-application-pipeline.sql

# Send summary to admins
echo "Sending weekly summary..."
node scripts/send-weekly-summary.js
```

### 7. Documentation Standards

**Always Document:**

1. **Schema Changes**
   - Migration script number
   - Columns added/modified
   - Indexes created
   - Constraints added

2. **Business Logic Changes**
   - What changed and why
   - Impact on existing data
   - Migration path for old data

3. **Bug Fixes**
   - Root cause analysis
   - Fix applied
   - Prevention measures
   - Test cases added

4. **Configuration Changes**
   - What was changed
   - Why it was changed
   - How to revert if needed

---

## Quick Reference

### Common Commands

```bash
# Run diagnostic
./scripts/run-sql-via-api.sh scripts/36-diagnose-membership-consistency.sql

# Fix data integrity
./scripts/run-sql-via-api.sh scripts/37-fix-orphaned-athletes.sql
./scripts/run-sql-via-api.sh scripts/38-fix-approved-without-profile.sql
./scripts/run-sql-via-api.sh scripts/39-sync-membership-status.sql

# Expire old applications
psql -c "SELECT * FROM expire_old_applications();"

# Check for duplicates
psql -c "SELECT * FROM check_duplicate_pending_application('user-uuid');"

# Verify helper functions
./scripts/run-sql-via-api.sh scripts/quick-verify-helper-functions.sql
```

### Emergency Contacts

- **Database Issues:** DBA team
- **Application Bugs:** Development team
- **User Access Issues:** Support team
- **Security Concerns:** Security team

### Related Documentation

- [Membership Approval System](./MEMBERSHIP_APPROVAL_SYSTEM.md)
- [Membership Diagnostic Report](./MEMBERSHIP_DIAGNOSTIC_REPORT.md)
- [Membership Helper Functions](./MEMBERSHIP_HELPER_FUNCTIONS.md)
- [Migration Guide](../scripts/MIGRATION_GUIDE.md)

---

## Changelog

### 2024-11-23
- Initial creation
- Added 13 common issues with solutions
- Added 5 recovery procedures
- Added diagnostic queries
- Added prevention best practices

---

**Need Help?**

If you encounter an issue not covered in this guide:

1. Check the [Membership Approval System](./MEMBERSHIP_APPROVAL_SYSTEM.md) documentation
2. Run the diagnostic script to identify the issue
3. Search this guide for similar symptoms
4. Contact the development team with diagnostic results

**Remember:** Always backup data before running recovery procedures!
