# Vercel Deployment Guide

## ขั้นตอนที่ 1: เตรียม GitHub Repository

### 1.1 สร้าง Repository ใหม่
```bash
# ไปที่ https://github.com/new
# ตั้งชื่อ: sports-club-management
# เลือก: Public (ถ้าต้องการให้ Vercel deploy ฟรี)
```

### 1.2 Push Code ไปยัง GitHub
```bash
cd sports-club-management

# ตั้งค่า remote (ครั้งแรกเท่านั้น)
git remote add origin https://github.com/YOUR_USERNAME/sports-club-management.git

# ตรวจสอบ status
git status

# Commit changes
git add .
git commit -m "Initial commit: Sports Club Management System"

# Push ไปยัง GitHub
git push -u origin main
```

---

## ขั้นตอนที่ 2: Connect Vercel

### 2.1 ไปที่ Vercel Dashboard
1. ไปที่ https://vercel.com
2. Sign in ด้วย GitHub account
3. Click **"Add New"** → **"Project"**

### 2.2 Import Repository
1. เลือก **"Import Git Repository"**
2. ค้นหา `sports-club-management`
3. Click **"Import"**

### 2.3 Configure Project
- **Project Name**: `sports-club-management`
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)

---

## ขั้นตอนที่ 3: Set Environment Variables

### 3.1 ไปที่ Settings
1. ใน Vercel Dashboard
2. Click **"Settings"**
3. ไปที่ **"Environment Variables"**

### 3.2 เพิ่ม Environment Variables

**Production Environment:**

```
NEXT_PUBLIC_SUPABASE_URL
Value: https://ettpbpznktyttpnyqhkr.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

SUPABASE_ACCESS_TOKEN
Value: sbp_78f4731f8c32250fe7f3d9344c5e4476e0a27a20

NEXT_PUBLIC_APP_URL
Value: https://sports-club-management.vercel.app

NODE_ENV
Value: production
```

### 3.3 Save Variables
- Click **"Save"**
- Vercel จะ redeploy อัตโนมัติ

---

## ขั้นตอนที่ 4: Deploy

### 4.1 Automatic Deploy
- Vercel จะ deploy อัตโนมัติเมื่อ push ไปยัง GitHub
- ดูสถานะใน Vercel Dashboard

### 4.2 Manual Deploy
```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy ไปยัง Production
vercel --prod
```

---

## ✅ Verify Deployment

### 1. Check Build Status
- ไปที่ Vercel Dashboard
- ดูสถานะ deployment
- ต้องเห็น "Deployment successful"

### 2. Test Website
```
https://sports-club-management.vercel.app
```

### 3. Test Login
- Email: demo.admin@example.com
- Password: Demo123456!

### 4. Check Logs
- ไปที่ **"Deployments"**
- Click deployment ล่าสุด
- ดู **"Logs"** tab

---

## 🔧 Troubleshooting

### Build Failed
**Error**: `npm ERR! code ERESOLVE`

**Solution**:
```bash
# ลบ node_modules และ package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Push ไปยัง GitHub
git add .
git commit -m "Fix: reinstall dependencies"
git push
```

### Environment Variables Not Working
**Error**: `NEXT_PUBLIC_SUPABASE_URL is undefined`

**Solution**:
1. ตรวจสอบ variable names ตรงกันหรือไม่
2. ตรวจสอบ values ไม่มี spaces
3. Redeploy หลังจากเพิ่ม variables

### Database Connection Failed
**Error**: `Failed to connect to Supabase`

**Solution**:
1. ตรวจสอบ SUPABASE_URL ถูกต้อง
2. ตรวจสอบ API keys ถูกต้อง
3. ตรวจสอบ Supabase project active

---

## 📊 Monitoring

### 1. View Deployments
- ไปที่ **"Deployments"** tab
- ดูประวัติ deployment ทั้งหมด

### 2. Check Performance
- ไปที่ **"Analytics"** tab
- ดู response time, errors, etc.

### 3. View Logs
- Click deployment
- ดู **"Logs"** tab
- ดู build logs และ runtime logs

---

## 🔄 Continuous Deployment

### Auto Deploy
- ทุกครั้งที่ push ไปยัง GitHub
- Vercel จะ build และ deploy อัตโนมัติ

### Preview Deployments
- ทุกครั้งที่สร้าง Pull Request
- Vercel จะสร้าง preview URL

### Production Deploy
- เมื่อ merge ไปยัง main branch
- Vercel จะ deploy ไปยัง production

---

## 💡 Best Practices

### 1. Use Environment Variables
- ไม่ต้อง commit secrets
- ใช้ Vercel Environment Variables

### 2. Monitor Deployments
- ตรวจสอบ logs หลังจาก deploy
- ตรวจสอบ errors ใน browser console

### 3. Test Before Deploy
```bash
# Build locally
npm run build

# Test build
npm run start
```

### 4. Keep Dependencies Updated
```bash
# Check for updates
npm outdated

# Update packages
npm update
```

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs

---

**Status**: ✅ Ready for Vercel Deployment
**Estimated Deploy Time**: ~5 minutes
**Site URL**: https://sports-club-management.vercel.app
