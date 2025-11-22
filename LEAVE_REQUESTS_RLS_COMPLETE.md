# Leave Requests RLS Policies - Verification Complete ✅

**Date:** November 22, 2025  
**Status:** All RLS policies successfully created and verified

## Summary

All Row Level Security (RLS) policies for the `leave_requests` table have been successfully created and are active in the database.

## Policies Created

### 1. Athletes View Own Leave Requests
- **Type:** SELECT
- **Purpose:** Athletes can view their own leave requests
- **Logic:** `athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())`

### 2. Athletes Create Own Leave Requests
- **Type:** INSERT
- **Purpose:** Athletes can create leave requests for themselves
- **Logic:** `athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())`

### 3. Athletes Update Own Pending Leave Requests
- **Type:** UPDATE
- **Purpose:** Athletes can update their own leave requests only while status is 'pending'
- **Logic:** 
  - USING: `athlete_id IN (...) AND status = 'pending'`
  - WITH CHECK: `athlete_id IN (...) AND status = 'pending'`

### 4. Coaches View Session Leave Requests
- **Type:** SELECT
- **Purpose:** Coaches can view leave requests for their training sessions
- **Logic:** `session_id IN (SELECT id FROM training_sessions WHERE coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid()))`

### 5. Coaches Update Session Leave Requests
- **Type:** UPDATE
- **Purpose:** Coaches can approve/reject leave requests for their sessions
- **Logic:** Same as view policy, applied to both USING and WITH CHECK

### 6. Admins Manage All Leave Requests
- **Type:** ALL (SELECT, INSERT, UPDATE, DELETE)
- **Purpose:** Admins have full access to all leave requests
- **Logic:** `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')`

## Security Features

### Access Control
- ✅ Athletes can only see and manage their own leave requests
- ✅ Athletes can only modify pending requests (not approved/rejected ones)
- ✅ Coaches can view and manage leave requests for their sessions only
- ✅ Admins have full access to all leave requests

### Data Integrity
- ✅ Unique constraint: One leave request per athlete per session
- ✅ Reason validation: Minimum 10 characters required
- ✅ Status validation: Only 'pending', 'approved', or 'rejected' allowed
- ✅ Cascade deletion: Leave requests deleted when session or athlete is deleted

## Indexes Created

The following indexes optimize query performance:

1. `idx_leave_requests_athlete_id` - Fast lookup by athlete
2. `idx_leave_requests_session_id` - Fast lookup by session
3. `idx_leave_requests_status` - Fast filtering by status
4. `idx_leave_requests_reviewed_by` - Fast lookup by reviewer
5. `idx_leave_requests_athlete_status` - Composite index for athlete + status queries
6. `idx_leave_requests_session_status` - Composite index for session + status queries
7. `idx_leave_requests_pending` - Partial index for pending requests
8. `idx_leave_requests_requested_at` - Ordered by request time (DESC)
9. `leave_requests_unique_request` - Unique constraint index

## Verification Results

### Policy Check
```sql
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'leave_requests'
ORDER BY policyname;
```

**Result:** ✅ All 6 policies active and correctly configured

### Index Check
```sql
SELECT indexname
FROM pg_indexes
WHERE tablename = 'leave_requests'
ORDER BY indexname;
```

**Result:** ✅ All 10 indexes created successfully

## Business Rules Enforced

1. **BR2: การแจ้งลา (Leave Requests)**
   - ✅ Athletes can request leave in advance
   - ✅ Leave requests must include a reason (min 10 chars)
   - ✅ Coaches can approve or reject leave requests

2. **BR3: สิทธิ์การแก้ไข (Edit Permissions)**
   - ✅ Coaches can modify leave request status at any time
   - ✅ Athletes cannot modify leave requests after submission (only pending ones)
   - ✅ Admins can modify everything

## Testing Recommendations

To verify the policies work correctly, test these scenarios:

1. **Athlete Tests:**
   - Create a leave request for own session ✓
   - Try to create leave request for another athlete ✗
   - View own leave requests ✓
   - Try to view other athletes' leave requests ✗
   - Update own pending leave request ✓
   - Try to update approved/rejected leave request ✗

2. **Coach Tests:**
   - View leave requests for own sessions ✓
   - Try to view leave requests for other coaches' sessions ✗
   - Approve/reject leave requests for own sessions ✓
   - Try to modify leave requests for other coaches' sessions ✗

3. **Admin Tests:**
   - View all leave requests ✓
   - Modify any leave request ✓
   - Delete any leave request ✓

## Related Files

- Table creation: `scripts/12-create-leave-requests-table.sql`
- Verification script: `scripts/check-leave-requests-indexes-rls.sql`
- Design document: `.kiro/specs/training-attendance/design.md`
- Requirements: `.kiro/specs/training-attendance/requirements.md`

## Next Steps

With RLS policies in place, you can now:

1. ✅ Proceed to Task 1.4: Create Server Actions - Athlete (including `requestLeave()`)
2. ✅ Proceed to Task 3.4: ระบบแจ้งลา (Leave Request System UI)
3. ✅ Implement leave request approval workflow for coaches

## Notes

- All policies use `auth.uid()` to identify the current user
- Policies are permissive (OR logic between policies)
- RLS is enabled on the table, so all queries are filtered
- The policies align with the security requirements in the design document
