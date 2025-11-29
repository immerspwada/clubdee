# Badminton Demo Testing Guide

## Overview

This guide provides comprehensive instructions for testing all communication features between coaches and athletes using the new Badminton demo setup.

## Demo Setup Summary

### Created Resources

✅ **New Sport Type**: Badminton
✅ **Demo Athletes**: 4 new athletes (athlete2-4@test.com)
✅ **Demo Users**: All created and ready for testing

### Test User Credentials

#### Existing Users
```
Coach:
  Email: coach@test.com
  Password: Coach123!
  Role: coach

Athlete (Original):
  Email: athlete@test.com
  Password: Athlete123!
  Role: athlete
```

#### New Demo Athletes
```
Athlete 2 - Somchai:
  Email: athlete2@test.com
  Password: Athlete123!
  Role: athlete
  Full Name: Somchai Badminton

Athlete 3 - Niran:
  Email: athlete3@test.com
  Password: Athlete123!
  Role: athlete
  Full Name: Niran Badminton

Athlete 4 - Pim:
  Email: athlete4@test.com
  Password: Athlete123!
  Role: athlete
  Full Name: Pim Badminton
```

## Testing Workflow

### Phase 1: Setup Verification

1. **Verify Demo Data Created**
   ```bash
   # Check if Badminton sport exists
   SELECT * FROM sports WHERE name = 'Badminton';
   
   # Check if demo athletes exist
   SELECT * FROM profiles WHERE email IN (
     'athlete2@test.com', 'athlete3@test.com', 'athlete4@test.com'
   );
   ```

2. **Verify User Roles**
   ```bash
   SELECT u.email, ur.role 
   FROM auth.users u
   LEFT JOIN user_roles ur ON ur.user_id = u.id
   WHERE u.email IN (
     'coach@test.com', 'athlete@test.com',
     'athlete2@test.com', 'athlete3@test.com', 'athlete4@test.com'
   );
   ```

### Phase 2: Coach Features Testing

#### 2.1 Create Training Sessions

**Steps:**
1. Login as coach@test.com
2. Navigate to `/dashboard/coach/sessions`
3. Click "Create Session"
4. Fill in details:
   - Title: "Badminton Basics Training"
   - Description: "Learn fundamental techniques"
   - Date: Tomorrow
   - Time: 10:00 AM - 11:30 AM
   - Location: "Court A"
5. Click "Create"

**Expected Results:**
- ✅ Session created successfully
- ✅ Session appears in coach's session list
- ✅ Athletes receive notification (if notifications enabled)

#### 2.2 Create Announcements

**Steps:**
1. Navigate to `/dashboard/coach/announcements`
2. Click "Create Announcement"
3. Fill in details:
   - Title: "Welcome to Badminton Team"
   - Message: "Welcome to our badminton training program..."
   - Priority: "Normal"
4. Click "Publish"

**Expected Results:**
- ✅ Announcement created
- ✅ Announcement visible to all team athletes
- ✅ Athletes can mark as read

#### 2.3 Record Performance Metrics

**Steps:**
1. Navigate to `/dashboard/coach/performance`
2. Select an athlete (e.g., Somchai)
3. Click "Add Performance Record"
4. Fill in:
   - Metric: "Smash Power"
   - Value: "85"
   - Unit: "km/h"
   - Notes: "Good improvement"
5. Click "Save"

**Expected Results:**
- ✅ Performance record saved
- ✅ Record appears in athlete's performance history
- ✅ Athlete receives notification

#### 2.4 Manage Attendance

**Steps:**
1. Navigate to `/dashboard/coach/attendance`
2. Select a training session
3. Mark attendance for each athlete:
   - Present: ✓
   - Absent: ✗
   - Late: ⏱
   - Excused: 📋
4. Click "Save Attendance"

**Expected Results:**
- ✅ Attendance recorded
- ✅ Athletes can view their attendance record
- ✅ Attendance statistics updated

### Phase 3: Athlete Features Testing

#### 3.1 View Training Schedule

**Steps:**
1. Login as athlete2@test.com
2. Navigate to `/dashboard/athlete/schedule`
3. View upcoming sessions

**Expected Results:**
- ✅ Can see all assigned training sessions
- ✅ Sessions show date, time, location
- ✅ Can see coach information

#### 3.2 Check In to Session

**Steps:**
1. On session detail page, click "Check In"
2. Confirm check-in

**Expected Results:**
- ✅ Check-in recorded with timestamp
- ✅ Status changes to "Present"
- ✅ Coach can see check-in

#### 3.3 View Announcements

**Steps:**
1. Navigate to `/dashboard/athlete/announcements`
2. View all announcements from coaches

**Expected Results:**
- ✅ Can see all announcements
- ✅ Can mark announcements as read
- ✅ Read status persists

#### 3.4 View Performance History

**Steps:**
1. Navigate to `/dashboard/athlete/performance`
2. View performance records

**Expected Results:**
- ✅ Can see all performance metrics recorded by coach
- ✅ Can see trends over time
- ✅ Can view coach feedback

#### 3.5 View Attendance History

**Steps:**
1. Navigate to `/dashboard/athlete/attendance`
2. View attendance records

**Expected Results:**
- ✅ Can see attendance for all sessions
- ✅ Can see attendance rate/percentage
- ✅ Can see attendance statistics

#### 3.6 Submit Leave Request

**Steps:**
1. Navigate to `/dashboard/athlete/leave-history`
2. Click "Request Leave"
3. Fill in:
   - Session: Select a session
   - Reason: "Family event"
   - Dates: Select date range
4. Click "Submit"

**Expected Results:**
- ✅ Leave request submitted
- ✅ Coach receives notification
- ✅ Request appears in history

### Phase 4: Communication Features Testing

#### 4.1 Notifications System

**Test Scenarios:**
1. Coach creates announcement → Athletes receive notification
2. Coach records performance → Athlete receives notification
3. Coach marks attendance → Athlete receives notification
4. Athlete submits leave request → Coach receives notification

**Verification:**
- ✅ Notifications appear in real-time
- ✅ Notifications show correct information
- ✅ Athletes can dismiss notifications
- ✅ Notifications persist in history

#### 4.2 Announcement System

**Test Scenarios:**
1. Create announcement with different priorities
2. Pin important announcements
3. Set expiration dates
4. Track read status

**Verification:**
- ✅ Announcements display correctly
- ✅ Priority levels affect display
- ✅ Pinned announcements appear first
- ✅ Expired announcements hidden
- ✅ Read status tracked per user

#### 4.3 Leave Request Workflow

**Test Scenarios:**
1. Athlete submits leave request
2. Coach reviews request
3. Coach approves/rejects request
4. Athlete receives notification

**Verification:**
- ✅ Request submitted successfully
- ✅ Coach can view pending requests
- ✅ Coach can approve/reject
- ✅ Athlete notified of decision
- ✅ Attendance adjusted accordingly

#### 4.4 Performance Tracking

**Test Scenarios:**
1. Coach records multiple metrics for same athlete
2. Coach records metrics for different athletes
3. Athlete views performance trends
4. Coach provides feedback

**Verification:**
- ✅ Metrics recorded with timestamp
- ✅ Metrics visible to athlete
- ✅ Trends calculated correctly
- ✅ Feedback appears with metrics

### Phase 5: Cross-Role Communication Testing

#### 5.1 Coach-to-Athlete Communication

**Test Scenarios:**
1. Coach creates announcement → All athletes see it
2. Coach records performance → Athlete sees update
3. Coach marks attendance → Athlete sees record
4. Coach gives feedback → Athlete receives notification

**Verification:**
- ✅ All communication reaches intended recipients
- ✅ Information is accurate
- ✅ Notifications are timely
- ✅ No information leakage between roles

#### 5.2 Athlete-to-Coach Communication

**Test Scenarios:**
1. Athlete submits leave request → Coach sees it
2. Athlete checks in → Coach sees check-in
3. Athlete views feedback → Can respond (if enabled)

**Verification:**
- ✅ All athlete actions visible to coach
- ✅ Coach can take action on athlete requests
- ✅ Two-way communication works

#### 5.3 Multi-Athlete Scenarios

**Test Scenarios:**
1. Coach creates session with 4 athletes
2. Different athletes check in at different times
3. Coach records different performance for each
4. Coach marks different attendance for each

**Verification:**
- ✅ Each athlete sees only their own data
- ✅ Coach sees all athletes' data
- ✅ No data mixing between athletes
- ✅ Isolation enforced by RLS

### Phase 6: Data Integrity Testing

#### 6.1 Attendance Calculations

**Test Scenarios:**
1. Create 10 sessions
2. Mark attendance for each
3. Verify attendance rate calculation

**Verification:**
- ✅ Attendance rate = (Present + Late) / Total
- ✅ Excused absences don't count against rate
- ✅ Calculations update in real-time

#### 6.2 Performance Trends

**Test Scenarios:**
1. Record 5 performance metrics over time
2. View trend analysis
3. Verify calculations

**Verification:**
- ✅ Trends show improvement/decline
- ✅ Averages calculated correctly
- ✅ Charts display accurately

#### 6.3 Leave Request Impact

**Test Scenarios:**
1. Submit leave request for session
2. Coach approves
3. Verify attendance not marked as absent

**Verification:**
- ✅ Approved leave doesn't count as absence
- ✅ Attendance rate not affected
- ✅ Session shows "Excused"

### Phase 7: Error Handling Testing

#### 7.1 Invalid Data

**Test Scenarios:**
1. Try to create session with past date
2. Try to record negative performance value
3. Try to submit leave for non-existent session

**Verification:**
- ✅ Validation errors shown
- ✅ Clear error messages
- ✅ Data not saved on error

#### 7.2 Permission Errors

**Test Scenarios:**
1. Athlete tries to access coach dashboard
2. Athlete tries to modify another athlete's data
3. Coach tries to access admin features

**Verification:**
- ✅ Access denied with appropriate message
- ✅ Redirected to allowed pages
- ✅ No data exposed

#### 7.3 Concurrent Operations

**Test Scenarios:**
1. Two coaches try to mark attendance simultaneously
2. Coach and athlete check in at same time
3. Multiple athletes submit leave requests

**Verification:**
- ✅ No data corruption
- ✅ Last write wins or conflict resolved
- ✅ All operations logged

## Testing Checklist

### Pre-Testing
- [ ] All demo users created
- [ ] All demo data verified in database
- [ ] Test environment running
- [ ] Browser console clear of errors

### Coach Features
- [ ] Can create training sessions
- [ ] Can create announcements
- [ ] Can record performance metrics
- [ ] Can manage attendance
- [ ] Can review leave requests
- [ ] Can provide feedback

### Athlete Features
- [ ] Can view training schedule
- [ ] Can check in to sessions
- [ ] Can view announcements
- [ ] Can view performance history
- [ ] Can view attendance history
- [ ] Can submit leave requests

### Communication
- [ ] Notifications sent correctly
- [ ] Announcements visible to all
- [ ] Leave requests workflow complete
- [ ] Performance updates timely
- [ ] Attendance updates visible

### Data Integrity
- [ ] Attendance calculations correct
- [ ] Performance trends accurate
- [ ] Leave requests impact attendance
- [ ] No data mixing between users
- [ ] RLS policies enforced

### Error Handling
- [ ] Invalid data rejected
- [ ] Permission errors handled
- [ ] Concurrent operations safe
- [ ] Error messages clear

## Troubleshooting

### Issue: Demo users not created
**Solution:**
```bash
# Check if users exist
SELECT * FROM auth.users WHERE email LIKE 'athlete%@test.com';

# If missing, run migration again
./scripts/run-sql-via-api.sh scripts/112-create-demo-users-for-badminton.sql
```

### Issue: Badminton sport not showing
**Solution:**
```bash
# Verify sport exists
SELECT * FROM sports WHERE name = 'Badminton';

# If missing, run migration
./scripts/run-sql-via-api.sh scripts/110-create-badminton-demo.sql
```

### Issue: Athletes can't see announcements
**Solution:**
1. Verify RLS policies are enabled
2. Check if athlete is in correct club
3. Verify announcement is published
4. Check browser console for errors

### Issue: Notifications not appearing
**Solution:**
1. Check if notifications table exists
2. Verify notification preferences enabled
3. Check browser notification permissions
4. Review notification logs in database

## Performance Testing

### Load Testing Scenarios

1. **Multiple Athletes Checking In**
   - 10 athletes check in simultaneously
   - Verify all check-ins recorded
   - Verify no data loss

2. **Bulk Attendance Marking**
   - Coach marks attendance for 50 athletes
   - Verify all records saved
   - Verify performance acceptable

3. **Announcement Broadcasting**
   - Create announcement for 100 athletes
   - Verify all receive notification
   - Measure notification latency

## Reporting

### Test Results Template

```
Test Date: [DATE]
Tester: [NAME]
Environment: Production

PASSED: [NUMBER]
FAILED: [NUMBER]
SKIPPED: [NUMBER]

Issues Found:
1. [Issue Description]
   - Severity: [Critical/High/Medium/Low]
   - Steps to Reproduce: [Steps]
   - Expected: [Expected Result]
   - Actual: [Actual Result]

Notes:
[Any additional observations]
```

## Next Steps

After completing all tests:

1. Document any issues found
2. Create bug reports for failures
3. Update documentation based on findings
4. Plan for next testing cycle
5. Deploy to production if all tests pass

## Related Documentation

- [ANNOUNCEMENT_SYSTEM.md](./ANNOUNCEMENT_SYSTEM.md)
- [ATHLETE_NOTIFICATIONS_LEAVE_SYSTEM.md](./ATHLETE_NOTIFICATIONS_LEAVE_SYSTEM.md)
- [COACH_SESSIONS_IMPROVEMENTS.md](./COACH_SESSIONS_IMPROVEMENTS.md)
- [DATABASE.md](./DATABASE.md)
- [TESTING.md](./TESTING.md)
