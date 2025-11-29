# Netlify Environment Variables - Complete Values

## 📍 ตำแหน่ง: /configuration/env#environment-variables

---

## ✅ ตัวแปรที่ต้องเพิ่ม (6 ตัว)

### 1️⃣ NEXT_PUBLIC_SUPABASE_URL
```
Key:   NEXT_PUBLIC_SUPABASE_URL
Value: https://ettpbpznktyttpnyqhkr.supabase.co
```
⚠️ **สำคัญ**: ไม่มี trailing slash `/`

---

### 2️⃣ NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Key:   NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0dHBicHpua3R5dHRwbnlxaGtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3Mjg5NDUsImV4cCI6MjA3OTMwNDk0NX0.E8t16CxeSpYPaXjGZqsGsZKEsmD1U9PtYi3N70Q_EIs
```

---

### 3️⃣ SUPABASE_SERVICE_ROLE_KEY
```
Key:   SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0dHBicHpua3R5dHRwbnlxaGtyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzcyODk0NSwiZXhwIjoyMDc5MzA0OTQ1fQ.TS_xC9IHHALfALVsMGBtiGv7R5fL_hHkfZlZzlOZCo8
```

---

### 4️⃣ SUPABASE_ACCESS_TOKEN
```
Key:   SUPABASE_ACCESS_TOKEN
Value: sbp_78f4731f8c32250fe7f3d9344c5e4476e0a27a20
```

---

### 5️⃣ NEXT_PUBLIC_APP_URL
```
Key:   NEXT_PUBLIC_APP_URL
Value: https://club-dee.netlify.app
```

---

### 6️⃣ NODE_ENV
```
Key:   NODE_ENV
Value: production
```

---

## 📋 Copy-Paste Format

ถ้าต้องการ copy-paste ทั้งหมด:

```
NEXT_PUBLIC_SUPABASE_URL=https://ettpbpznktyttpnyqhkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0dHBicHpua3R5dHRwbnlxaGtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3Mjg5NDUsImV4cCI6MjA3OTMwNDk0NX0.E8t16CxeSpYPaXjGZqsGsZKEsmD1U9PtYi3N70Q_EIs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0dHBicHpua3R5dHRwbnlxaGtyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzcyODk0NSwiZXhwIjoyMDc5MzA0OTQ1fQ.TS_xC9IHHALfALVsMGBtiGv7R5fL_hHkfZlZzlOZCo8
SUPABASE_ACCESS_TOKEN=sbp_78f4731f8c32250fe7f3d9344c5e4476e0a27a20
NEXT_PUBLIC_APP_URL=https://club-dee.netlify.app
NODE_ENV=production
```

---

## 🎯 ขั้นตอนการเพิ่ม

### สำหรับแต่ละตัวแปร:

1. **ไปที่ Netlify Dashboard**
   - Site settings → Build & deploy → Environment

2. **Click "Add a variable"**

3. **ใส่ Key** (ชื่อตัวแปร)
   - เช่น: `NEXT_PUBLIC_SUPABASE_URL`

4. **ใส่ Value** (ค่าของตัวแปร)
   - Copy จากด้านบน

5. **Click "Save"**

6. **ทำซ้ำ** สำหรับตัวแปรถัดไป

---

## ✅ Checklist

- [ ] เพิ่ม NEXT_PUBLIC_SUPABASE_URL
- [ ] เพิ่ม NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] เพิ่ม SUPABASE_SERVICE_ROLE_KEY
- [ ] เพิ่ม SUPABASE_ACCESS_TOKEN
- [ ] เพิ่ม NEXT_PUBLIC_APP_URL
- [ ] เพิ่ม NODE_ENV

---

## 🚀 หลังเพิ่มเสร็จ

1. ไปที่ **Deploys** tab
2. Click **"Trigger deploy"**
3. เลือก **"Deploy site"**
4. รอ deploy เสร็จ

---

## ✨ ผลลัพธ์ที่คาดหวัง

```
✅ https://club-dee.netlify.app ทำงาน
✅ Login page แสดง
✅ Demo buttons ทำงาน
✅ ไม่มี error
```

---

**Status**: ✅ Complete Environment Variables
**Last Updated**: November 28, 2025
