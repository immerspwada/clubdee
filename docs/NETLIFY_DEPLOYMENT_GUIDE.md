# Netlify Deployment Guide

## ✅ ใช่ Netlify ได้!

โปรเจค Sports Club Management เป็น Next.js ซึ่ง Netlify รองรับเต็มที่ สามารถ deploy ได้อย่างสมบูรณ์

## 📋 ข้อกำหนดเบื้องต้น

### 1. สิ่งที่ต้องมี
- GitHub/GitLab/Bitbucket account (เก็บ code)
- Netlify account (free หรือ paid)
- Supabase project (database)
- Environment variables

### 2. ตรวจสอบ Next.js Config
```bash
# ตรวจสอบว่า next.config.ts มีการตั้งค่า Netlify
cat sports-club-management/next.config.ts
```

## 🚀 ขั้นตอน Deploy

### Step 1: เตรียม GitHub Repository

```bash
# 1. สร้าง GitHub repository
# ไปที่ https://github.com/new

# 2. Clone repository ของคุณ
git clone https://github.com/YOUR_USERNAME/sports-club-management.git
cd sports-club-management

# 3. Add remote
git remote add origin https://github.com/YOUR_USERNAME/sports-club-management.git

# 4. Push code
git add .
git commit -m "Initial commit: Sports Club Management System"
git push -u origin main
```

### Step 2: เชื่อมต่อ Netlify

#### วิธีที่ 1: ผ่าน Netlify UI (ง่ายที่สุด)

1. ไปที่ https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. เลือก Git provider (GitHub/GitLab/Bitbucket)
4. เลือก repository `sports-club-management`
5. Click **"Deploy site"**

#### วิธีที่ 2: ผ่าน Netlify CLI

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Deploy
netlify deploy --prod
```

### Step 3: ตั้งค่า Environment Variables

1. ไปที่ Netlify Dashboard
2. เลือก Site → **Site settings** → **Build & deploy** → **Environment**
3. Click **"Edit variables"**
4. เพิ่ม environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
SUPABASE_ACCESS_TOKEN=sbp_xxx...
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
NODE_ENV=production
```

### Step 4: ตั้งค่า Build Settings

Netlify จะตรวจหา Next.js โดยอัตโนมัติ แต่ตรวจสอบ:

**Build command:**
```
npm run build
```

**Publish directory:**
```
.next
```

**Node version:**
```
18.x หรือ 20.x
```

## 📊 Build Configuration

### netlify.toml (Optional)

สร้างไฟล์ `netlify.toml` ในรูท:

```toml
[build]
  command = "npm run build"
  publish = ".next"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "20"
  NPM_VERSION = "10"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## 🔐 Environment Variables ที่ต้องการ

### จำเป็น (Required)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
SUPABASE_ACCESS_TOKEN=sbp_xxx...

# App
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
NODE_ENV=production
```

### ตัวเลือก (Optional)
```env
# Analytics
NEXT_PUBLIC_GA_ID=G-xxx

# Feature Flags
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] All environment variables set
- [ ] Build command tested locally
- [ ] No console errors
- [ ] Database migrations ready

### During Deployment
- [ ] Monitor build logs
- [ ] Check for build errors
- [ ] Verify environment variables loaded
- [ ] Test API connections

### Post-Deployment
- [ ] Test login page
- [ ] Test demo credentials
- [ ] Verify database connection
- [ ] Check all features work
- [ ] Monitor error logs

## 🧪 Testing After Deploy

### 1. ทดสอบ Login Page
```
https://your-site.netlify.app/login
```

### 2. ทดสอบ Demo Credentials
- Click "ข้อมูลทดสอบ"
- ลองกด demo account buttons
- ตรวจสอบ auto-fill ทำงาน

### 3. ทดสอบ Features
- [ ] Login/Logout
- [ ] Dashboard access
- [ ] Create session
- [ ] Check in
- [ ] View announcements
- [ ] Submit leave request

## 🐛 Troubleshooting

### Build Failed

**Error: "Cannot find module"**
```bash
# Solution: ตรวจสอบ dependencies
npm install
npm run build
```

**Error: "ENOSPC: no space left"**
```bash
# Solution: ลบ node_modules และ .next
rm -rf node_modules .next
npm install
npm run build
```

### Environment Variables Not Loading

```bash
# ตรวจสอบ:
1. ไปที่ Site settings → Environment
2. ตรวจสอบตัวแปรถูกตั้งค่า
3. Redeploy site
4. ตรวจสอบ build logs
```

### Database Connection Failed

```bash
# ตรวจสอบ:
1. SUPABASE_URL ถูกต้อง
2. SUPABASE_ANON_KEY ถูกต้อง
3. Supabase project active
4. Network access allowed
```

### Login Not Working

```bash
# ตรวจสอบ:
1. NEXT_PUBLIC_SUPABASE_URL ถูกต้อง
2. NEXT_PUBLIC_SUPABASE_ANON_KEY ถูกต้อง
3. Demo users exist in database
4. Browser console for errors
```

## 📈 Performance Optimization

### 1. Enable Caching
```toml
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 2. Enable Compression
Netlify ทำให้อัตโนมัติ

### 3. Monitor Performance
- ไปที่ Analytics tab
- ตรวจสอบ build times
- ตรวจสอบ deploy frequency

## 🔄 Continuous Deployment

### Auto Deploy on Push
1. ไปที่ Site settings → Build & deploy
2. Deploy settings ตั้งค่าให้ auto deploy
3. ทุกครั้งที่ push ไป main branch จะ deploy อัตโนมัติ

### Preview Deploys
- ทุก Pull Request จะได้ preview URL
- ทดสอบก่อน merge

## 📊 Monitoring

### Netlify Analytics
- ไปที่ Analytics tab
- ดู build times
- ดู deploy history
- ดู error logs

### Error Tracking
```bash
# ตรวจสอบ logs
1. ไปที่ Deploys
2. เลือก deploy ล่าสุด
3. ดู Deploy log
4. ดู Function log
```

## 🚀 Advanced Features

### Serverless Functions
```bash
# สร้าง function
mkdir -p netlify/functions
touch netlify/functions/api.js
```

### Form Handling
```toml
[[redirects]]
  from = "/api/submit-form"
  to = "/.netlify/functions/submit-form"
  status = 200
```

### Webhooks
- ตั้งค่า GitHub webhooks
- Auto deploy on push
- Slack notifications

## 💰 Pricing

### Netlify Plans
- **Free**: 300 build minutes/month, 100GB bandwidth
- **Pro**: $19/month, unlimited builds
- **Business**: Custom pricing

### สำหรับโปรเจคนี้
- Free plan เพียงพอสำหรับ development
- Pro plan สำหรับ production

## 📚 Resources

- [Netlify Docs](https://docs.netlify.com)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/overview/)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
- [Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)

## ✨ Quick Deploy Summary

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Netlify
# ไปที่ https://app.netlify.com
# Import from GitHub

# 3. Set Environment Variables
# ไปที่ Site settings → Environment

# 4. Deploy
# Netlify จะ auto deploy

# 5. Test
# https://your-site.netlify.app
```

## 🎯 Next Steps

1. ✅ สร้าง GitHub repository
2. ✅ Push code ไป GitHub
3. ✅ Connect Netlify
4. ✅ Set environment variables
5. ✅ Deploy
6. ✅ Test features
7. ✅ Monitor performance

---

**Status**: ✅ Ready for Netlify Deployment
**Framework**: Next.js 14+
**Database**: Supabase
**Hosting**: Netlify
**Build Time**: ~3-5 minutes
**Deploy Time**: ~1-2 minutes
