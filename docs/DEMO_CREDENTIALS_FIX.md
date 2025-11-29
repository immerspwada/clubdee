# Demo Credentials Fix Guide

## ปัญหา

Demo credentials ไม่ทำงาน เพราะ:
1. Demo users อาจไม่มีข้อมูล profiles
2. Demo users อาจไม่มี user_roles
3. Demo users อาจไม่ได้ยืนยันอีเมล

## วิธีแก้ไข

### Step 1: รัน Migration Scripts ตามลำดับ

```bash
cd sports-club-management

# 1. สร้าง demo users ใน auth
./scripts/run-sql-via-api.sh scripts/112-create-demo-users-for-badminton.sql

# 2. สร้าง badminton demo setup
./scripts/run-sql-via-api.sh scripts/110-create-badminton-demo.sql

# 3. สร้าง athlete profiles
./scripts/run-sql-via-api.sh scripts/111-create-demo-badminton-athletes.sql

# 4. สร้าง user_roles และ profiles ที่ขาดหายไป
./scripts/run-sql-via-api.sh scripts/114-complete-demo-setup.sql
```

### Step 2: ตรวจสอบว่า Demo Users ทำงาน

```bash
# ตรวจสอบสถานะ
./scripts/run-sql-via-api.sh scripts/113-fix-demo-credentials.sql
```

### Step 3: ทดสอบ Login

1. ไปที่ http://localhost:3000/login
2. Scroll down และ click "ข้อมูลทดสอบ"
3. ลองกด demo account buttons
4. ตรวจสอบว่า auto-fill ทำงาน
5. Click "เข้าสู่ระบบ"

## Demo Credentials ที่ถูกต้อง

### Core Users
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | Admin123! |
| Coach | coach@test.com | Coach123! |
| Athlete | athlete@test.com | Athlete123! |

### Badminton Demo Athletes
| Name | Email | Password |
|------|-------|----------|
| Somchai | athlete2@test.com | Athlete123! |
| Niran | athlete3@test.com | Athlete123! |
| Pim | athlete4@test.com | Athlete123! |

## ถ้ายังไม่ทำงาน

### ตรวจสอบ 1: ตรวจสอบ auth.users

```sql
SELECT email, email_confirmed_at 
FROM auth.users 
WHERE email LIKE '%@test.com';
```

**ถ้าไม่มี users**: รัน script 112 อีกครั้ง

### ตรวจสอบ 2: ตรวจสอบ user_roles

```sql
SELECT u.email, ur.role 
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
WHERE u.email LIKE '%@test.com';
```

**ถ้าไม่มี roles**: รัน script 114 อีกครั้ง

### ตรวจสอบ 3: ตรวจสอบ profiles

```sql
SELECT email, full_name, club_id 
FROM profiles 
WHERE email LIKE '%@test.com';
```

**ถ้าไม่มี profiles**: รัน script 114 อีกครั้ง

## Browser Console Errors

ถ้าเห็น error ใน browser console:

1. **"Invalid login credentials"**
   - ตรวจสอบ email/password ถูกต้อง
   - ตรวจสอบ user มีอยู่ในระบบ
   - ตรวจสอบ email_confirmed_at ไม่ null

2. **"User not found"**
   - รัน script 112 เพื่อสร้าง users

3. **"No role assigned"**
   - รัน script 114 เพื่อสร้าง roles

## Quick Fix (ถ้ารีบ)

```bash
# รัน script ทั้งหมดตามลำดับ
./scripts/run-sql-via-api.sh scripts/112-create-demo-users-for-badminton.sql && \
./scripts/run-sql-via-api.sh scripts/110-create-badminton-demo.sql && \
./scripts/run-sql-via-api.sh scripts/111-create-demo-badminton-athletes.sql && \
./scripts/run-sql-via-api.sh scripts/114-complete-demo-setup.sql
```

## ตรวจสอบ Final

ถ้าทุกอย่างถูกต้อง ควรเห็น:

```
✅ 6 demo users created
✅ All users have roles (admin, coach, athlete)
✅ All users have profiles
✅ All users in Test Sports Club
✅ Demo credentials buttons work
✅ Auto-fill works
✅ Login successful
```

## Support

ถ้ายังมีปัญหา:
1. ตรวจสอบ browser console
2. ตรวจสอบ server logs
3. ตรวจสอบ Supabase dashboard
4. ตรวจสอบ environment variables

---

**Status**: ✅ Demo Credentials Fixed
**Last Updated**: November 28, 2025
