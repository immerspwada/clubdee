# 🚀 Production Deployment Guide

คู่มือการ deploy ระบบสมัครสมาชิกสโมสรกีฬาสู่ production

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
```bash
# ตรวจสอบว่ามี env variables ครบ
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
SUPABASE_ACCESS_TOKEN=sbp_xxx...
NEXT_PUBLIC_APP_URL=https://yourdomain.com  # เปลี่ยนเป็น production URL
```

### 2. Database Migrations
```bash
# รัน migrations ทั้งหมด
cd sports-club-management
./scripts/auto-migrate.sh

# หรือรันทีละไฟล์
./scripts/run-sql-via-api.sh scripts/27-create-membership-applications.sql
./scripts/run-sql-via-api.sh scripts/28-membership-applications-rls.sql
```

### 3. Test Data (Optional)
```bash
# สร้าง test clubs และ users สำหรับทดสอบ
./scripts/run-sql-via-api.sh scripts/03-setup-test-data.sql
```

---

## 📧 Email Configuration (REQUIRED for Production)

### Option 1: SendGrid (แนะนำ - มี Free Tier)

#### 1.1 สมัคร SendGrid
1. ไปที่: https://sendgrid.com/
2. สมัครบัญชี (Free tier: 100 emails/day)
3. Verify email address
4. สร้าง API Key:
   - Settings → API Keys → Create API Key
   - เลือก "Full Access"
   - คัดลอก API Key (จะแสดงครั้งเดียว!)

#### 1.2 ตั้งค่าใน Supabase
1. ไปที่ Supabase Dashboard:
   ```
   https://ettpbpznktyttpnyqhkr.supabase.co
   ```

2. Navigate to:
   ```
   Authentication → Settings → SMTP Settings
   ```

3. กรอกข้อมูล:
   ```
   Enable Custom SMTP: ON
   
   Host: smtp.sendgrid.net
   Port: 587
   Username: apikey
   Password: <your-sendgrid-api-key>
   
   Sender Email: noreply@yourdomain.com
   Sender Name: ชื่อสโมสรกีฬา
   ```

4. กด "Save"

5. Test Email:
   - กด "Send test email"
   - ใส่อีเมลของคุณ
   - ตรวจสอบว่าได้รับอีเมล

#### 1.3 Verify Sender Email (สำคัญ!)
SendGrid ต้องการ verify sender email:

1. ไปที่ SendGrid Dashboard
2. Settings → Sender Authentication
3. เลือก "Single Sender Verification"
4. กรอกข้อมูล sender (noreply@yourdomain.com)
5. Verify email ที่ SendGrid ส่งมา

---

### Option 2: AWS SES (สำหรับ Production ขนาดใหญ่)

#### 2.1 Setup AWS SES
1. ไปที่ AWS Console
2. เปิด SES (Simple Email Service)
3. Verify domain หรือ email address
4. สร้าง SMTP credentials:
   - SMTP Settings → Create SMTP Credentials
   - คัดลอก Username และ Password

#### 2.2 ตั้งค่าใน Supabase
```
Enable Custom SMTP: ON

Host: email-smtp.us-east-1.amazonaws.com  # เปลี่ยนตาม region
Port: 587
Username: <aws-smtp-username>
Password: <aws-smtp-password>

Sender Email: noreply@yourdomain.com
Sender Name: ชื่อสโมสรกีฬา
```

#### 2.3 Request Production Access
AWS SES เริ่มต้นอยู่ใน Sandbox mode:
1. ไปที่ SES Console
2. Account Dashboard → Request production access
3. กรอกแบบฟอร์ม (use case, expected volume)
4. รอ approval (1-2 วัน)

---

### Option 3: Gmail SMTP (สำหรับทดสอบเท่านั้น)

⚠️ **ไม่แนะนำสำหรับ production** (มี rate limit ต่ำ)

```
Enable Custom SMTP: ON

Host: smtp.gmail.com
Port: 587
Username: your-email@gmail.com
Password: <app-password>  # ไม่ใช่รหัสผ่านปกติ!

Sender Email: your-email@gmail.com
Sender Name: ชื่อสโมสรกีฬา
```

**สร้าง App Password:**
1. ไปที่ Google Account Settings
2. Security → 2-Step Verification (ต้องเปิดก่อน)
3. App passwords → Generate
4. เลือก "Mail" และ "Other"
5. คัดลอก password 16 หลัก

---

## 🔐 Enable Email Confirmation

### 1. เปิด Email Confirmation
1. ไปที่ Supabase Dashboard
2. Authentication → Settings → Email Auth
3. เปิด "Confirm email": **ON**
4. กด "Save"

### 2. ตั้งค่า Email Templates (Optional)

Customize email templates:
1. Authentication → Email Templates
2. แก้ไข "Confirm signup" template:

```html
<h2>ยืนยันอีเมลของคุณ</h2>
<p>ขอบคุณที่สมัครสมาชิกกับเรา</p>
<p>กรุณายืนยันอีเมลโดยกรอกรหัส OTP นี้:</p>
<h1>{{ .Token }}</h1>
<p>รหัสนี้จะหมดอายุใน 10 นาที</p>
```

3. กด "Save"

---

## 🌐 Deploy to Vercel

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
cd sports-club-management

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 4. Set Environment Variables
```bash
# ตั้งค่า env variables ใน Vercel Dashboard
# หรือใช้ CLI:

vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add SUPABASE_ACCESS_TOKEN
vercel env add NEXT_PUBLIC_APP_URL
```

### 5. Update Callback URLs
ใน Supabase Dashboard:
1. Authentication → URL Configuration
2. เพิ่ม production URLs:
   ```
   Site URL: https://yourdomain.com
   Redirect URLs:
   - https://yourdomain.com/auth/callback
   - https://yourdomain.com/auth/verify-otp
   ```

---

## 🧪 Testing Production

### 1. Test Registration Flow
```bash
# 1. ไปที่ production URL
https://yourdomain.com/register

# 2. สมัครด้วยอีเมลจริง
Email: test@yourdomain.com
Password: Test1234

# 3. ตรวจสอบอีเมล
# ควรได้รับ OTP 6 หลัก

# 4. ยืนยัน OTP
https://yourdomain.com/auth/verify-otp

# 5. Login
https://yourdomain.com/login
```

### 2. Test Membership Application
```bash
# 1. Login แล้วไปที่
https://yourdomain.com/register-membership

# 2. กรอกข้อมูลและอัปโหลดเอกสาร

# 3. ส่งใบสมัคร

# 4. ตรวจสอบที่
https://yourdomain.com/dashboard/athlete/applications
```

### 3. Test Coach Approval
```bash
# 1. Login ด้วย coach account

# 2. ไปที่
https://yourdomain.com/dashboard/coach/applications

# 3. ดูใบสมัครและอนุมัติ

# 4. ตรวจสอบว่า athlete profile ถูกสร้าง
```

---

## 📊 Monitoring

### 1. Supabase Dashboard
Monitor:
- Authentication → Users (จำนวน users)
- Database → Tables (ข้อมูลใน tables)
- Storage → Buckets (เอกสารที่อัปโหลด)
- Logs → Edge Functions (errors)

### 2. Vercel Dashboard
Monitor:
- Analytics → Page views
- Logs → Function logs
- Speed Insights → Performance

### 3. Email Delivery
Monitor:
- SendGrid Dashboard → Activity
- AWS SES → Sending Statistics
- ตรวจสอบ bounce rate และ complaint rate

---

## 🔧 Troubleshooting

### ปัญหา: ไม่ได้รับอีเมล OTP

**แก้ไข:**
1. ตรวจสอบ SMTP settings ใน Supabase
2. ตรวจสอบ spam folder
3. Verify sender email ใน email provider
4. ดู logs ใน Supabase Dashboard → Logs

### ปัญหา: OTP หมดอายุเร็วเกินไป

**แก้ไข:**
1. ไปที่ Supabase Dashboard
2. Authentication → Settings → Email Auth
3. เพิ่ม "OTP Expiry" เป็น 600 seconds (10 นาที)

### ปัญหา: Rate limit exceeded

**แก้ไข:**
1. SendGrid: Upgrade plan
2. AWS SES: Request production access
3. Gmail: เปลี่ยนเป็น SendGrid หรือ AWS SES

### ปัญหา: Email ถูกส่งไป spam

**แก้ไข:**
1. Setup SPF record:
   ```
   v=spf1 include:sendgrid.net ~all
   ```

2. Setup DKIM (ใน SendGrid/AWS SES)

3. Setup DMARC:
   ```
   v=DMARC1; p=none; rua=mailto:admin@yourdomain.com
   ```

---

## 📝 Post-Deployment Checklist

- [ ] ✅ SMTP provider ตั้งค่าเรียบร้อย
- [ ] ✅ Email confirmation เปิดใช้งาน
- [ ] ✅ Test email ส่งได้
- [ ] ✅ Sender email verified
- [ ] ✅ Environment variables ตั้งค่าครบ
- [ ] ✅ Database migrations รันเสร็จ
- [ ] ✅ Callback URLs อัปเดตแล้ว
- [ ] ✅ Test registration flow สำเร็จ
- [ ] ✅ Test membership application สำเร็จ
- [ ] ✅ Test coach approval สำเร็จ
- [ ] ✅ Monitoring setup เรียบร้อย
- [ ] ✅ Backup strategy กำหนดแล้ว

---

## 🎯 Performance Optimization

### 1. Enable Caching
```typescript
// lib/utils/cache.ts already implemented
// Cache queries for 5 minutes
```

### 2. Optimize Images
```bash
# ใช้ Next.js Image component
import Image from 'next/image'
```

### 3. Enable Compression
```javascript
// next.config.ts
module.exports = {
  compress: true,
}
```

### 4. Database Indexes
```sql
-- Already created in migrations
-- Verify with:
SELECT * FROM pg_indexes WHERE tablename = 'membership_applications';
```

---

## 🔒 Security Checklist

- [ ] ✅ RLS policies enabled
- [ ] ✅ Service role key ไม่ถูก expose
- [ ] ✅ HTTPS only (Vercel default)
- [ ] ✅ CORS configured correctly
- [ ] ✅ Rate limiting enabled
- [ ] ✅ Input validation on client and server
- [ ] ✅ File upload size limits
- [ ] ✅ SQL injection prevention (parameterized queries)
- [ ] ✅ XSS prevention (React default)

---

## 📚 Additional Resources

**Supabase:**
- Docs: https://supabase.com/docs
- Email Auth: https://supabase.com/docs/guides/auth/auth-email

**SendGrid:**
- Docs: https://docs.sendgrid.com/
- API Reference: https://docs.sendgrid.com/api-reference

**AWS SES:**
- Docs: https://docs.aws.amazon.com/ses/
- SMTP Settings: https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html

**Vercel:**
- Docs: https://vercel.com/docs
- Environment Variables: https://vercel.com/docs/environment-variables

---

## ✅ Summary

**Development:**
- ปิด email confirmation
- ใช้ test accounts
- ไม่ต้องตั้งค่า SMTP

**Production:**
- เปิด email confirmation
- ตั้งค่า SMTP provider (SendGrid/AWS SES)
- Verify sender email
- Test email delivery
- Monitor logs

**ระบบพร้อม deploy! 🚀**
