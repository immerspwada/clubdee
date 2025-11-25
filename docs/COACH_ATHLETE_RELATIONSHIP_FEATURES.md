# ระบบความสัมพันธ์โค้ช-นักกีฬา

## ภาพรวม

ระบบนี้เพิ่มฟีเจอร์ที่ช่วยให้โค้ชและนักกีฬามีปฏิสัมพันธ์ที่ดีขึ้น ติดตามความก้าวหน้า และสร้างแรงจูงใจในการพัฒนา

## ฟีเจอร์ที่เพิ่มใหม่

### 1. ระบบ Feedback ส่วนบุคคล ✅

**สำหรับโค้ช:**
- เพิ่ม feedback ในการเข้าฝึกแต่ละครั้ง (attendance_logs.coach_feedback)
- เพิ่มโน้ตในผลการทดสอบ (performance_records.coach_notes)
- ให้คำแนะนำเฉพาะบุคคล

**สำหรับนักกีฬา:**
- เห็น feedback จากโค้ชในหน้าประวัติการเข้าฝึก
- เห็นโน้ตจากโค้ชในหน้าผลการทดสอบ
- เข้าใจจุดที่ต้องพัฒนาได้ชัดเจน

**Database Changes:**
```sql
-- attendance_logs
ALTER TABLE attendance_logs ADD COLUMN coach_feedback TEXT;

-- performance_records  
ALTER TABLE performance_records ADD COLUMN coach_notes TEXT;
```

**API Actions:**
- `addAttendanceFeedback(attendanceLogId, feedback)` - เพิ่ม feedback ในการเข้าฝึก
- `addPerformanceNotes(performanceRecordId, notes)` - เพิ่มโน้ตในผลทดสอบ

---

### 2. โปรไฟล์นักกีฬาแบบละเอียด ✅

**หน้าใหม่:** `/dashboard/coach/athletes/[id]`

**ข้อมูลที่แสดง:**
- ข้อมูลส่วนตัว (ชื่อ, อีเมล, เบอร์โทร, วันเกิด)
- สถิติโดยรวม (จำนวนครั้งเข้าฝึก, ผลทดสอบ, เป้าหมาย)
- เป้าหมายทั้งหมด (พร้อมความคืบหน้า)
- ผลการทดสอบล่าสุด 5 รายการ (พร้อมโน้ตจากโค้ช)
- การเข้าฝึกล่าสุด 5 รายการ (พร้อม feedback)

**การใช้งาน:**
1. โค้ชเข้าหน้า "จัดการนักกีฬา"
2. คลิกที่นักกีฬาที่ต้องการดูรายละเอียด
3. ดูข้อมูลครบถ้วน พร้อมตั้งเป้าหมายใหม่ได้

---

### 3. ระบบตั้งเป้าหมาย (Goal Setting) ✅

**Database Schema:**
```sql
CREATE TABLE athlete_goals (
  id UUID PRIMARY KEY,
  athlete_id UUID REFERENCES athletes(id),
  coach_id UUID REFERENCES coaches(id),
  
  -- Goal details
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- performance, attendance, skill, fitness, other
  
  -- Target and progress
  target_value DECIMAL(10, 2),
  target_unit TEXT,
  current_value DECIMAL(10, 2) DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,
  
  -- Status and timeline
  status TEXT DEFAULT 'active', -- active, completed, cancelled, overdue
  priority TEXT DEFAULT 'medium', -- low, medium, high
  start_date DATE DEFAULT CURRENT_DATE,
  target_date DATE NOT NULL,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**ฟีเจอร์:**
- โค้ชตั้งเป้าหมายให้นักกีฬา
- กำหนดประเภท (ผลงาน, การเข้าฝึก, ทักษะ, สมรรถภาพ, อื่นๆ)
- กำหนดค่าเป้าหมาย (เช่น วิ่ง 100 เมตร ใน 12 วินาที)
- กำหนดความสำคัญ (ต่ำ, ปานกลาง, สูง)
- กำหนดวันที่เป้าหมาย
- อัปเดตความคืบหน้า (0-100%)
- ระบบอัปเดตสถานะอัตโนมัติ:
  - `completed` เมื่อความคืบหน้าถึง 100%
  - `overdue` เมื่อเลยวันที่กำหนด

**API Actions:**
- `createGoal(input)` - สร้างเป้าหมายใหม่
- `updateGoal(input)` - อัปเดตเป้าหมาย
- `deleteGoal(goalId)` - ลบเป้าหมาย
- `getAthleteGoals(athleteId)` - ดึงเป้าหมายของนักกีฬา
- `getCoachGoals()` - ดึงเป้าหมายทั้งหมดของโค้ช

**UI Components:**
- `CreateGoalDialog` - Dialog สร้างเป้าหมาย
- `AthleteGoalsList` - แสดงรายการเป้าหมาย (สำหรับโค้ช)
- `GoalsWidget` - Widget แสดงเป้าหมายในหน้า dashboard (สำหรับนักกีฬา)

**หน้าใหม่:**
- `/dashboard/coach/athletes/[id]` - โปรไฟล์นักกีฬา (มีส่วนจัดการเป้าหมาย)
- `/dashboard/athlete/goals` - หน้าเป้าหมายทั้งหมดของนักกีฬา

---

## การใช้งาน

### สำหรับโค้ช

#### 1. ให้ Feedback การเข้าฝึก
```typescript
import { addAttendanceFeedback } from '@/lib/coach/feedback-actions';

await addAttendanceFeedback(
  'attendance-log-id',
  'ทำได้ดีมาก! พยายามเพิ่มความเร็วในรอบหน้า'
);
```

#### 2. เพิ่มโน้ตในผลทดสอบ
```typescript
import { addPerformanceNotes } from '@/lib/coach/feedback-actions';

await addPerformanceNotes(
  'performance-record-id',
  'ผลดีขึ้นจากครั้งที่แล้ว 0.5 วินาที ทำได้ดีมาก!'
);
```

#### 3. ตั้งเป้าหมายให้นักกีฬา
```typescript
import { createGoal } from '@/lib/coach/goal-actions';

await createGoal({
  athleteId: 'athlete-id',
  title: 'วิ่ง 100 เมตร ใน 12 วินาที',
  description: 'เป้าหมายสำหรับการแข่งขันเดือนหน้า',
  category: 'performance',
  targetValue: 12,
  targetUnit: 'วินาที',
  priority: 'high',
  targetDate: '2025-12-31',
});
```

#### 4. อัปเดตความคืบหน้าเป้าหมาย
```typescript
import { updateGoal } from '@/lib/coach/goal-actions';

await updateGoal({
  id: 'goal-id',
  progressPercentage: 75,
  currentValue: 12.5,
});
```

### สำหรับนักกีฬา

#### 1. ดูเป้าหมายในหน้า Dashboard
- เป้าหมายจะแสดงอัตโนมัติในหน้า `/dashboard/athlete`
- แสดงสถิติ: กำลังดำเนินการ, สำเร็จแล้ว, ความคืบหน้าเฉลี่ย
- แสดงเป้าหมายที่กำลังดำเนินการ 3 อันดับแรก

#### 2. ดูเป้าหมายทั้งหมด
- เข้าหน้า `/dashboard/athlete/goals`
- แยกตามสถานะ: กำลังดำเนินการ, เลยกำหนด, สำเร็จแล้ว
- แสดงความคืบหน้าแต่ละเป้าหมาย

#### 3. ดู Feedback จากโค้ช
- ในหน้าประวัติการเข้าฝึก จะเห็น feedback ของโค้ช
- ในหน้าผลการทดสอบ จะเห็นโน้ตของโค้ช

---

## RLS Policies

### athlete_goals

**โค้ช:**
- ดูเป้าหมายของนักกีฬาในสโมสรของตัวเอง
- สร้างเป้าหมายให้นักกีฬาในสโมสรของตัวเอง
- แก้ไข/ลบเป้าหมายที่ตัวเองสร้าง

**นักกีฬา:**
- ดูเป้าหมายของตัวเองเท่านั้น
- ไม่สามารถสร้าง/แก้ไข/ลบเป้าหมายได้

---

## Migration

**ไฟล์:** `scripts/61-add-feedback-and-goals.sql`

**รัน migration:**
```bash
./scripts/run-sql-via-api.sh scripts/61-add-feedback-and-goals.sql
```

**สิ่งที่ migration ทำ:**
1. เพิ่ม `coach_feedback` ใน `attendance_logs`
2. เพิ่ม `coach_notes` ใน `performance_records`
3. สร้างตาราง `athlete_goals`
4. สร้าง indexes สำหรับ performance
5. สร้าง triggers สำหรับ auto-update
6. สร้าง RLS policies
7. สร้าง view `athlete_goal_stats`

---

## ตัวอย่างการใช้งานจริง

### Scenario 1: โค้ชให้ Feedback หลังการฝึก

1. โค้ชเข้าหน้าเช็คชื่อ
2. บันทึกการเข้าร่วมของนักกีฬา
3. เพิ่ม feedback: "ทำได้ดีมาก! ความเร็วดีขึ้นเห็นได้ชัด"
4. นักกีฬาเห็น feedback ในหน้าประวัติการเข้าฝึก

### Scenario 2: โค้ชตั้งเป้าหมายให้นักกีฬา

1. โค้ชเข้าหน้ารายชื่อนักกีฬา
2. คลิกที่นักกีฬาที่ต้องการ
3. คลิกปุ่ม "+" เพื่อสร้างเป้าหมาย
4. กรอกข้อมูล:
   - หัวข้อ: "วิ่ง 100 เมตร ใน 12 วินาที"
   - ประเภท: ผลงาน
   - เป้าหมาย: 12 วินาที
   - ความสำคัญ: สูง
   - กำหนดเสร็จ: 31/12/2025
5. นักกีฬาเห็นเป้าหมายในหน้า dashboard ทันที

### Scenario 3: นักกีฬาติดตามความก้าวหน้า

1. นักกีฬาเข้าหน้า dashboard
2. เห็น widget เป้าหมาย แสดง:
   - 3 เป้าหมายกำลังดำเนินการ
   - 1 เป้าหมายสำเร็จแล้ว
   - ความคืบหน้าเฉลี่ย 65%
3. คลิก "ดูเป้าหมายทั้งหมด"
4. เห็นรายละเอียดทุกเป้าหมาย พร้อมความคืบหน้า

---

## ประโยชน์

### สำหรับโค้ช
✅ ติดตามความก้าวหน้าของนักกีฬาแต่ละคนได้ละเอียด
✅ ให้ feedback เฉพาะบุคคลได้ง่าย
✅ ตั้งเป้าหมายและติดตามผลได้ชัดเจน
✅ เห็นภาพรวมของนักกีฬาในที่เดียว

### สำหรับนักกีฬา
✅ รับ feedback จากโค้ชได้ทันที
✅ เห็นเป้าหมายที่ชัดเจน
✅ ติดตามความก้าวหน้าของตัวเองได้
✅ มีแรงจูงใจในการพัฒนา

---

## การพัฒนาต่อในอนาคต

### ฟีเจอร์ที่อาจเพิ่ม:
- [ ] ระบบข้อความส่วนตัว (Direct Messaging)
- [ ] การแจ้งเตือนเมื่อโค้ชให้ feedback
- [ ] การแจ้งเตือนเมื่อใกล้ถึงวันเป้าหมาย
- [ ] กราฟแสดงความก้าวหน้าเป้าหมาย
- [ ] ระบบรางวัลเมื่อบรรลุเป้าหมาย
- [ ] เปรียบเทียบผลงานระหว่างนักกีฬา
- [ ] ส่งออกรายงานความก้าวหน้า

---

## สรุป

ระบบนี้เพิ่มความสัมพันธ์ที่ดีระหว่างโค้ชและนักกีฬา ช่วยให้การสื่อสารมีประสิทธิภาพ และสร้างแรงจูงใจในการพัฒนาผ่านระบบเป้าหมายที่ชัดเจน

**Migration สำเร็จ:** ✅  
**API Actions พร้อมใช้:** ✅  
**UI Components พร้อมใช้:** ✅  
**RLS Policies ปลอดภัย:** ✅
