# Login Page - Demo Credentials Quick Access

## Overview

The login page now includes quick-access buttons for all demo accounts, making it easy to test different roles and the Badminton demo scenario.

## How to Use

### Step 1: Open Login Page
Navigate to: `http://localhost:3000/login`

### Step 2: Expand Demo Credentials
1. Scroll down to the bottom of the login form
2. Click on **"ข้อมูลทดสอบ"** (Test Credentials) to expand the section
3. Demo account buttons will appear

### Step 3: Click a Demo Account
Click any button to auto-fill the email and password fields:
- The form fields will populate automatically
- Click "เข้าสู่ระบบ" (Login) to proceed

## Available Demo Accounts

### Core Users

#### 👨‍💼 Admin
- **Email**: admin@test.com
- **Password**: Admin123!
- **Role**: Administrator
- **Access**: Full system access, user management, settings

#### 🏃‍♂️ Coach
- **Email**: coach@test.com
- **Password**: Coach123!
- **Role**: Coach
- **Access**: Manage athletes, create sessions, record performance

#### 🏅 Athlete (Original)
- **Email**: athlete@test.com
- **Password**: Athlete123!
- **Role**: Athlete
- **Access**: View schedule, check in, view performance

### Badminton Demo Athletes

These accounts are part of the Badminton demo for comprehensive testing:

#### 🏸 Somchai (Athlete 2)
- **Email**: athlete2@test.com
- **Password**: Athlete123!
- **Role**: Athlete
- **Sport**: Badminton
- **Full Name**: Somchai Badminton

#### 🏸 Niran (Athlete 3)
- **Email**: athlete3@test.com
- **Password**: Athlete123!
- **Role**: Athlete
- **Sport**: Badminton
- **Full Name**: Niran Badminton

#### 🏸 Pim (Athlete 4)
- **Email**: athlete4@test.com
- **Password**: Athlete123!
- **Role**: Athlete
- **Sport**: Badminton
- **Full Name**: Pim Badminton

## Testing Scenarios

### Scenario 1: Coach Creates Session
1. Click **🏃‍♂️ Coach** button
2. Click "เข้าสู่ระบบ"
3. Navigate to `/dashboard/coach/sessions`
4. Create a new training session

### Scenario 2: Athletes Check In
1. Click **🏸 Somchai** button
2. Click "เข้าสู่ระบบ"
3. Navigate to `/dashboard/athlete/schedule`
4. Find the session and check in

### Scenario 3: Multi-Athlete Testing
1. Open login page in multiple browser tabs
2. Login as Coach in Tab 1
3. Login as Somchai in Tab 2
4. Login as Niran in Tab 3
5. Test cross-role communication

## Features

### Auto-Fill
- Click any demo account button
- Email and password fields populate automatically
- No need to type credentials

### Visual Organization
- **Core Users**: Gray background
- **Badminton Demo Athletes**: Blue background
- Easy to distinguish between account types

### Collapsible Section
- Demo credentials hidden by default (production-safe)
- Click to expand/collapse
- Only visible in development mode

### Remember Me
- Check "จดจำรหัสผ่าน" to save credentials
- Credentials stored in browser localStorage
- Auto-fill on next visit

## Browser Console

If you encounter issues:
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Look for any authentication errors
4. Check Network tab for API calls

## Troubleshooting

### Demo Buttons Not Showing
- Ensure you're in development mode
- Check browser console for errors
- Verify NODE_ENV is set to 'development'

### Login Fails After Clicking Button
1. Verify demo user exists in database
2. Check if user is confirmed (email_confirmed_at)
3. Verify password is correct
4. Check browser console for error details

### Credentials Not Auto-Filling
1. Clear browser cache
2. Hard refresh page (Ctrl+Shift+R)
3. Check if JavaScript is enabled
4. Try a different browser

## Security Notes

⚠️ **Important**: Demo credentials are only visible in development mode and should never be exposed in production.

- Demo buttons only show when `NODE_ENV === 'development'`
- Credentials are hardcoded for testing only
- Never use these credentials in production
- Always use strong, unique passwords in production

## Related Documentation

- [BADMINTON_DEMO_QUICK_START.md](./BADMINTON_DEMO_QUICK_START.md)
- [BADMINTON_DEMO_TESTING_GUIDE.md](./BADMINTON_DEMO_TESTING_GUIDE.md)
- [TEST_USERS.md](../scripts/TEST_USERS.md)

## Quick Reference

| Account | Email | Password | Button |
|---------|-------|----------|--------|
| Admin | admin@test.com | Admin123! | 👨‍💼 |
| Coach | coach@test.com | Coach123! | 🏃‍♂️ |
| Athlete 1 | athlete@test.com | Athlete123! | 🏅 |
| Athlete 2 | athlete2@test.com | Athlete123! | 🏸 |
| Athlete 3 | athlete3@test.com | Athlete123! | 🏸 |
| Athlete 4 | athlete4@test.com | Athlete123! | 🏸 |

## Tips

1. **Quick Testing**: Use demo buttons instead of typing credentials
2. **Multi-Tab Testing**: Open multiple tabs with different accounts
3. **Remember Me**: Check the box to auto-fill on next visit
4. **Show Password**: Click eye icon to verify password before login
5. **Error Messages**: Read error messages carefully for troubleshooting

---

**Last Updated**: November 28, 2025
**Status**: ✅ Ready for Testing
