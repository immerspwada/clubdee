# Training Attendance System - Index Reference

## Quick Reference Guide

This document maps common queries to their optimized indexes.

## Query Patterns & Indexes

### Coach Queries

| Query Pattern | Optimized Index |
|--------------|-----------------|
| Get all sessions for a coach | `idx_training_sessions_coach_id` |
| Get coach's scheduled sessions | `idx_training_sessions_coach_status` |
| Get coach's sessions by date | `idx_training_sessions_coach_scheduled` |
| Get attendance for a session | `idx_attendance_session_status` |
| View pending leave requests | `idx_leave_requests_pending` |

### Athlete Queries

| Query Pattern | Optimized Index |
|--------------|-----------------|
| Get upcoming sessions for team | `idx_training_sessions_team_scheduled` |
| Get my attendance history | `idx_attendance_athlete_created` |
| Get my attendance stats | `idx_attendance_athlete_status` |
| Get my leave requests | `idx_leave_requests_athlete_status` |
| Check if already checked in | `attendance.session_id, athlete_id` (unique constraint) |

### Admin Queries

| Query Pattern | Optimized Index |
|--------------|-----------------|
| Get all sessions by status | `idx_training_sessions_status` |
| Get sessions by date range | `idx_training_sessions_scheduled_status` |
| Get attendance statistics | `idx_attendance_athlete_status` |
| Get all leave requests | `idx_leave_requests_status` |
| Generate attendance reports | `idx_attendance_session_checkin` |

## Index Types

### Single Column Indexes
- Fast lookups for single-column filters
- Used for foreign keys and status fields

### Composite Indexes
- Optimized for multi-column queries
- Column order matters (most selective first)

### Partial Indexes
- Smaller, faster indexes for filtered subsets
- Used for `status = 'scheduled'` and `status = 'pending'`

## Performance Tips

1. **Use indexed columns in WHERE clauses**
   ```sql
   -- Good: Uses idx_training_sessions_coach_id
   WHERE coach_id = $1
   
   -- Good: Uses idx_training_sessions_coach_status
   WHERE coach_id = $1 AND status = 'scheduled'
   ```

2. **Order matters in composite indexes**
   ```sql
   -- Good: Uses idx_training_sessions_coach_scheduled
   WHERE coach_id = $1 ORDER BY scheduled_at
   
   -- Less optimal: Can't use composite index fully
   WHERE scheduled_at > NOW() AND coach_id = $1
   ```

3. **Leverage partial indexes**
   ```sql
   -- Good: Uses idx_training_sessions_scheduled (partial)
   WHERE status = 'scheduled' AND scheduled_at > NOW()
   
   -- Good: Uses idx_leave_requests_pending (partial)
   WHERE status = 'pending' AND session_id = $1
   ```

## Monitoring

To check index usage:
```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE tablename IN ('training_sessions', 'attendance', 'leave_requests')
ORDER BY idx_scan DESC;
```

## Maintenance

Indexes are automatically maintained by PostgreSQL. No manual maintenance required.

For index statistics:
```sql
SELECT 
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE tablename IN ('training_sessions', 'attendance', 'leave_requests')
ORDER BY pg_relation_size(indexrelid) DESC;
```
