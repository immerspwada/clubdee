-- ============================================================================
-- FIX DEMO CREDENTIALS
-- ============================================================================
-- ตรวจสอบและสร้าง demo users ที่ถูกต้อง
-- ============================================================================

-- ============================================================================
-- ตรวจสอบ demo users ที่มีอยู่
-- ============================================================================

SELECT 
  'Current Demo Users' as status,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email IN (
  'admin@test.com',
  'coach@test.com',
  'athlete@test.com',
  'athlete2@test.com',
  'athlete3@test.com',
  'athlete4@test.com'
)
ORDER BY email;

-- ============================================================================
-- ตรวจสอบ profiles
-- ============================================================================

SELECT 
  'Profiles Status' as status,
  p.email,
  p.full_name,
  ur.role,
  c.name as club_name
FROM profiles p
LEFT JOIN user_roles ur ON ur.user_id = p.id
LEFT JOIN clubs c ON c.id = p.club_id
WHERE p.email IN (
  'admin@test.com',
  'coach@test.com',
  'athlete@test.com',
  'athlete2@test.com',
  'athlete3@test.com',
  'athlete4@test.com'
)
ORDER BY p.email;

-- ============================================================================
-- ตรวจสอบ user_roles
-- ============================================================================

SELECT 
  'User Roles Status' as status,
  u.email,
  ur.role
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
WHERE u.email IN (
  'admin@test.com',
  'coach@test.com',
  'athlete@test.com',
  'athlete2@test.com',
  'athlete3@test.com',
  'athlete4@test.com'
)
ORDER BY u.email;

-- ============================================================================
-- ตรวจสอบ clubs
-- ============================================================================

SELECT 
  'Clubs Status' as status,
  id,
  name,
  created_at
FROM clubs
WHERE name = 'Test Sports Club'
LIMIT 1;
