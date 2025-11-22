-- Row Level Security (RLS) Policies for Sports Club Management System
-- These policies enforce role-based access control at the database level

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USER_ROLES TABLE POLICIES
-- ============================================================================

-- Admins can do everything on user_roles
CREATE POLICY "Admins have full access to user_roles"
  ON user_roles FOR ALL
  USING (is_admin(auth.uid()));

-- Users can view their own role
CREATE POLICY "Users can view their own role"
  ON user_roles FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================================
-- CLUBS TABLE POLICIES
-- ============================================================================

-- Admins can do everything on clubs
CREATE POLICY "Admins have full access to clubs"
  ON clubs FOR ALL
  USING (is_admin(auth.uid()));

-- Coaches and athletes can view their own club
CREATE POLICY "Users can view their own club"
  ON clubs FOR SELECT
  USING (id = get_user_club_id(auth.uid()));

-- ============================================================================
-- ATHLETES TABLE POLICIES
-- ============================================================================

-- Admins can do everything on athletes
CREATE POLICY "Admins have full access to athletes"
  ON athletes FOR ALL
  USING (is_admin(auth.uid()));

-- Coaches can view and update athletes in their club
CREATE POLICY "Coaches can view athletes in their club"
  ON athletes FOR SELECT
  USING (
    is_coach(auth.uid()) AND 
    club_id = get_user_club_id(auth.uid())
  );

CREATE POLICY "Coaches can insert athletes in their club"
  ON athletes FOR INSERT
  WITH CHECK (
    is_coach(auth.uid()) AND 
    club_id = get_user_club_id(auth.uid())
  );

CREATE POLICY "Coaches can update athletes in their club"
  ON athletes FOR UPDATE
  USING (
    is_coach(auth.uid()) AND 
    club_id = get_user_club_id(auth.uid())
  );

-- Athletes can view and update their own data
CREATE POLICY "Athletes can view their own data"
  ON athletes FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Athletes can update their own data"
  ON athletes FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid() AND
    -- Prevent athletes from changing their club
    club_id = (SELECT club_id FROM athletes WHERE user_id = auth.uid())
  );

-- ============================================================================
-- COACHES TABLE POLICIES
-- ============================================================================

-- Admins can do everything on coaches
CREATE POLICY "Admins have full access to coaches"
  ON coaches FOR ALL
  USING (is_admin(auth.uid()));

-- Coaches can view coaches in their club
CREATE POLICY "Coaches can view coaches in their club"
  ON coaches FOR SELECT
  USING (club_id = get_user_club_id(auth.uid()));

-- Coaches can update their own data
CREATE POLICY "Coaches can update their own data"
  ON coaches FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid() AND
    -- Prevent coaches from changing their club
    club_id = (SELECT club_id FROM coaches WHERE user_id = auth.uid())
  );

-- ============================================================================
-- TRAINING_SESSIONS TABLE POLICIES
-- ============================================================================

-- Admins can do everything on training_sessions
CREATE POLICY "Admins have full access to training_sessions"
  ON training_sessions FOR ALL
  USING (is_admin(auth.uid()));

-- Coaches can manage training sessions in their club
CREATE POLICY "Coaches can view training sessions in their club"
  ON training_sessions FOR SELECT
  USING (
    is_coach(auth.uid()) AND 
    club_id = get_user_club_id(auth.uid())
  );

CREATE POLICY "Coaches can insert training sessions in their club"
  ON training_sessions FOR INSERT
  WITH CHECK (
    is_coach(auth.uid()) AND 
    club_id = get_user_club_id(auth.uid()) AND
    coach_id = get_coach_id_by_user(auth.uid())
  );

CREATE POLICY "Coaches can update training sessions in their club"
  ON training_sessions FOR UPDATE
  USING (
    is_coach(auth.uid()) AND 
    club_id = get_user_club_id(auth.uid())
  );

CREATE POLICY "Coaches can delete training sessions in their club"
  ON training_sessions FOR DELETE
  USING (
    is_coach(auth.uid()) AND 
    club_id = get_user_club_id(auth.uid())
  );

-- Athletes can view training sessions in their club
CREATE POLICY "Athletes can view training sessions in their club"
  ON training_sessions FOR SELECT
  USING (
    is_athlete(auth.uid()) AND 
    club_id = get_user_club_id(auth.uid())
  );

-- ============================================================================
-- ATTENDANCE_LOGS TABLE POLICIES
-- ============================================================================

-- Admins can do everything on attendance_logs
CREATE POLICY "Admins have full access to attendance_logs"
  ON attendance_logs FOR ALL
  USING (is_admin(auth.uid()));

-- Coaches can manage attendance in their club
CREATE POLICY "Coaches can view attendance in their club"
  ON attendance_logs FOR SELECT
  USING (
    is_coach(auth.uid()) AND
    EXISTS (
      SELECT 1 FROM training_sessions ts
      WHERE ts.id = attendance_logs.training_session_id
      AND ts.club_id = get_user_club_id(auth.uid())
    )
  );

CREATE POLICY "Coaches can insert attendance in their club"
  ON attendance_logs FOR INSERT
  WITH CHECK (
    is_coach(auth.uid()) AND
    EXISTS (
      SELECT 1 FROM training_sessions ts
      WHERE ts.id = training_session_id
      AND ts.club_id = get_user_club_id(auth.uid())
    )
  );

CREATE POLICY "Coaches can update attendance in their club"
  ON attendance_logs FOR UPDATE
  USING (
    is_coach(auth.uid()) AND
    EXISTS (
      SELECT 1 FROM training_sessions ts
      WHERE ts.id = attendance_logs.training_session_id
      AND ts.club_id = get_user_club_id(auth.uid())
    )
  );

CREATE POLICY "Coaches can delete attendance in their club"
  ON attendance_logs FOR DELETE
  USING (
    is_coach(auth.uid()) AND
    EXISTS (
      SELECT 1 FROM training_sessions ts
      WHERE ts.id = attendance_logs.training_session_id
      AND ts.club_id = get_user_club_id(auth.uid())
    )
  );

-- Athletes can view their own attendance
CREATE POLICY "Athletes can view their own attendance"
  ON attendance_logs FOR SELECT
  USING (
    is_athlete(auth.uid()) AND
    athlete_id = get_athlete_id_by_user(auth.uid())
  );

-- Athletes can insert their own attendance (for QR check-in)
CREATE POLICY "Athletes can check in via QR"
  ON attendance_logs FOR INSERT
  WITH CHECK (
    is_athlete(auth.uid()) AND
    athlete_id = get_athlete_id_by_user(auth.uid()) AND
    check_in_method = 'qr'
  );

-- ============================================================================
-- PERFORMANCE_RECORDS TABLE POLICIES
-- ============================================================================

-- Admins can do everything on performance_records
CREATE POLICY "Admins have full access to performance_records"
  ON performance_records FOR ALL
  USING (is_admin(auth.uid()));

-- Coaches can manage performance records in their club
CREATE POLICY "Coaches can view performance records in their club"
  ON performance_records FOR SELECT
  USING (
    is_coach(auth.uid()) AND
    EXISTS (
      SELECT 1 FROM athletes a
      WHERE a.id = performance_records.athlete_id
      AND a.club_id = get_user_club_id(auth.uid())
    )
  );

CREATE POLICY "Coaches can insert performance records in their club"
  ON performance_records FOR INSERT
  WITH CHECK (
    is_coach(auth.uid()) AND
    coach_id = get_coach_id_by_user(auth.uid()) AND
    EXISTS (
      SELECT 1 FROM athletes a
      WHERE a.id = athlete_id
      AND a.club_id = get_user_club_id(auth.uid())
    )
  );

CREATE POLICY "Coaches can update performance records in their club"
  ON performance_records FOR UPDATE
  USING (
    is_coach(auth.uid()) AND
    EXISTS (
      SELECT 1 FROM athletes a
      WHERE a.id = performance_records.athlete_id
      AND a.club_id = get_user_club_id(auth.uid())
    )
  );

CREATE POLICY "Coaches can delete performance records in their club"
  ON performance_records FOR DELETE
  USING (
    is_coach(auth.uid()) AND
    EXISTS (
      SELECT 1 FROM athletes a
      WHERE a.id = performance_records.athlete_id
      AND a.club_id = get_user_club_id(auth.uid())
    )
  );

-- Athletes can view their own performance records
CREATE POLICY "Athletes can view their own performance records"
  ON performance_records FOR SELECT
  USING (
    is_athlete(auth.uid()) AND
    athlete_id = get_athlete_id_by_user(auth.uid())
  );

-- ============================================================================
-- ANNOUNCEMENTS TABLE POLICIES
-- ============================================================================

-- Admins can do everything on announcements
CREATE POLICY "Admins have full access to announcements"
  ON announcements FOR ALL
  USING (is_admin(auth.uid()));

-- Coaches can manage announcements in their club
CREATE POLICY "Coaches can view announcements in their club"
  ON announcements FOR SELECT
  USING (
    is_coach(auth.uid()) AND
    (club_id = get_user_club_id(auth.uid()) OR club_id IS NULL)
  );

CREATE POLICY "Coaches can insert announcements in their club"
  ON announcements FOR INSERT
  WITH CHECK (
    is_coach(auth.uid()) AND
    author_id = auth.uid() AND
    author_role = 'coach' AND
    club_id = get_user_club_id(auth.uid())
  );

CREATE POLICY "Coaches can update their own announcements"
  ON announcements FOR UPDATE
  USING (
    is_coach(auth.uid()) AND
    author_id = auth.uid() AND
    club_id = get_user_club_id(auth.uid())
  );

CREATE POLICY "Coaches can delete their own announcements"
  ON announcements FOR DELETE
  USING (
    is_coach(auth.uid()) AND
    author_id = auth.uid() AND
    club_id = get_user_club_id(auth.uid())
  );

-- Athletes can view announcements for their club or system-wide
CREATE POLICY "Athletes can view announcements for their club"
  ON announcements FOR SELECT
  USING (
    is_athlete(auth.uid()) AND
    (club_id = get_user_club_id(auth.uid()) OR club_id IS NULL)
  );

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON POLICY "Admins have full access to user_roles" ON user_roles IS 'Admins can manage all user roles';
COMMENT ON POLICY "Users can view their own role" ON user_roles IS 'Users can see their own role assignment';
COMMENT ON POLICY "Admins have full access to clubs" ON clubs IS 'Admins can manage all clubs';
COMMENT ON POLICY "Users can view their own club" ON clubs IS 'Users can view details of their assigned club';
COMMENT ON POLICY "Admins have full access to athletes" ON athletes IS 'Admins can manage all athletes';
COMMENT ON POLICY "Coaches can view athletes in their club" ON athletes IS 'Coaches can view athletes in their club only';
COMMENT ON POLICY "Athletes can view their own data" ON athletes IS 'Athletes can view their own profile';
COMMENT ON POLICY "Athletes can update their own data" ON athletes IS 'Athletes can update their profile but not change club';
