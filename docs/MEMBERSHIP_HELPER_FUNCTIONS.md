# Membership Helper Functions Documentation

## Overview
This document describes the helper functions created for the membership approval system. These functions support the business rules defined in the membership approval workflow.

## Functions

### 1. expire_old_applications()

**Purpose:** Automatically reject membership applications that have been pending for more than 30 days.

**Signature:**
```sql
expire_old_applications()
RETURNS TABLE(
  expired_count INTEGER,
  expired_application_ids UUID[]
)
```

**Business Rule:** BR3 - Application Expiry

**Behavior:**
1. Finds all applications with `status = 'pending'` and `created_at < NOW() - INTERVAL '30 days'`
2. Updates each application:
   - Sets `status = 'rejected'`
   - Sets `rejection_reason = 'คำขอหมดอายุ (เกิน 30 วัน) - Application expired (over 30 days)'`
   - Sets `reviewed_by` to system user UUID
   - Updates `updated_at` timestamp
3. Updates corresponding profiles:
   - Sets `membership_status = 'rejected'` for affected users
4. Logs activity for each expired application
5. Returns count and array of expired application IDs

**Usage Examples:**

```sql
-- Manual execution
SELECT * FROM expire_old_applications();

-- Expected output:
-- expired_count | expired_application_ids
-- --------------+------------------------
--             2 | {uuid1, uuid2}

-- Schedule via pg_cron (daily at 2 AM)
SELECT cron.schedule(
  'expire-old-applications',
  '0 2 * * *',
  'SELECT expire_old_applications()'
);
```

**Integration:**
```typescript
// In a scheduled job or admin action
const { data, error } = await supabase.rpc('expire_old_applications');
if (data && data[0].expired_count > 0) {
  console.log(`Expired ${data[0].expired_count} applications`);
  // Send notifications to affected users
}
```

---

### 2. check_duplicate_pending_application(user_id UUID)

**Purpose:** Check if a user already has a pending application for any club.

**Signature:**
```sql
check_duplicate_pending_application(p_user_id UUID)
RETURNS TABLE(
  has_pending BOOLEAN,
  pending_application_id UUID,
  pending_club_id UUID,
  pending_since TIMESTAMPTZ
)
```

**Business Rule:** BR1 - One Active Application Per User

**Behavior:**
1. Searches for applications with matching `user_id` and `status = 'pending'`
2. If found, returns:
   - `has_pending = TRUE`
   - Application details (ID, club_id, created_at)
3. If not found, returns:
   - `has_pending = FALSE`
   - NULL values for other fields

**Usage Examples:**

```sql
-- Check for specific user
SELECT * FROM check_duplicate_pending_application('user-uuid-here');

-- Expected output (if pending exists):
-- has_pending | pending_application_id | pending_club_id | pending_since
-- ------------+------------------------+-----------------+------------------
--        true | uuid                   | club-uuid       | 2024-11-01 10:00

-- Expected output (if no pending):
-- has_pending | pending_application_id | pending_club_id | pending_since
-- ------------+------------------------+-----------------+------------------
--       false | null                   | null            | null
```

**Integration:**
```typescript
// Before allowing new application submission
export async function submitMembershipApplication(userId: string, data: ApplicationData) {
  // Check for duplicate
  const { data: checkResult } = await supabase.rpc(
    'check_duplicate_pending_application',
    { p_user_id: userId }
  );

  if (checkResult && checkResult[0]?.has_pending) {
    return {
      error: 'มีคำขอรออนุมัติอยู่แล้ว',
      pendingApplicationId: checkResult[0].pending_application_id,
      pendingClubId: checkResult[0].pending_club_id,
      pendingSince: checkResult[0].pending_since
    };
  }

  // Proceed with submission...
}
```

---

### 3. validate_coach_club_relationship(coach_id UUID, club_id UUID)

**Purpose:** Verify that a coach belongs to the specified club.

**Signature:**
```sql
validate_coach_club_relationship(p_coach_id UUID, p_club_id UUID)
RETURNS BOOLEAN
```

**Business Rule:** BR2 - Coach-Club Relationship

**Behavior:**
1. Checks if the coach's profile has the specified `club_id`
2. Verifies the user has the 'coach' role
3. Returns `TRUE` if valid, `FALSE` otherwise

**Usage Examples:**

```sql
-- Validate coach-club relationship
SELECT validate_coach_club_relationship(
  'coach-uuid',
  'club-uuid'
) as is_valid;

-- Expected output:
-- is_valid
-- ---------
--     true  (if coach belongs to club)
--    false  (if coach doesn't belong to club)
```

**Integration:**
```typescript
// Before allowing coach to approve application
export async function reviewApplication(
  coachId: string,
  applicationId: string,
  action: 'approve' | 'reject'
) {
  // Get application
  const application = await getApplication(applicationId);

  // Validate coach-club relationship
  const { data: isValid } = await supabase.rpc(
    'validate_coach_club_relationship',
    {
      p_coach_id: coachId,
      p_club_id: application.club_id
    }
  );

  if (!isValid) {
    return { error: 'ไม่มีสิทธิ์อนุมัติคำขอนี้' };
  }

  // Proceed with review...
}
```

---

## Security

All functions are created with `SECURITY DEFINER`, meaning they execute with the privileges of the function owner (typically the database owner). This allows them to:
- Update application statuses
- Update profile membership statuses
- Access data across different users

**Important:** These functions should only be called from trusted backend code or scheduled jobs, not directly from client-side code.

---

## Testing

### Verification Script
Run the verification script to ensure all functions are created:
```bash
./scripts/run-sql-via-api.sh scripts/verify-34-helper-functions.sql
```

### Comprehensive Test
Run the comprehensive test to verify expiry logic:
```bash
./scripts/run-sql-via-api.sh scripts/test-expire-old-applications.sql
```

### Quick Verification
Run quick checks on all functions:
```bash
./scripts/run-sql-via-api.sh scripts/quick-verify-helper-functions.sql
```

---

## Monitoring and Maintenance

### Recommended Monitoring
1. **Expiry Statistics**
   - Track number of applications expired daily
   - Alert if expiry count is unusually high

2. **Duplicate Prevention**
   - Monitor how often duplicate checks prevent submissions
   - May indicate UX issues if too frequent

3. **Authorization Failures**
   - Log when coach-club validation fails
   - May indicate data integrity issues

### Scheduled Jobs
Consider setting up:
1. **Daily Expiry Job**
   ```sql
   SELECT cron.schedule(
     'expire-old-applications',
     '0 2 * * *',  -- 2 AM daily
     'SELECT expire_old_applications()'
   );
   ```

2. **Weekly Reminder Job** (Future Enhancement)
   - Send reminders 7 days before expiry
   - Notify coaches of pending applications

---

## Related Documentation
- [Membership Approval System Requirements](../.kiro/specs/membership-approval-fix/requirements.md)
- [Membership Approval System Design](../.kiro/specs/membership-approval-fix/design.md)
- [Task 1.4 Completion Summary](../TASK_1_4_HELPER_FUNCTIONS_COMPLETE.md)

---

## Change Log

### 2024-11-23
- Initial creation of all three helper functions
- Added comprehensive documentation
- Created verification and test scripts
