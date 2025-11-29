-- ============================================================================
-- COMPLETE DEMO SETUP - สร้างข้อมูล demo ที่ขาดหายไป
-- ============================================================================

-- ============================================================================
-- 1. สร้าง user_roles สำหรับ demo users
-- ============================================================================

INSERT INTO user_roles (user_id, role)
SELECT u.id, 'admin'::user_role
FROM auth.users u
WHERE u.email = 'admin@test.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin'::user_role;

INSERT INTO user_roles (user_id, role)
SELECT u.id, 'coach'::user_role
FROM auth.users u
WHERE u.email = 'coach@test.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'coach'::user_role;

INSERT INTO user_roles (user_id, role)
SELECT u.id, 'athlete'::user_role
FROM auth.users u
WHERE u.email IN ('athlete@test.com', 'athlete2@test.com', 'athlete3@test.com', 'athlete4@test.com')
ON CONFLICT (user_id) DO UPDATE SET role = 'athlete'::user_role;

-- ============================================================================
-- 2. สร้าง profiles สำหรับ demo users
-- ============================================================================

INSERT INTO profiles (id, email, full_name, club_id)
SELECT 
  u.id,
  u.email,
  'Admin User',
  '00000000-0000-0000-0000-000000000001'
FROM auth.users u
WHERE u.email = 'admin@test.com'
ON CONFLICT (id) DO UPDATE SET
  full_name = 'Admin User',
  club_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO profiles (id, email, full_name, club_id)
SELECT 
  u.id,
  u.email,
  'Coach User',
  '00000000-0000-0000-0000-000000000001'
FROM auth.users u
WHERE u.email = 'coach@test.com'
ON CONFLICT (id) DO UPDATE SET
  full_name = 'Coach User',
  club_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO profiles (id, email, full_name, club_id)
SELECT 
  u.id,
  u.email,
  'Athlete User',
  '00000000-0000-0000-0000-000000000001'
FROM auth.users u
WHERE u.email = 'athlete@test.com'
ON CONFLICT (id) DO UPDATE SET
  full_name = 'Athlete User',
  club_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO profiles (id, email, full_name, club_id)
SELECT 
  u.id,
  u.email,
  'Somchai Badminton',
  '00000000-0000-0000-0000-000000000001'
FROM auth.users u
WHERE u.email = 'athlete2@test.com'
ON CONFLICT (id) DO UPDATE SET
  full_name = 'Somchai Badminton',
  club_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO profiles (id, email, full_name, club_id)
SELECT 
  u.id,
  u.email,
  'Niran Badminton',
  '00000000-0000-0000-0000-000000000001'
FROM auth.users u
WHERE u.email = 'athlete3@test.com'
ON CONFLICT (id) DO UPDATE SET
  full_name = 'Niran Badminton',
  club_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO profiles (id, email, full_name, club_id)
SELECT 
  u.id,
  u.email,
  'Pim Badminton',
  '00000000-0000-0000-0000-000000000001'
FROM auth.users u
WHERE u.email = 'athlete4@test.com'
ON CONFLICT (id) DO UPDATE SET
  full_name = 'Pim Badminton',
  club_id = '00000000-0000-0000-0000-000000000001';

-- ============================================================================
-- 3. ตรวจสอบผลลัพธ์
-- ============================================================================

SELECT 
  'Demo Setup Complete' as status,
  COUNT(*) as total_users,
  COUNT(CASE WHEN ur.role = 'admin' THEN 1 END) as admins,
  COUNT(CASE WHEN ur.role = 'coach' THEN 1 END) as coaches,
  COUNT(CASE WHEN ur.role = 'athlete' THEN 1 END) as athletes
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
WHERE u.email IN (
  'admin@test.com',
  'coach@test.com',
  'athlete@test.com',
  'athlete2@test.com',
  'athlete3@test.com',
  'athlete4@test.com'
);

-- ============================================================================
-- 4. แสดงรายละเอียด demo users
-- ============================================================================

SELECT 
  'Demo Users Ready' as status,
  u.email,
  ur.role,
  p.full_name,
  c.name as club_name
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN profiles p ON p.id = u.id
LEFT JOIN clubs c ON c.id = p.club_id
WHERE u.email IN (
  'admin@test.com',
  'coach@test.com',
  'athlete@test.com',
  'athlete2@test.com',
  'athlete3@test.com',
  'athlete4@test.com'
)
ORDER BY u.email;
