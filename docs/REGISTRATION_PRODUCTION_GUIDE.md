# Registration System - Production Guide

## ✅ System Status

**Status:** ✅ ALL SYSTEMS OPERATIONAL

- **Production URL:** https://sports-club-management-nine.vercel.app/register-membership
- **Total Clubs:** 23 active clubs
- **Total Coaches:** 1 coach assigned
- **Pending Applications:** 0

## 📋 Registration Flow

### Step 1: Account Creation
- User enters email and password
- System creates Supabase Auth account
- Validates email format and password strength
- **Rate Limit:** 3-5 signups per hour per IP address

### Step 2: Personal Information
- Full name (ชื่อ-นามสกุล)
- Nickname (ชื่อเล่น)
- Gender (เพศ)
- Date of birth (วันเกิด) - Age must be 5-100 years
- Phone number (เบอร์โทร) - Format: 0XX-XXX-XXXX
- Address (ที่อยู่)
- Emergency contact (เบอร์ติดต่อฉุกเฉิน)
- Blood type (กลุ่มเลือด) - Optional
- Medical conditions (โรคประจำตัว) - Optional

### Step 3: Document Upload
Required documents:
1. **บัตรประชาชนนักกีฬา** (ID Card)
2. **ทะเบียนบ้านนักกีฬา** (House Registration)
3. **สูติบัตร** (Birth Certificate)
4. **บัตรประชาชนผู้ปกครอง** (Parent ID Card)
5. **ทะเบียนบ้านผู้ปกครอง** (Parent House Registration)

File requirements:
- Max size: 5MB per file
- Allowed formats: JPG, PNG, PDF
- Stored in Supabase Storage bucket: `membership-documents`

### Step 4: Sport Selection
- Choose one sport/club from available options
- System validates club has assigned coaches
- Cannot select multiple clubs in one application

## 🔒 Security Features

### Authentication
- Email/password authentication via Supabase Auth
- Session management with JWT tokens
- Automatic redirect if already logged in

### Authorization (RLS Policies)
- Users can only view their own applications
- Coaches can view applications for their clubs only
- Admins have full access to all applications

### Data Validation
- Client-side validation with Zod schemas
- Server-side validation in actions
- Input sanitization to prevent XSS
- SQL injection protection via parameterized queries

### Rate Limiting
- Supabase Auth rate limits: 3-5 signups/hour per IP
- If rate limited, users can:
  - Wait 2-24 hours
  - Change IP address (mobile hotspot, VPN)
  - Contact admin for assistance

## 🗄️ Database Structure

### Tables
1. **membership_applications**
   - Stores all application data
   - JSONB fields for personal_info and documents
   - Status: pending, approved, rejected, info_requested

2. **profiles**
   - User profile with membership_status
   - Updated to 'pending' when application submitted

3. **athletes**
   - Created when application is approved
   - Links user to club with athlete details

### Helper Functions
1. **check_duplicate_pending_application(user_id)**
   - Prevents multiple pending applications
   - Returns existing pending application if found

2. **update_application_status(application_id, status, reviewed_by, notes)**
   - Updates application status
   - Adds activity log entry
   - Updates profile membership_status

3. **add_activity_log(application_id, action, by_user, details)**
   - Logs all application activities
   - Tracks who did what and when

4. **validate_coach_club(coach_id, club_id)**
   - Validates coach belongs to club
   - Used in RLS policies

## 🧪 Testing

### Verification Script
```bash
./scripts/run-sql-via-api.sh scripts/verify-registration-components.sql
```

This checks:
- ✅ Database tables and columns
- ✅ Helper functions exist
- ✅ RLS policies enabled
- ✅ Clubs and coaches available
- ✅ Constraints and indexes
- ✅ Recent activity

### Manual Testing Checklist
1. ✅ Open https://sports-club-management-nine.vercel.app/register-membership
2. ✅ Fill in account creation form (Step 1)
3. ✅ Fill in personal information (Step 2)
4. ✅ Upload all required documents (Step 3)
5. ✅ Select a sport/club (Step 4)
6. ✅ Submit application
7. ✅ Verify redirect to /dashboard/athlete/applications
8. ✅ Check application appears in list with "pending" status

## ⚠️ Known Issues & Solutions

### Issue 1: Rate Limit Exceeded
**Symptom:** "email rate limit exceeded" error

**Solutions:**
1. Wait 2-24 hours for rate limit to reset
2. Use different IP address (mobile hotspot, VPN, different location)
3. Contact admin to create account manually via `/dashboard/admin/create-user`

### Issue 2: Duplicate Application
**Symptom:** "คุณมีใบสมัครที่รอการอนุมัติอยู่แล้ว"

**Solution:** 
- User must wait for current application to be reviewed
- Cannot submit new application while one is pending
- Coach/admin must approve or reject existing application first

### Issue 3: No Coaches Available
**Symptom:** Cannot submit application for certain clubs

**Solution:**
- Admin must assign coach to club first
- Use `/dashboard/admin` to manage coach assignments

### Issue 4: Document Upload Fails
**Symptom:** Upload button doesn't work or shows error

**Solutions:**
1. Check file size (must be < 5MB)
2. Check file format (JPG, PNG, or PDF only)
3. Verify storage bucket exists and has correct RLS policies
4. Check browser console for detailed error

## 📊 Monitoring

### Key Metrics to Track
1. **Application Volume**
   - Total applications per day/week
   - Pending vs approved vs rejected ratio
   - Average time to approval

2. **User Experience**
   - Drop-off rate at each step
   - Time spent on each step
   - Error rates and types

3. **System Health**
   - Database query performance
   - Storage usage
   - API response times

### SQL Queries for Monitoring

```sql
-- Applications by status
SELECT status, COUNT(*) 
FROM membership_applications 
GROUP BY status;

-- Applications by date (last 7 days)
SELECT DATE(created_at) as date, COUNT(*) 
FROM membership_applications 
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Average time to approval
SELECT 
  AVG(EXTRACT(EPOCH FROM (reviewed_at - created_at))/3600) as avg_hours
FROM membership_applications 
WHERE status = 'approved' AND reviewed_at IS NOT NULL;
```

## 🚀 Deployment

### Current Deployment
- **Platform:** Vercel
- **Environment:** Production
- **Database:** Supabase (hosted)
- **Storage:** Supabase Storage

### Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
SUPABASE_ACCESS_TOKEN=sbp_xxx...
```

### Deployment Process
1. Push code to GitHub
2. Vercel auto-deploys from main branch
3. Database migrations run via API scripts
4. No manual steps required

## 📞 Support

### For Users
- Rate limit issues: Contact admin or wait 2-24 hours
- Application status: Check `/dashboard/athlete/applications`
- Technical issues: Contact system administrator

### For Admins
- Create user manually: `/dashboard/admin/create-user`
- View all applications: `/dashboard/admin` (future feature)
- Manage coaches: `/dashboard/admin`

### For Developers
- Verification script: `./scripts/verify-registration-components.sql`
- Database migrations: `./scripts/run-sql-via-api.sh`
- Logs: Check Vercel deployment logs and Supabase logs

## 🎯 Success Criteria

Registration system is working correctly when:
- ✅ All 4 steps complete without errors
- ✅ Application appears in database with status "pending"
- ✅ User profile updated to membership_status "pending"
- ✅ User redirected to applications page
- ✅ Toast notification shows success message
- ✅ No duplicate applications allowed
- ✅ All documents uploaded successfully
- ✅ Activity log entries created

## 📝 Changelog

### 2024-11-25
- ✅ Verified all system components operational
- ✅ Confirmed 23 clubs available
- ✅ Confirmed RLS policies working
- ✅ Confirmed helper functions exist
- ✅ Created comprehensive verification script
- ✅ Documented production guide
