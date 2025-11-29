# Badminton Demo - Quick Start Guide

## 🚀 Quick Setup

### Step 1: Verify Demo Data
```bash
cd sports-club-management

# Check if Badminton sport exists
./scripts/run-sql-via-api.sh -c "SELECT * FROM sports WHERE name = 'Badminton';"

# Check if demo athletes exist
./scripts/run-sql-via-api.sh -c "SELECT email, full_name FROM profiles WHERE email LIKE 'athlete%@test.com';"
```

### Step 2: Login Credentials

**Coach Account:**
- Email: `coach@test.com`
- Password: `Coach123!`
- URL: `http://localhost:3000/login`

**Demo Athletes:**
| Name | Email | Password |
|------|-------|----------|
| Somchai | athlete2@test.com | Athlete123! |
| Niran | athlete3@test.com | Athlete123! |
| Pim | athlete4@test.com | Athlete123! |

## 📋 Testing Scenarios (5 minutes each)

### Scenario 1: Coach Creates Session
1. Login as coach@test.com
2. Go to `/dashboard/coach/sessions`
3. Click "Create Session"
4. Fill: Title="Badminton Training", Date=Tomorrow, Time=10:00-11:30
5. Click "Create"
✅ **Expected**: Session appears in list

### Scenario 2: Athletes Check In
1. Login as athlete2@test.com
2. Go to `/dashboard/athlete/schedule`
3. Find the session created above
4. Click "Check In"
✅ **Expected**: Status changes to "Present"

### Scenario 3: Coach Records Performance
1. Login as coach@test.com
2. Go to `/dashboard/coach/performance`
3. Select athlete (Somchai)
4. Click "Add Record"
5. Fill: Metric="Smash Power", Value="85", Unit="km/h"
6. Click "Save"
✅ **Expected**: Record appears in athlete's performance history

### Scenario 4: Athlete Views Announcements
1. Login as athlete2@test.com
2. Go to `/dashboard/athlete/announcements`
3. View all announcements
✅ **Expected**: Can see all coach announcements

### Scenario 5: Athlete Submits Leave Request
1. Login as athlete2@test.com
2. Go to `/dashboard/athlete/leave-history`
3. Click "Request Leave"
4. Select a session and reason
5. Click "Submit"
✅ **Expected**: Request appears in history

### Scenario 6: Coach Reviews Leave Request
1. Login as coach@test.com
2. Go to `/dashboard/coach/applications` (or leave requests section)
3. Find the leave request from Scenario 5
4. Click "Approve" or "Reject"
✅ **Expected**: Athlete notified of decision

## 🔍 Key Features to Test

### Communication Features
- [ ] Announcements broadcast to all athletes
- [ ] Notifications sent in real-time
- [ ] Leave request workflow complete
- [ ] Performance updates visible to athletes
- [ ] Attendance records visible to athletes

### Data Integrity
- [ ] Each athlete sees only their own data
- [ ] Coach sees all athletes' data
- [ ] Attendance calculations correct
- [ ] Performance trends accurate
- [ ] No data mixing between users

### Error Handling
- [ ] Invalid dates rejected
- [ ] Permission errors handled gracefully
- [ ] Clear error messages shown
- [ ] Data not saved on error

## 📊 Verification Queries

### Check Demo Data
```sql
-- Verify Badminton sport
SELECT * FROM sports WHERE name = 'Badminton';

-- Verify demo athletes
SELECT email, full_name FROM profiles 
WHERE email IN ('athlete2@test.com', 'athlete3@test.com', 'athlete4@test.com');

-- Verify user roles
SELECT u.email, ur.role FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
WHERE u.email LIKE '%@test.com';
```

### Check Communication Data
```sql
-- View announcements
SELECT * FROM announcements ORDER BY created_at DESC LIMIT 5;

-- View notifications
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;

-- View leave requests
SELECT * FROM leave_requests ORDER BY created_at DESC LIMIT 5;

-- View performance records
SELECT * FROM performance_metrics ORDER BY recorded_at DESC LIMIT 10;
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Demo users not found | Run: `./scripts/run-sql-via-api.sh scripts/112-create-demo-users-for-badminton.sql` |
| Badminton sport missing | Run: `./scripts/run-sql-via-api.sh scripts/110-create-badminton-demo.sql` |
| Athletes can't see announcements | Check RLS policies and athlete club assignment |
| Notifications not appearing | Check notification preferences and browser permissions |
| Performance not updating | Verify coach has permission to record metrics |

## 📱 Testing on Mobile

1. Open app on mobile device
2. Login as athlete
3. Test check-in functionality
4. Test notification display
5. Test offline mode (if PWA enabled)

## 🎯 Success Criteria

✅ All demo users can login
✅ Coach can create sessions
✅ Athletes can check in
✅ Performance records visible
✅ Announcements broadcast correctly
✅ Leave requests workflow complete
✅ Notifications sent in real-time
✅ No permission errors
✅ Data integrity maintained
✅ Error messages clear

## 📞 Support

For issues or questions:
1. Check [BADMINTON_DEMO_TESTING_GUIDE.md](./BADMINTON_DEMO_TESTING_GUIDE.md)
2. Review [DATABASE.md](./DATABASE.md)
3. Check browser console for errors
4. Review server logs

## 📚 Related Docs

- [Full Testing Guide](./BADMINTON_DEMO_TESTING_GUIDE.md)
- [Database Schema](./DATABASE.md)
- [Testing Guide](./TESTING.md)
- [Announcement System](./ANNOUNCEMENT_SYSTEM.md)
- [Leave Request System](./ATHLETE_NOTIFICATIONS_LEAVE_SYSTEM.md)
