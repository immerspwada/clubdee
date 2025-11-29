# Badminton Demo Setup - Summary

## Overview

A comprehensive demo environment has been created to test all communication features between coaches and athletes in the Sports Club Management System.

## What Was Created

### 1. New Sport Type
- **Sport**: Badminton
- **ID**: `10000000-0000-0000-0000-000000000001`
- **Status**: ✅ Created and verified

### 2. Demo Athletes (4 total)
All athletes created with verified credentials:

| # | Name | Email | Password | Status |
|---|------|-------|----------|--------|
| 1 | Original Athlete | athlete@test.com | Athlete123! | ✅ Existing |
| 2 | Somchai Badminton | athlete2@test.com | Athlete123! | ✅ Created |
| 3 | Niran Badminton | athlete3@test.com | Athlete123! | ✅ Created |
| 4 | Pim Badminton | athlete4@test.com | Athlete123! | ✅ Created |

### 3. Coach Account
- **Email**: coach@test.com
- **Password**: Coach123!
- **Role**: Coach
- **Status**: ✅ Existing

### 4. Database Migrations
Three migration scripts created:

| Script | Purpose | Status |
|--------|---------|--------|
| `110-create-badminton-demo.sql` | Create Badminton sport | ✅ Executed |
| `111-create-demo-badminton-athletes.sql` | Create athlete profiles | ✅ Executed |
| `112-create-demo-users-for-badminton.sql` | Create auth users | ✅ Executed |

## Communication Features to Test

### 1. Announcements System
- Coach creates announcements
- Athletes receive and view announcements
- Read status tracking
- Priority levels (low, normal, high, urgent)
- Pinned announcements

### 2. Notifications System
- Real-time notifications for:
  - New announcements
  - Performance records
  - Attendance updates
  - Leave request decisions
  - Session updates

### 3. Leave Request Workflow
- Athletes submit leave requests
- Coach reviews requests
- Coach approves/rejects
- Athlete receives notification
- Attendance adjusted accordingly

### 4. Performance Tracking
- Coach records performance metrics
- Athletes view performance history
- Performance trends calculated
- Coach provides feedback
- Athlete receives notifications

### 5. Attendance Management
- Coach marks attendance
- Athletes view attendance records
- Attendance rate calculated
- Leave requests impact attendance
- Excused absences tracked

### 6. Training Sessions
- Coach creates sessions
- Athletes view schedule
- Athletes check in
- Coach manages attendance
- Session details visible to all

## Testing Documentation

### Quick Start
📄 **File**: `docs/BADMINTON_DEMO_QUICK_START.md`
- 5-minute testing scenarios
- Quick verification queries
- Common issues and solutions
- Success criteria

### Comprehensive Testing Guide
📄 **File**: `docs/BADMINTON_DEMO_TESTING_GUIDE.md`
- Detailed testing workflow
- Phase-by-phase testing plan
- Cross-role communication tests
- Data integrity verification
- Error handling tests
- Performance testing scenarios
- Complete testing checklist

## How to Use

### 1. Verify Setup
```bash
cd sports-club-management

# Check Badminton sport
./scripts/run-sql-via-api.sh scripts/110-create-badminton-demo.sql

# Check demo athletes
./scripts/run-sql-via-api.sh scripts/111-create-demo-badminton-athletes.sql
```

### 2. Login and Test
1. Open http://localhost:3000/login
2. Use credentials from table above
3. Follow testing scenarios in quick start guide

### 3. Verify Data
```bash
# Check all demo users
SELECT u.email, ur.role FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
WHERE u.email LIKE '%@test.com';

# Check demo athletes
SELECT email, full_name FROM profiles 
WHERE email IN ('athlete2@test.com', 'athlete3@test.com', 'athlete4@test.com');
```

## Testing Phases

### Phase 1: Setup Verification ✅
- Verify all demo data created
- Verify user roles assigned
- Verify database integrity

### Phase 2: Coach Features
- Create training sessions
- Create announcements
- Record performance metrics
- Manage attendance

### Phase 3: Athlete Features
- View training schedule
- Check in to sessions
- View announcements
- View performance history
- Submit leave requests

### Phase 4: Communication Features
- Notifications system
- Announcement broadcasting
- Leave request workflow
- Performance tracking

### Phase 5: Cross-Role Communication
- Coach-to-athlete communication
- Athlete-to-coach communication
- Multi-athlete scenarios

### Phase 6: Data Integrity
- Attendance calculations
- Performance trends
- Leave request impact

### Phase 7: Error Handling
- Invalid data validation
- Permission enforcement
- Concurrent operations

## Key Test Scenarios

### Scenario 1: Complete Workflow (15 minutes)
1. Coach creates training session
2. Athletes check in
3. Coach records performance
4. Athletes view performance
5. Athlete submits leave request
6. Coach approves leave
7. Verify attendance adjusted

### Scenario 2: Announcement Broadcasting (5 minutes)
1. Coach creates announcement
2. All athletes receive notification
3. Athletes view announcement
4. Athletes mark as read
5. Verify read status tracked

### Scenario 3: Performance Tracking (10 minutes)
1. Coach records metrics for multiple athletes
2. Each athlete views their metrics
3. Verify trends calculated
4. Verify no data mixing

### Scenario 4: Leave Request Workflow (10 minutes)
1. Athlete submits leave request
2. Coach reviews request
3. Coach approves/rejects
4. Athlete receives notification
5. Verify attendance updated

## Success Criteria

✅ All demo users can login
✅ Coach can create sessions
✅ Athletes can check in
✅ Performance records visible to athletes
✅ Announcements broadcast to all athletes
✅ Leave requests workflow complete
✅ Notifications sent in real-time
✅ No permission errors
✅ Data integrity maintained
✅ Error messages clear and helpful

## Troubleshooting

### Demo users not created
```bash
./scripts/run-sql-via-api.sh scripts/112-create-demo-users-for-badminton.sql
```

### Badminton sport not showing
```bash
./scripts/run-sql-via-api.sh scripts/110-create-badminton-demo.sql
```

### Athletes can't see announcements
1. Verify RLS policies enabled
2. Check athlete club assignment
3. Verify announcement published
4. Check browser console

### Notifications not appearing
1. Check notifications table exists
2. Verify notification preferences
3. Check browser permissions
4. Review notification logs

## Database Schema

### New Tables Used
- `sports` - Sport types
- `teams` - Team management
- `team_members` - Team membership
- `training_sessions` - Training schedule
- `attendance` - Attendance records
- `announcements` - Coach announcements
- `notifications` - User notifications
- `leave_requests` - Leave request workflow
- `performance_metrics` - Performance tracking

### Key Relationships
```
Coach (auth.users)
  ├── Creates training_sessions
  ├── Creates announcements
  ├── Records performance_metrics
  └── Marks attendance

Athlete (auth.users)
  ├── Joins teams
  ├── Attends training_sessions
  ├── Receives notifications
  ├── Submits leave_requests
  └── Views performance_metrics
```

## Performance Considerations

### Load Testing
- 4 athletes checking in simultaneously
- Coach marking attendance for 4 athletes
- Announcements broadcast to 4 athletes
- Performance metrics recorded for 4 athletes

### Expected Performance
- Check-in: < 1 second
- Attendance marking: < 2 seconds
- Announcement creation: < 1 second
- Performance recording: < 1 second
- Notification delivery: < 5 seconds

## Next Steps

1. **Run Quick Start Tests** (5 minutes)
   - Follow scenarios in BADMINTON_DEMO_QUICK_START.md

2. **Run Comprehensive Tests** (1-2 hours)
   - Follow phases in BADMINTON_DEMO_TESTING_GUIDE.md

3. **Document Issues**
   - Create bug reports for any failures
   - Note any performance issues

4. **Update Documentation**
   - Update based on findings
   - Add any new test scenarios

5. **Deploy to Production**
   - If all tests pass
   - Archive demo data if needed

## Related Documentation

- [Quick Start Guide](./BADMINTON_DEMO_QUICK_START.md)
- [Comprehensive Testing Guide](./BADMINTON_DEMO_TESTING_GUIDE.md)
- [Database Schema](./DATABASE.md)
- [Testing Guide](./TESTING.md)
- [Announcement System](./ANNOUNCEMENT_SYSTEM.md)
- [Leave Request System](./ATHLETE_NOTIFICATIONS_LEAVE_SYSTEM.md)
- [Coach Sessions](./COACH_SESSIONS_IMPROVEMENTS.md)

## Support

For questions or issues:
1. Check the quick start guide
2. Review the comprehensive testing guide
3. Check database schema documentation
4. Review browser console for errors
5. Check server logs

---

**Created**: November 28, 2025
**Status**: ✅ Ready for Testing
**Demo Sport**: Badminton
**Demo Athletes**: 4 (Somchai, Niran, Pim, + Original)
**Test Coverage**: All communication features
