# Netlify Environment Variables Setup Guide

## 📍 ตำแหน่ง: /configuration/env#environment-variables

ผมจะแนะนำคุณทีละขั้นตอนในการตั้งค่า environment variables ใน Netlify

---

## 🎯 ขั้นตอนที่ 1: ไปที่หน้า Environment Variables

1. ที่หน้า `/configuration/env#environment-variables`
2. ดูส่วน **Environment variables**
3. ค้นหาปุ่ม **"Edit variables"** หรือ **"Add a variable"**

---

## 📝 ขั้นตอนที่ 2: เพิ่ม Environment Variables

### ตัวแปรที่ต้องเพิ่ม (6 ตัว)

#### 1️⃣ NEXT_PUBLIC_SUPABASE_URL
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://ettpbpznktyttpnyqhkr.supabase.co
```
⚠️ **สำคัญ**: ไม่มี trailing slash `/`

#### 2️⃣ NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0dHBicHpua3R5dHRwbnlxaGtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3Mjg5NDUsImV4cCI6MjA3OTMwNDk0NX0.E8t16CxeSpYPaXjGZqsGsZKEsmD1U9PtYi3N70Q_EIs
```

#### 3️⃣ SUPABASE_SERVICE_ROLE_KEY
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0dHBicHpua3R5dHRwbnlxaGtyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzcyODk0NSwiZXhwIjoyMDc5MzA0OTQ1fQ.TS_xC9IHHALfALVsMGBtiGv7R5fL_hHkfZlZzlOZCo8
```

#### 4️⃣ SUPABASE_ACCESS_TOKEN
```
Key: SUPABASE_ACCESS_TOKEN
Value: sbp_78f4731f8c32250fe7f3d9344c5e4476e0a27a20
```

#### 5️⃣ NEXT_PUBLIC_APP_URL
```
Key: NEXT_PUBLIC_APP_URL
Value: https://club-dee.netlify.app
```

#### 6️⃣ NODE_ENV
```
Key: NODE_ENV
Value: production
```

---

## 🖱️ ขั้นตอนที่ 3: เพิ่มตัวแปรทีละตัว

### สำหรับแต่ละตัวแปร:

1. **Click "Add a variable"** หรือ **"Edit variables"**
2. **ใส่ Key** (ชื่อตัวแปร)
3. **ใส่ Value** (ค่าของตัวแปร)
4. **Click "Save"** หรือ **"Add"**
5. **ทำซ้ำ** สำหรับตัวแปรถัดไป

---

## ✅ ขั้นตอนที่ 4: ตรวจสอบว่าเพิ่มครบแล้ว

ตรวจสอบว่ามี 6 ตัวแปรนี้:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `SUPABASE_ACCESS_TOKEN`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `NODE_ENV`

---

## 🚀 ขั้นตอนที่ 5: Redeploy Site

1. ไปที่ **Deploys** tab
2. Click **"Trigger deploy"**
3. เลือก **"Deploy site"**
4. รอ deploy เสร็จ (ประมาณ 3-5 นาที)

---

## 🔍 ขั้นตอนที่ 6: ตรวจสอบว่า Deploy สำเร็จ

1. รอ deploy เสร็จ
2. ไปที่ https://club-dee.netlify.app
3. ตรวจสอบว่า:
   - ✅ Login page แสดง
   - ✅ Demo buttons ทำงาน
   - ✅ ไม่มี error

---

## 📋 Checklist

### ก่อนเพิ่ม Variables
- [ ] อยู่ที่หน้า `/configuration/env#environment-variables`
- [ ] เห็นส่วน "Environment variables"
- [ ] เห็นปุ่ม "Add a variable" หรือ "Edit variables"

### ขณะเพิ่ม Variables
- [ ] เพิ่ม NEXT_PUBLIC_SUPABASE_URL
- [ ] เพิ่ม NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] เพิ่ม SUPABASE_SERVICE_ROLE_KEY
- [ ] เพิ่ม SUPABASE_ACCESS_TOKEN
- [ ] เพิ่ม NEXT_PUBLIC_APP_URL
- [ ] เพิ่ม NODE_ENV

### หลังเพิ่ม Variables
- [ ] ทั้ง 6 ตัวแปรแสดงในรายการ
- [ ] ไม่มี error messages
- [ ] Redeploy site
- [ ] Deploy สำเร็จ

---

## 🎯 ผลลัพธ์ที่คาดหวัง

ถ้าทำถูกต้อง:

```
✅ https://club-dee.netlify.app ทำงาน
✅ Login page แสดง
✅ Demo credentials buttons ทำงาน
✅ ไม่มี "Application error"
✅ Database connection สำเร็จ
```

---

## ⚠️ Common Mistakes

| ❌ ผิด | ✅ ถูก |
|-------|-------|
| `https://xxx.supabase.co/` | `https://xxx.supabase.co` |
| ลืมเพิ่ม SUPABASE_ACCESS_TOKEN | เพิ่มทั้ง 6 ตัว |
| ใส่ค่าผิด | Copy-paste จากเอกสารนี้ |
| ไม่ redeploy | Redeploy หลังเพิ่ม variables |

---

## 🆘 ถ้ายังไม่ได้

### ตรวจสอบ:
1. ทั้ง 6 ตัวแปรเพิ่มแล้ว?
2. ค่าถูกต้องหรือไม่?
3. Redeploy แล้วหรือไม่?
4. Deploy สำเร็จหรือไม่?

### ดู Deploy Logs:
1. ไปที่ **Deploys**
2. เลือก deploy ล่าสุด
3. ดู **Deploy log**
4. ค้นหา error messages

---

## 📞 Support

ถ้ายังมีปัญหา:
1. ตรวจสอบ environment variables ครบ 6 ตัว
2. ตรวจสอบค่าถูกต้อง
3. ดู deploy logs
4. ลอง redeploy อีกครั้ง

---

**Status**: ✅ Environment Variables Setup Guide
**Last Updated**: November 28, 2025
**Location**: /configuration/env#environment-variables
