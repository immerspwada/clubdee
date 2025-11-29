-- ============================================================================
-- CREATE DEMO BADMINTON ATHLETES
-- ============================================================================
-- Creates additional demo athletes for comprehensive testing
-- Note: These users must be created in Supabase Auth first
-- ============================================================================

-- ============================================================================
-- CREATE PROFILES FOR DEMO ATHLETES
-- ============================================================================

-- Athlete 2: Somchai
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

-- Athlete 3: Niran
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

-- Athlete 4: Pim
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
-- CREATE ATHLETE ROLES
-- ============================================================================

INSERT INTO user_roles (user_id, role)
SELECT id, 'athlete'::user_role
FROM auth.users
WHERE email IN ('athlete2@test.com', 'athlete3@test.com', 'athlete4@test.com')
ON CONFLICT (user_id) DO UPDATE SET role = 'athlete'::user_role;

-- ============================================================================
-- ADD ATHLETES TO BADMINTON TEAM (if team exists)
-- ============================================================================

-- Note: Team must be created first via 110-create-badminton-demo.sql
-- This will be added once the team is successfully created

-- ============================================================================
-- VERIFY SETUP
-- ============================================================================

SELECT 
  'Demo Athletes Created' as status,
  COUNT(*) as athlete_count
FROM profiles
WHERE email IN ('athlete2@test.com', 'athlete3@test.com', 'athlete4@test.com');

SELECT 
  'Team Members' as status,
  COUNT(*) as member_count
FROM team_members
WHERE team_id = '10000000-0000-0000-0000-000000000001';
