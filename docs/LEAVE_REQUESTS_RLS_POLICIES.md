# Leave Requests RLS Policies Reference

## Policy Overview

This document provides a quick reference for the Row Level Security policies on the `leave_requests` table.

## Policy Matrix

| Role | SELECT | INSERT | UPDATE | DELETE |
|------|--------|--------|--------|--------|
| **Athlete** | Own requests only | Own requests only | Own pending requests only | ❌ |
| **Coach** | Session requests only | ❌ | Session requests only | ❌ |
| **Admin** | ✅ All | ✅ All | ✅ All | ✅ All |

## Detailed Policy Logic

### Athlete Policies

#### 1. View Own Leave Requests
```sql
CREATE POLICY "Athletes view own leave requests"
  ON leave_requests FOR SELECT
  USING (athlete_id IN (
    SELECT id FROM athletes WHERE user_id = auth.uid()
  ));
```
**What it does:** Athletes can only see their own leave requests.

#### 2. Create Own Leave Requests
```sql
CREATE POLICY "Athletes create own leave requests"
  ON leave_requests FOR INSERT
  WITH CHECK (athlete_id IN (
    SELECT id FROM athletes WHERE user_id = auth.uid()
  ));
```
**What it does:** Athletes can only create leave requests for themselves.

#### 3. Update Own Pending Leave Requests
```sql
CREATE POLICY "Athletes update own pending leave requests"
  ON leave_requests FOR UPDATE
  USING (
    athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())
    AND status = 'pending'
  )
  WITH CHECK (
    athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())
    AND status = 'pending'
  );
```
**What it does:** Athletes can only modify their leave requests while they're still pending (not yet approved/rejected).

### Coach Policies

#### 4. View Session Leave Requests
```sql
CREATE POLICY "Coaches view session leave requests"
  ON leave_requests FOR SELECT
  USING (session_id IN (
    SELECT id FROM training_sessions 
    WHERE coach_id IN (
      SELECT id FROM coaches WHERE user_id = auth.uid()
    )
  ));
```
**What it does:** Coaches can see leave requests for training sessions they manage.

#### 5. Update Session Leave Requests
```sql
CREATE POLICY "Coaches update session leave requests"
  ON leave_requests FOR UPDATE
  USING (session_id IN (
    SELECT id FROM training_sessions 
    WHERE coach_id IN (
      SELECT id FROM coaches WHERE user_id = auth.uid()
    )
  ))
  WITH CHECK (session_id IN (
    SELECT id FROM training_sessions 
    WHERE coach_id IN (
      SELECT id FROM coaches WHERE user_id = auth.uid()
    )
  ));
```
**What it does:** Coaches can approve/reject leave requests for their sessions.

### Admin Policies

#### 6. Manage All Leave Requests
```sql
CREATE POLICY "Admins manage all leave requests"
  ON leave_requests FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));
```
**What it does:** Admins have full access to all leave requests (SELECT, INSERT, UPDATE, DELETE).

## Common Use Cases

### Use Case 1: Athlete Requests Leave
```typescript
// Athlete creates a leave request
const { data, error } = await supabase
  .from('leave_requests')
  .insert({
    session_id: 'session-uuid',
    athlete_id: 'athlete-uuid', // Must match current user's athlete_id
    reason: 'Family emergency - need to attend to urgent matter'
  });
// ✅ Allowed if athlete_id matches current user
// ❌ Blocked if trying to create for another athlete
```

### Use Case 2: Athlete Views Own Requests
```typescript
// Athlete views their leave requests
const { data, error } = await supabase
  .from('leave_requests')
  .select('*')
  .eq('athlete_id', currentAthleteId);
// ✅ Returns only their own requests
// ❌ Cannot see other athletes' requests
```

### Use Case 3: Athlete Updates Pending Request
```typescript
// Athlete modifies reason before coach reviews
const { data, error } = await supabase
  .from('leave_requests')
  .update({ reason: 'Updated reason for leave' })
  .eq('id', 'request-uuid')
  .eq('status', 'pending');
// ✅ Allowed if status is 'pending' and it's their request
// ❌ Blocked if status is 'approved' or 'rejected'
```

### Use Case 4: Coach Reviews Leave Request
```typescript
// Coach approves a leave request
const { data, error } = await supabase
  .from('leave_requests')
  .update({
    status: 'approved',
    reviewed_by: coachId,
    reviewed_at: new Date().toISOString()
  })
  .eq('id', 'request-uuid');
// ✅ Allowed if the session belongs to this coach
// ❌ Blocked if session belongs to another coach
```

### Use Case 5: Coach Views Pending Requests
```typescript
// Coach sees all pending leave requests for their sessions
const { data, error } = await supabase
  .from('leave_requests')
  .select(`
    *,
    training_sessions(*),
    athletes(*)
  `)
  .eq('status', 'pending');
// ✅ Returns only requests for their sessions
// ❌ Cannot see requests for other coaches' sessions
```

### Use Case 6: Admin Manages All Requests
```typescript
// Admin views all leave requests across all clubs
const { data, error } = await supabase
  .from('leave_requests')
  .select('*');
// ✅ Returns all leave requests
// ✅ Can modify any request
```

## Security Guarantees

1. **Data Isolation:** Athletes can only access their own leave requests
2. **Coach Boundaries:** Coaches can only manage requests for their sessions
3. **Status Protection:** Athletes cannot modify approved/rejected requests
4. **Admin Override:** Admins have full access for system management
5. **Audit Trail:** All changes tracked via `reviewed_by` and `reviewed_at`

## Testing Checklist

- [ ] Athlete can create leave request for themselves
- [ ] Athlete cannot create leave request for another athlete
- [ ] Athlete can view only their own leave requests
- [ ] Athlete can update pending leave request
- [ ] Athlete cannot update approved/rejected leave request
- [ ] Coach can view leave requests for their sessions
- [ ] Coach cannot view leave requests for other coaches' sessions
- [ ] Coach can approve/reject leave requests for their sessions
- [ ] Coach cannot modify leave requests for other coaches' sessions
- [ ] Admin can view all leave requests
- [ ] Admin can modify any leave request

## Related Documentation

- [Leave Requests RLS Complete](../LEAVE_REQUESTS_RLS_COMPLETE.md)
- [Training Attendance Design](.kiro/specs/training-attendance/design.md)
- [Training Attendance Requirements](.kiro/specs/training-attendance/requirements.md)
