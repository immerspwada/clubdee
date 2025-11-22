-- RLS Helper Functions for Sports Club Management System
-- These functions are used by RLS policies to determine user permissions

-- ============================================================================
-- FUNCTION: get_user_role
-- Returns the role of the authenticated user
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS user_role AS $$
DECLARE
  user_role_value user_role;
BEGIN
  -- Get role from user_roles table
  SELECT role INTO user_role_value 
  FROM user_roles 
  WHERE user_id = user_uuid;
  
  -- Return the role, or 'athlete' as default if not found
  RETURN COALESCE(user_role_value, 'athlete'::user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- FUNCTION: get_user_club_id
-- Returns the club ID associated with the authenticated user
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_club_id(user_uuid UUID)
RETURNS UUID AS $$
DECLARE
  club_uuid UUID;
BEGIN
  -- Try to get club from athlete
  SELECT club_id INTO club_uuid 
  FROM athletes 
  WHERE user_id = user_uuid;
  
  IF club_uuid IS NOT NULL THEN
    RETURN club_uuid;
  END IF;
  
  -- Try to get club from coach
  SELECT club_id INTO club_uuid 
  FROM coaches 
  WHERE user_id = user_uuid;
  
  RETURN club_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- FUNCTION: is_admin
-- Checks if the authenticated user is an admin
-- ============================================================================
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role(user_uuid) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- FUNCTION: is_coach
-- Checks if the authenticated user is a coach
-- ============================================================================
CREATE OR REPLACE FUNCTION is_coach(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role(user_uuid) = 'coach';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- FUNCTION: is_athlete
-- Checks if the authenticated user is an athlete
-- ============================================================================
CREATE OR REPLACE FUNCTION is_athlete(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role(user_uuid) = 'athlete';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- FUNCTION: user_belongs_to_club
-- Checks if a user belongs to a specific club
-- ============================================================================
CREATE OR REPLACE FUNCTION user_belongs_to_club(user_uuid UUID, club_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_club_id(user_uuid) = club_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- FUNCTION: get_athlete_id_by_user
-- Returns the athlete ID for a given user ID
-- ============================================================================
CREATE OR REPLACE FUNCTION get_athlete_id_by_user(user_uuid UUID)
RETURNS UUID AS $$
DECLARE
  athlete_uuid UUID;
BEGIN
  SELECT id INTO athlete_uuid 
  FROM athletes 
  WHERE user_id = user_uuid;
  
  RETURN athlete_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- FUNCTION: get_coach_id_by_user
-- Returns the coach ID for a given user ID
-- ============================================================================
CREATE OR REPLACE FUNCTION get_coach_id_by_user(user_uuid UUID)
RETURNS UUID AS $$
DECLARE
  coach_uuid UUID;
BEGIN
  SELECT id INTO coach_uuid 
  FROM coaches 
  WHERE user_id = user_uuid;
  
  RETURN coach_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION get_user_role IS 'Returns the role of the authenticated user';
COMMENT ON FUNCTION get_user_club_id IS 'Returns the club ID associated with the authenticated user';
COMMENT ON FUNCTION is_admin IS 'Checks if the authenticated user is an admin';
COMMENT ON FUNCTION is_coach IS 'Checks if the authenticated user is a coach';
COMMENT ON FUNCTION is_athlete IS 'Checks if the authenticated user is an athlete';
COMMENT ON FUNCTION user_belongs_to_club IS 'Checks if a user belongs to a specific club';
COMMENT ON FUNCTION get_athlete_id_by_user IS 'Returns the athlete ID for a given user ID';
COMMENT ON FUNCTION get_coach_id_by_user IS 'Returns the coach ID for a given user ID';
