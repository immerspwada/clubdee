-- ============================================================================
-- CREATE DEMO USERS FOR BADMINTON TESTING
-- ============================================================================
-- Creates additional demo athletes for comprehensive testing
-- Run this script via the API to create users in Supabase Auth
-- ============================================================================

-- Note: This script creates users in the auth.users table
-- These users will be used for testing all communication features

-- Create demo athlete 2 (Somchai)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'athlete2@test.com',
  crypt('Athlete123!', gen_salt('bf')),
  NOW(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  FALSE,
  NOW(),
  NOW(),
  '0845678901',
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'athlete2@test.com');

-- Create demo athlete 3 (Niran)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'athlete3@test.com',
  crypt('Athlete123!', gen_salt('bf')),
  NOW(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  FALSE,
  NOW(),
  NOW(),
  '0856789012',
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'athlete3@test.com');

-- Create demo athlete 4 (Pim)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'athlete4@test.com',
  crypt('Athlete123!', gen_salt('bf')),
  NOW(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  FALSE,
  NOW(),
  NOW(),
  '0867890123',
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'athlete4@test.com');

-- ============================================================================
-- VERIFY USERS CREATED
-- ============================================================================

SELECT 
  'Demo Users Created' as status,
  COUNT(*) as user_count,
  STRING_AGG(email, ', ') as emails
FROM auth.users
WHERE email IN ('athlete2@test.com', 'athlete3@test.com', 'athlete4@test.com');
