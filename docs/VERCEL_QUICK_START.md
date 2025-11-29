# Vercel Quick Start - 5 นาที

## 🚀 ขั้นตอนด่วน

### 1️⃣ Push ไปยัง GitHub (2 นาที)
```bash
cd sports-club-management
git add .
git commit -m "Deploy to Vercel"
git push -u origin main
```

### 2️⃣ Import ไปยัง Vercel (1 นาที)
1. ไปที่ https://vercel.com
2. Click **"Add New"** → **"Project"**
3. เลือก `sports-club-management`
4. Click **"Import"**

### 3️⃣ Set Environment Variables (1 นาที)
ใน Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://ettpbpznktyttpnyqhkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ACCESS_TOKEN=sbp_78f4731f8c32250fe7f3d9344c5e4476e0a27a20
NEXT_PUBLIC_APP_URL=https://sports-club-management.vercel.app
NODE_ENV=production
```

### 4️⃣ Deploy (1 นาที)
- Vercel จะ deploy อัตโนมัติ
- รอให้ build เสร็จ (~2-3 นาที)
- ดูสถานะใน Dashboard

---

## ✅ ทดสอบ

```
https://sports-club-management.vercel.app
```

**Demo Login:**
- Email: demo.admin@example.com
- Password: Demo123456!

---

## 📚 เอกสารเพิ่มเติม

- `VERCEL_DEPLOYMENT_GUIDE.md` - คำแนะนำเต็ม
- `VERCEL_DEPLOY_CHECKLIST.md` - Checklist
- `READY_FOR_VERCEL.md` - สถานะการเตรียม

---

**⏱️ เวลารวม**: ~5 นาที
**🎉 ผลลัพธ์**: Live on Vercel!
