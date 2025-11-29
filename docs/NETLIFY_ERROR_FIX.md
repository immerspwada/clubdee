# Netlify Deployment Error Fix

## ❌ Error: "Application error: a server-side exception has occurred"

### สาเหตุ

Error นี้เกิดจากปัญหาต่อไปนี้:
1. **Environment variables ไม่ถูกต้อง** - Supabase credentials ผิด
2. **Supabase URL ไม่ถูกต้อง** - ใช้ localhost แทน production URL
3. **Missing environment variables** - ตัวแปรบางตัวไม่ได้ตั้งค่า
4. **Database connection failed** - ไม่สามารถเชื่อมต่อ Supabase

---

## ✅ วิธีแก้ไข

### Step 1: ตรวจสอบ Environment Variables ใน Netlify

1. ไปที่ **Netlify Dashboard**
2. เลือก Site → **Site settings**
3. ไปที่ **Build & deploy** → **Environment**
4. ตรวจสอบตัวแปรต่อไปนี้:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
SUPABASE_ACCESS_TOKEN=sbp_xxx...
NEXT_PUBLIC_APP_URL=https://club-dee.netlify.app
NODE_ENV=production
```

### Step 2: ตรวจสอบ .env.local ในเครื่อง

```bash
cd sports-club-management
cat .env.local
```

ตรวจสอบว่า:
- ✅ `NEXT_PUBLIC_SUPABASE_URL` ไม่ใช่ localhost
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` มีค่า
- ✅ `SUPABASE_SERVICE_ROLE_KEY` มีค่า
- ✅ `SUPABASE_ACCESS_TOKEN` มีค่า

### Step 3: ตรวจสอบ Supabase Project

1. ไปที่ **Supabase Dashboard**
2. ไปที่ **Settings** → **API**
3. ตรวจสอบ:
   - ✅ Project URL ถูกต้อง
   - ✅ Anon Key ถูกต้อง
   - ✅ Service Role Key ถูกต้อง

### Step 4: ตรวจสอบ Netlify Build Logs

1. ไปที่ **Netlify Dashboard**
2. ไปที่ **Deploys**
3. เลือก deploy ล่าสุด
4. ดู **Deploy log** เพื่อหา error message

**ค้นหา error ที่เกี่ยวข้อง:**
```
- "Cannot find module"
- "ECONNREFUSED"
- "Invalid Supabase URL"
- "Unauthorized"
- "ENOTFOUND"
```

---

## 🔧 Common Fixes

### Fix 1: Update Environment Variables

```bash
# 1. ไปที่ Netlify Dashboard
# 2. Site settings → Environment
# 3. Edit variables

# ตรวจสอบว่า URL ไม่มี trailing slash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co  # ✅ ถูก
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co/ # ❌ ผิด

# 4. Save และ Redeploy
```

### Fix 2: Redeploy Site

```bash
# ไปที่ Netlify Dashboard
# Deploys → Trigger deploy → Deploy site
```

### Fix 3: Clear Build Cache

```bash
# ไปที่ Netlify Dashboard
# Site settings → Build & deploy → Build cache
# Click "Clear cache and deploy site"
```

### Fix 4: Check Node Version

```bash
# ไปที่ Netlify Dashboard
# Site settings → Build & deploy → Environment
# ตรวจสอบ NODE_VERSION = 18 หรือ 20
```

---

## 🧪 ทดสอบ Local Build

```bash
cd sports-club-management

# 1. ตรวจสอบ environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# 2. Build locally
npm run build

# 3. ถ้า build สำเร็จ ปัญหาอยู่ที่ Netlify environment
# ถ้า build ล้มเหลว ปัญหาอยู่ที่ code
```

---

## 📋 Netlify Environment Variables Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - ตั้งค่าแล้ว
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - ตั้งค่าแล้ว
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - ตั้งค่าแล้ว
- [ ] `SUPABASE_ACCESS_TOKEN` - ตั้งค่าแล้ว
- [ ] `NEXT_PUBLIC_APP_URL` - ตั้งค่าแล้ว
- [ ] `NODE_ENV=production` - ตั้งค่าแล้ว
- [ ] Build command: `npm run build` - ถูกต้อง
- [ ] Publish directory: `.next` - ถูกต้อง

---

## 🔍 Debugging Steps

### Step 1: Check Netlify Build Logs

```
1. ไปที่ Netlify Dashboard
2. Deploys → เลือก deploy ล่าสุด
3. ดู "Deploy log"
4. ค้นหา error message
```

### Step 2: Check Supabase Status

```bash
# ตรวจสอบว่า Supabase project active
# ไปที่ Supabase Dashboard
# ตรวจสอบ project status
```

### Step 3: Test API Connection

```bash
# ทดสอบการเชื่อมต่อ Supabase
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
  https://xxx.supabase.co/rest/v1/profiles?limit=1
```

### Step 4: Check Browser Console

```
1. ไปที่ https://club-dee.netlify.app
2. เปิด DevTools (F12)
3. ดู Console tab
4. ค้นหา error messages
```

---

## 🚀 Complete Fix Process

```bash
# 1. ตรวจสอบ local build
cd sports-club-management
npm run build

# 2. ถ้า build สำเร็จ:
#    - ไปที่ Netlify Dashboard
#    - Site settings → Environment
#    - ตรวจสอบ environment variables
#    - Redeploy

# 3. ถ้า build ล้มเหลว:
#    - ตรวจสอบ error message
#    - แก้ไข code
#    - Push ไป GitHub
#    - Netlify จะ auto deploy
```

---

## 📞 Support

### ถ้ายังไม่ได้:

1. **ตรวจสอบ Netlify Logs**
   - ไปที่ Deploys → Deploy log
   - ค้นหา error message

2. **ตรวจสอบ Supabase**
   - ไปที่ Supabase Dashboard
   - ตรวจสอบ project active
   - ตรวจสอบ API keys

3. **ตรวจสอบ Code**
   - รัน `npm run build` locally
   - ตรวจสอบ error messages
   - แก้ไข code

4. **Netlify Support**
   - ไปที่ Netlify Support
   - ให้ Digest: 1399241998
   - ให้ Deploy log

---

## ✅ Verification

ถ้าแก้ไขสำเร็จ:

```
✅ https://club-dee.netlify.app ทำงาน
✅ Login page แสดง
✅ Demo credentials buttons ทำงาน
✅ Database connection สำเร็จ
✅ No error in console
```

---

**Status**: 🔧 Troubleshooting Guide
**Last Updated**: November 28, 2025
**Error Code**: 1399241998
