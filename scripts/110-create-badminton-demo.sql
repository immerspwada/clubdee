-- ============================================================================
-- BADMINTON DEMO SETUP
-- ============================================================================
-- Creates a new sport type (Badminton) with demo athletes and coaches
-- for comprehensive testing of all communication features
-- ============================================================================

-- ============================================================================
-- CREATE BADMINTON SPORT
-- ============================================================================

INSERT INTO sports (id, name, description) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Badminton', 'Badminton sport')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- CREATE BADMINTON TEAM
-- ============================================================================

INSERT INTO teams (id, name, sport_id, club_id, coach_id, description)
SELECT 
  '10000000-0000-0000-0000-000000000001',
  'Badminton Team',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  u.id,
  'Demo badminton team for testing communication features'
FROM auth.users u
WHERE u.email = 'coach@test.com'
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- CREATE DEMO ATHLETES FOR BADMINTON
-- ============================================================================

-- Note: These athletes should be created via the registration system
-- This script assumes they already exist in auth.users
-- If they don't exist, create them first using the admin create-user endpoint

-- Add demo athletes to badminton team
INSERT INTO team_members (team_id, athlete_id)
SELECT 
  '10000000-0000-0000-0000-000000000001',
  u.id
FROM auth.users u
WHERE u.email = 'athlete@test.com'
ON CONFLICT (team_id, athlete_id) DO NOTHING;

-- ============================================================================
-- CREATE TRAINING SESSIONS FOR BADMINTON
-- ============================================================================

INSERT INTO training_sessions (
  id,
  team_id,
  title,
  description,
  scheduled_at,
  duration_minutes,
  location,
  created_by
)
SELECT 
  '10000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'Badminton Training - Basics',
  'Learn fundamental badminton techniques and footwork',
  CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours',
  90,
  'Court A',
  u.id
FROM auth.users u
WHERE u.email = 'coach@test.com'
ON CONFLICT (id) DO NOTHING;

INSERT INTO training_sessions (
  id,
  team_id,
  title,
  description,
  scheduled_at,
  duration_minutes,
  location,
  created_by
)
SELECT 
  '10000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000001',
  'Badminton Training - Advanced',
  'Advanced techniques and match practice',
  CURRENT_DATE + INTERVAL '3 days' + INTERVAL '14 hours',
  90,
  'Court B',
  u.id
FROM auth.users u
WHERE u.email = 'coach@test.com'
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- NOTE: Announcements are created via the UI or separate migration
-- The announcements table requires a coaches table reference
-- ============================================================================

-- ============================================================================
-- VERIFY SETUP
-- ============================================================================

SELECT 
  'Badminton Demo Setup' as category,
  COUNT(*) as count,
  'Sports' as type
FROM sports
WHERE name = 'Badminton'

UNION ALL

SELECT 
  'Badminton Demo Setup' as category,
  COUNT(*) as count,
  'Teams' as type
FROM teams
WHERE name = 'Badminton Team'

UNION ALL

SELECT 
  'Badminton Demo Setup' as category,
  COUNT(*) as count,
  'Training Sessions' as type
FROM training_sessions
WHERE team_id = '10000000-0000-0000-0000-000000000001';

