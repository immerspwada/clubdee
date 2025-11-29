# Netlify Environment Variables - Visual Step-by-Step Guide

## 🎯 ตำแหน่ง: /configuration/env#environment-variables

---

## 📸 Step 1: ไปที่หน้า Environment Variables

```
Netlify Dashboard
    ↓
Site settings
    ↓
Build & deploy
    ↓
Environment
    ↓
Environment variables ← คุณอยู่ที่นี่
```

---

## 📸 Step 2: ดูส่วน Environment Variables

```
┌─────────────────────────────────────────┐
│ Environment variables                   │
├─────────────────────────────────────────┤
│                                         │
│ [Add a variable] [Edit variables]       │
│                                         │
│ Current variables:                      │
│ (ยังไม่มีตัวแปรใดๆ)                    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📸 Step 3: Click "Add a variable"

```
┌─────────────────────────────────────────┐
│ Add a new environment variable          │
├─────────────────────────────────────────┤
│                                         │
│ Key:   [________________]               │
│                                         │
│ Value: [________________]               │
│                                         │
│        [Save] [Cancel]                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📸 Step 4: เพิ่มตัวแปรแรก (NEXT_PUBLIC_SUPABASE_URL)

```
┌─────────────────────────────────────────┐
│ Add a new environment variable          │
├─────────────────────────────────────────┤
│                                         │
│ Key:   [NEXT_PUBLIC_SUPABASE_URL]       │
│                                         │
│ Value: [https://ettpbpznktyttpnyqhkr   │
│         .supabase.co]                   │
│                                         │
│        [Save] [Cancel]                  │
│                                         │
└─────────────────────────────────────────┘
```

⚠️ **สำคัญ**: ไม่มี trailing slash `/`

---

## 📸 Step 5: Click "Save"

```
✅ Variable saved!

NEXT_PUBLIC_SUPABASE_URL = https://ettpbpznktyttpnyqhkr.supabase.co
```

---

## 📸 Step 6: ทำซ้ำสำหรับตัวแปรถัดไป

```
Click "Add a variable" อีกครั้ง
    ↓
เพิ่ม NEXT_PUBLIC_SUPABASE_ANON_KEY
    ↓
Click "Save"
    ↓
ทำซ้ำสำหรับตัวแปรที่เหลือ
```

---

## 📋 ตัวแปรทั้ง 6 ตัว

### 1️⃣ NEXT_PUBLIC_SUPABASE_URL
```
Key:   NEXT_PUBLIC_SUPABASE_URL
Value: https://ettpbpznktyttpnyqhkr.supabase.co
```

### 2️⃣ NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Key:   NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0dHBicHpua3R5dHRwbnlxaGtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3Mjg5NDUsImV4cCI6MjA3OTMwNDk0NX0.E8t16CxeSpYPaXjGZqsGsZKEsmD1U9PtYi3N70Q_EIs
```

### 3️⃣ SUPABASE_SERVICE_ROLE_KEY
```
Key:   SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0dHBicHpua3R5dHRwbnlxaGtyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzcyODk0NSwiZXhwIjoyMDc5MzA0OTQ1fQ.TS_xC9IHHALfALVsMGBtiGv7R5fL_hHkfZlZzlOZCo8
```

### 4️⃣ SUPABASE_ACCESS_TOKEN
```
Key:   SUPABASE_ACCESS_TOKEN
Value: sbp_78f4731f8c32250fe7f3d9344c5e4476e0a27a20
```

### 5️⃣ NEXT_PUBLIC_APP_URL
```
Key:   NEXT_PUBLIC_APP_URL
Value: https://club-dee.netlify.app
```

### 6️⃣ NODE_ENV
```
Key:   NODE_ENV
Value: production
```

---

## 📸 Step 7: ตรวจสอบว่าเพิ่มครบแล้ว

```
┌─────────────────────────────────────────┐
│ Environment variables                   │
├─────────────────────────────────────────┤
│                                         │
│ ✅ NEXT_PUBLIC_SUPABASE_URL             │
│ ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY        │
│ ✅ SUPABASE_SERVICE_ROLE_KEY            │
│ ✅ SUPABASE_ACCESS_TOKEN                │
│ ✅ NEXT_PUBLIC_APP_URL                  │
│ ✅ NODE_ENV                             │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📸 Step 8: Redeploy Site

```
ไปที่ Deploys tab
    ↓
Click "Trigger deploy"
    ↓
เลือก "Deploy site"
    ↓
รอ deploy เสร็จ (3-5 นาที)
```

---

## 📸 Step 9: ตรวจสอบ Deploy Status

```
┌─────────────────────────────────────────┐
│ Deploys                                 │
├─────────────────────────────────────────┤
│                                         │
│ Latest deploy:                          │
│ ✅ Published (2 minutes ago)            │
│                                         │
│ Status: Success                         │
│ URL: https://club-dee.netlify.app      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📸 Step 10: ทดสอบ Website

```
ไปที่ https://club-dee.netlify.app
    ↓
ตรวจสอบ:
    ✅ Login page แสดง
    ✅ Demo buttons ทำงาน
    ✅ ไม่มี error
```

---

## ✅ Success!

```
🎉 Netlify deployment สำเร็จ!

✅ Environment variables ตั้งค่าแล้ว
✅ Site deployed
✅ Database connected
✅ Demo credentials ทำงาน
```

---

## 🆘 ถ้ายังไม่ได้

### ตรวจสอบ:
1. ทั้ง 6 ตัวแปรเพิ่มแล้ว?
2. ค่าถูกต้องหรือไม่?
3. Redeploy แล้วหรือไม่?

### ดู Deploy Logs:
```
Deploys
    ↓
เลือก deploy ล่าสุด
    ↓
ดู "Deploy log"
    ↓
ค้นหา error messages
```

---

**Status**: ✅ Visual Setup Guide
**Last Updated**: November 28, 2025
