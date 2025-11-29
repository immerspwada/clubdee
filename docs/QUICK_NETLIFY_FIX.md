# Quick Netlify Fix - 5 Minutes

## 🚨 Error: "Application error: a server-side exception has occurred"

### ⚡ Quick Fix (ทำตามลำดับ)

#### 1️⃣ ตรวจสอบ Environment Variables (2 min)

```bash
# ไปที่ Netlify Dashboard
# Site settings → Build & deploy → Environment

# ตรวจสอบว่ามี 6 ตัวแปรนี้:
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ SUPABASE_ACCESS_TOKEN
✅ NEXT_PUBLIC_APP_URL
✅ NODE_ENV=production
```

#### 2️⃣ ตรวจสอบ URL ไม่มี Trailing Slash (1 min)

```
❌ https://xxx.supabase.co/
✅ https://xxx.supabase.co
```

#### 3️⃣ Redeploy (2 min)

```
1. ไปที่ Netlify Dashboard
2. Deploys → Trigger deploy → Deploy site
3. รอ deploy เสร็จ
```

---

## 🔍 ถ้ายังไม่ได้

### Check Build Logs

```
1. Netlify Dashboard
2. Deploys → เลือก deploy ล่าสุด
3. ดู "Deploy log"
4. ค้นหา error message
```

### Common Errors

| Error | Fix |
|-------|-----|
| `Cannot find module` | ตรวจสอบ dependencies |
| `ECONNREFUSED` | ตรวจสอบ Supabase URL |
| `Unauthorized` | ตรวจสอบ API keys |
| `ENOTFOUND` | ตรวจสอบ URL ถูกต้อง |

---

## 📋 Checklist

- [ ] Environment variables ตั้งค่าแล้ว
- [ ] URL ไม่มี trailing slash
- [ ] NODE_VERSION = 18 หรือ 20
- [ ] Build command = `npm run build`
- [ ] Publish directory = `.next`
- [ ] Redeploy สำเร็จ
- [ ] https://club-dee.netlify.app ทำงาน

---

## ✅ Success

```
✅ Login page แสดง
✅ Demo buttons ทำงาน
✅ No error in console
```

---

**Time**: 5 minutes
**Status**: Quick Fix Guide
