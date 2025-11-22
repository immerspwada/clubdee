# วิธีรัน Migration ผ่าน Supabase Dashboard

เนื่องจาก CLI มีปัญหา connection ให้ใช้วิธีนี้แทน:

## ขั้นตอน:

### 1. เปิด Supabase SQL Editor

ไปที่: https://supabase.com/dashboard/project/erovdghgvhjdqcmulnfa/sql/new

### 2. Copy SQL Script

เปิดไฟล์ `sports-club-management/scripts/combined-migration.sql` และ copy เนื้อหาทั้งหมด

### 3. Paste และ Run

1. Paste SQL ลงใน SQL Editor
2. คลิกปุ่ม "Run" หรือกด `Cmd + Enter` (Mac) / `Ctrl + Enter` (Windows)
3. รอให้ script รันเสร็จ (ประมาณ 10-30 วินาที)

### 4. ตรวจสอบผลลัพธ์

หลังจากรันเสร็จ ให้ตรวจสอบว่า:

✅ **Tables ถูกสร้างแล้ว** - ไปที่ Table Editor ควรเห็น:
- user_roles
- clubs
- profiles
- sports
- teams
- team_members
- training_sessions
- attendance
- performance_metrics
- announcements
- audit_logs

✅ **Functions ถูกสร้างแล้ว** - ไปที่ Database > Functions ควรเห็น:
- auth.user_role()
- auth.is_admin()
- auth.is_coach()
- auth.is_athlete()
- auth.is_coach_of_team()
- auth.is_team_member()
- auth.user_club_id()
- update_updated_at_column()

✅ **RLS Policies ถูก Enable** - ไปที่ Authentication > Policies ควรเห็น policies สำหรับทุก table

### 5. ทดสอบ Connection

หลังจากรัน migration แล้ว ให้ทดสอบว่า Next.js app เชื่อมต่อได้:

\`\`\`bash
cd sports-club-management
npm run dev
\`\`\`

จากนั้นเปิด http://localhost:3000 และลองสมัครสมาชิก

---

## หมายเหตุ

- Script นี้ปลอดภัย สามารถรันซ้ำได้ (idempotent)
- ถ้ามี error ให้อ่าน error message และแก้ไข
- ถ้า table มีอยู่แล้ว จะได้ error "already exists" ซึ่งเป็นเรื่องปกติ

## ต้องการความช่วยเหลือ?

ถ้าพบปัญหา ให้ copy error message และถามได้เลย!
