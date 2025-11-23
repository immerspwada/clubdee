# Sports Club Management System

A comprehensive web application for managing sports clubs, athletes, coaches, and training activities with a robust membership approval workflow.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React Server Components, TailwindCSS, shadcn/ui
- **Backend**: Supabase (Auth, Database, Realtime, Edge Functions)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Testing**: Vitest (unit tests), fast-check (property-based tests)
- **Deployment**: Vercel (Frontend), Supabase (Backend)

## Features

- 🔐 Role-based authentication (Admin, Coach, Athlete)
- 📝 **Membership approval workflow** - Athletes apply to clubs, coaches review and approve
- 👥 User management with RLS security
- 🏋️ Training session scheduling
- ✅ Attendance tracking with QR code check-in
- 📊 Performance tracking and analytics
- 📢 Announcement system
- 📱 Progressive Web App (PWA) support
- 📈 Reporting and data export

## Quick Start Guide

### For New Users

#### Athletes: Getting Started

1. **Register Your Account**
   - Navigate to `/register` or click "Register" on the homepage
   - Enter your email and create a password
   - Verify your email (if email confirmation is enabled)

2. **Apply for Membership**
   - After login, you'll be redirected to `/register-membership`
   - **Select a club** based on the sport you want to join (e.g., Basketball, Football)
   - Note: You cannot select a specific coach - coaches are assigned upon approval

3. **Complete Your Application**
   - Fill in personal information (name, date of birth, contact details)
   - Upload required documents:
     - ID card or passport
     - Medical certificate (if required by club)
   - Review and submit your application

4. **Wait for Approval**
   - Your application status will be `pending`
   - You'll see a "Pending Approval" page when you login
   - You cannot access the athlete dashboard until approved
   - Check back regularly or wait for email notification

5. **After Approval**
   - Login to access your athlete dashboard
   - View your assigned coach and club
   - Check training schedules
   - Start checking in to training sessions

**Important Notes for Athletes:**
- You can only have ONE pending application at a time
- If rejected, you can reapply with improvements
- Contact your coach if you have questions about your application

#### Coaches: Managing Applications

1. **Get Your Coach Account**
   - Contact system admin to create your coach account
   - You'll be assigned to a specific club
   - Receive login credentials via email

2. **Login and Navigate**
   - Login at `/login`
   - Go to Dashboard → Applications
   - You'll see pending applications for YOUR club only

3. **Review Applications**
   - Click on an application to view details
   - Review athlete information:
     - Personal details
     - Uploaded documents
     - Application date
   - Check document validity and completeness

4. **Make a Decision**
   - **To Approve:**
     - Click "Approve" button
     - Athlete is automatically assigned to you
     - Athlete gains access to dashboard
     - Notification sent to athlete
   
   - **To Reject:**
     - Click "Reject" button
     - **Must provide a reason** (required)
     - Athlete can see the reason and reapply
     - Notification sent to athlete

5. **Manage Your Athletes**
   - View all assigned athletes in Athletes page
   - Create training sessions
   - Track attendance
   - Monitor performance

**Important Notes for Coaches:**
- You only see applications for your assigned club (security enforced)
- Rejection reasons are visible to athletes - be constructive
- Once approved, you become the athlete's assigned coach
- You can manage training sessions for all your athletes

#### Admins: System Management

1. **Login with Admin Credentials**
   - Use admin account provided during setup
   - Access full admin dashboard

2. **Manage Applications**
   - View applications from ALL clubs
   - Override coach decisions if needed
   - Reassign athletes to different coaches
   - Handle edge cases and exceptions

3. **Manage System**
   - Create and manage clubs
   - Create coach accounts and assign to clubs
   - Manage user roles
   - Configure system settings
   - View audit logs

4. **Monitor System Health**
   - Check for data inconsistencies
   - Run diagnostic scripts
   - Review system reports
   - Handle user support requests

**Important Notes for Admins:**
- You have full access to all data across all clubs
- Use admin override carefully - it bypasses normal workflow
- Regularly check audit logs for security
- Keep backup of database before major changes

### For Developers

#### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Supabase CLI (for migrations)

#### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

   ```bash
   cp .env.local.example .env.local
   ```

4. Run database migrations:

   ```bash
   ./scripts/auto-migrate.sh
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## Project Structure

```
sports-club-management/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── auth/              # Authentication components
│   ├── admin/             # Admin dashboard components
│   ├── coach/             # Coach dashboard components
│   └── athlete/           # Athlete components
├── lib/                   # Utility libraries
│   ├── supabase/          # Supabase client configuration
│   └── utils/             # Helper functions
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
├── tests/                 # Test files
└── public/                # Static assets
```

## Membership Approval Flow

The system implements a comprehensive membership approval workflow that ensures proper vetting of athletes before they can access the system.

### Overview

The membership approval system is **club-based**, meaning athletes apply to join a specific club (sport type), and coaches assigned to that club review and approve applications. This ensures proper organization and prevents athletes from accessing features before being properly vetted.

### Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    ATHLETE REGISTRATION                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Create auth.users account
                              ↓
                    Create profiles record
                    (membership_status = 'pending')
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  MEMBERSHIP APPLICATION                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Select Club (not coach!)
                              ↓
                    Fill personal information
                              ↓
                    Upload documents
                              ↓
                    Create membership_applications
                    (status = 'pending', club_id set)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      COACH REVIEW                                │
│  (Filtered by club - RLS enforced)                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
              ┌──────────┐        ┌──────────┐
              │ APPROVE  │        │ REJECT   │
              └──────────┘        └──────────┘
                    ↓                   ↓
        Update application:     Update application:
        - status = 'approved'   - status = 'rejected'
        - assigned_coach_id     - rejection_reason
        - reviewed_at           - reviewed_at
        - reviewed_by           - reviewed_by
                    ↓                   ↓
        Update profile:         Update profile:
        - membership_status     - membership_status
          = 'active'              = 'rejected'
        - coach_id (assigned)
        - club_id
                    ↓                   ↓
        Send notification       Send notification
        "Approved!"            "Rejected: [reason]"
                    ↓                   ↓
┌─────────────────────────────────────────────────────────────────┐
│                      ACCESS CONTROL                              │
└─────────────────────────────────────────────────────────────────┘
                    ↓                   ↓
        ✅ CAN ACCESS           ❌ CANNOT ACCESS
        Athlete Dashboard       Athlete Dashboard
        Training Sessions       (Can reapply)
        Check-in
        Performance
```

### Detailed Step-by-Step Process

#### 1. Application Submission (Athlete)

**What happens:**
- Athlete registers account (creates `auth.users` and `profiles` record)
- `profiles.membership_status` automatically set to `'pending'`
- Athlete navigates to `/register-membership`
- Selects a **club** (e.g., "Basketball Club", "Football Club")
- **Cannot select a specific coach** - assignment happens on approval
- Fills in personal information (name, DOB, contact, emergency contact)
- Uploads required documents (ID card, medical certificate)
- Submits application

**Database changes:**
```sql
INSERT INTO membership_applications (
  user_id,
  club_id,           -- Selected club
  status,            -- 'pending'
  applied_at,
  -- NO assigned_coach_id yet
  -- NO reviewed_by yet
);
```

**Business rules enforced:**
- ✅ Cannot submit if already have pending application
- ✅ Cannot submit if already have approved application
- ✅ Must select a valid club
- ✅ Must provide all required information

#### 2. Coach Review (Coach)

**What happens:**
- Coach logs in and navigates to Applications page
- Sees **only applications for their assigned club** (RLS enforced)
- Cannot see applications from other clubs
- Reviews athlete information and documents
- Makes decision: Approve or Reject

**Database query (RLS enforced):**
```sql
SELECT * FROM membership_applications
WHERE club_id = (
  SELECT club_id FROM profiles 
  WHERE user_id = auth.uid() AND role = 'coach'
)
AND status = 'pending';
```

**Security:**
- Row Level Security (RLS) policies prevent coaches from seeing other clubs' applications
- Even if coach tries to manipulate API, database blocks unauthorized access

#### 3a. Approval Process

**What happens:**
- Coach clicks "Approve"
- System performs atomic transaction:

```sql
BEGIN;

-- Update application
UPDATE membership_applications SET
  status = 'approved',
  assigned_coach_id = [coach_id],
  reviewed_by = [coach_id],
  reviewed_at = NOW()
WHERE id = [application_id];

-- Update athlete profile
UPDATE profiles SET
  membership_status = 'active',
  coach_id = [coach_id],
  club_id = [club_id]
WHERE user_id = [athlete_user_id];

COMMIT;
```

**Result:**
- ✅ Athlete can now access dashboard
- ✅ Athlete assigned to approving coach
- ✅ Athlete assigned to selected club
- ✅ Notification sent to athlete
- ✅ Athlete appears in coach's athlete list

#### 3b. Rejection Process

**What happens:**
- Coach clicks "Reject"
- **Must provide rejection reason** (required field)
- System performs atomic transaction:

```sql
BEGIN;

-- Update application
UPDATE membership_applications SET
  status = 'rejected',
  rejection_reason = [reason],
  reviewed_by = [coach_id],
  reviewed_at = NOW()
WHERE id = [application_id];

-- Update athlete profile
UPDATE profiles SET
  membership_status = 'rejected'
WHERE user_id = [athlete_user_id];

COMMIT;
```

**Result:**
- ❌ Athlete cannot access dashboard
- ✅ Athlete can see rejection reason
- ✅ Athlete can submit new application (reapply)
- ✅ Notification sent to athlete with reason

#### 4. Access Control (Middleware)

**Single Source of Truth:** `profiles.membership_status`

The middleware checks this field on every request:

```typescript
// Middleware logic
if (path.startsWith('/dashboard/athlete')) {
  const profile = await getProfile(user.id);
  
  if (profile.membership_status !== 'active') {
    // Redirect to pending approval page
    return redirect('/pending-approval');
  }
}
```

**Status meanings:**
- `'pending'` → Cannot access dashboard, see "Pending Approval" page
- `'active'` → Full access to athlete features
- `'rejected'` → Cannot access dashboard, can reapply
- `null` → New user, needs to apply

### Key Design Principles

#### 1. Single Source of Truth
- **`profiles.membership_status`** is the authoritative field for access control
- All access decisions based on this field
- Updated atomically with application status
- Prevents inconsistencies

#### 2. Club-Based Organization
- Athletes apply to **clubs**, not individual coaches
- Coaches are assigned to clubs
- Coaches only see applications for their club
- Ensures proper organization and security

#### 3. Atomic Transactions
- All status changes happen in database transactions
- Application status and profile status updated together
- Prevents partial updates and inconsistencies
- Rollback on any error

#### 4. Security by Default
- Row Level Security (RLS) enforces access control at database level
- Coaches cannot bypass security to see other clubs
- Athletes can only see their own applications
- Admins have override capability

#### 5. Clear Status Flow
```
null → pending → active (approved)
              ↘ rejected (can reapply)
```

**No other transitions allowed:**
- Cannot go from `active` back to `pending`
- Cannot go from `rejected` to `active` without new application
- Status changes are one-way and audited

### User Roles and Permissions

The system has three distinct roles with different permission levels:

#### 🏃 Athlete Role

**Access Requirements:**
- Must have `membership_status = 'active'` to access dashboard
- Pending or rejected athletes redirected to `/pending-approval`

**Permissions:**

| Feature | Permission | Notes |
|---------|-----------|-------|
| **Membership** | | |
| Submit application | ✅ Yes | Only if no pending application exists |
| View own applications | ✅ Yes | Can see status and rejection reasons |
| View other applications | ❌ No | RLS enforced |
| **Dashboard Access** | | |
| Access athlete dashboard | ✅ Yes | Only if `membership_status = 'active'` |
| View training schedule | ✅ Yes | Only for own club |
| Check-in to sessions | ✅ Yes | Within allowed time window |
| **Data Access** | | |
| View own profile | ✅ Yes | Can edit personal information |
| View own attendance | ✅ Yes | Historical records |
| View own performance | ✅ Yes | Stats and metrics |
| View assigned coach | ✅ Yes | Contact information |
| View other athletes | ❌ No | Privacy protected |
| **Actions** | | |
| Submit leave requests | ✅ Yes | For upcoming sessions |
| Upload documents | ✅ Yes | During application |
| Update profile | ✅ Yes | Personal information only |

**Restrictions:**
- Cannot access dashboard until approved
- Cannot see other athletes' data
- Cannot create training sessions
- Cannot approve applications
- Cannot access admin features

#### 👨‍🏫 Coach Role

**Access Requirements:**
- Must be assigned to at least one club
- No membership status check (always active)

**Permissions:**

| Feature | Permission | Notes |
|---------|-----------|-------|
| **Applications** | | |
| View applications | ✅ Yes | Only for assigned club (RLS enforced) |
| Approve applications | ✅ Yes | Athletes assigned to coach on approval |
| Reject applications | ✅ Yes | Must provide rejection reason |
| View all applications | ❌ No | Only own club |
| **Athlete Management** | | |
| View assigned athletes | ✅ Yes | All athletes in coach's club |
| View athlete profiles | ✅ Yes | Full profile information |
| View athlete attendance | ✅ Yes | Historical and current |
| View athlete performance | ✅ Yes | Stats and metrics |
| Reassign athletes | ❌ No | Admin only |
| **Training Sessions** | | |
| Create sessions | ✅ Yes | For own club |
| Edit sessions | ✅ Yes | Own sessions only |
| Delete sessions | ✅ Yes | Own sessions only |
| View sessions | ✅ Yes | Own club sessions |
| **Attendance** | | |
| Mark attendance | ✅ Yes | For own sessions |
| View attendance reports | ✅ Yes | Own club only |
| Export attendance data | ✅ Yes | Own club only |
| **Leave Requests** | | |
| View leave requests | ✅ Yes | From assigned athletes |
| Approve/reject requests | ✅ Yes | For own athletes |

**Restrictions:**
- Cannot see applications from other clubs (RLS enforced)
- Cannot manage athletes from other clubs
- Cannot access admin features
- Cannot modify system settings
- Cannot view audit logs

#### 👑 Admin Role

**Access Requirements:**
- No restrictions - full system access

**Permissions:**

| Feature | Permission | Notes |
|---------|-----------|-------|
| **Applications** | | |
| View all applications | ✅ Yes | Across all clubs |
| Approve applications | ✅ Yes | Can override coach decisions |
| Reject applications | ✅ Yes | Can override coach decisions |
| Reassign applications | ✅ Yes | Change assigned coach |
| **User Management** | | |
| Create users | ✅ Yes | All roles |
| Edit users | ✅ Yes | Change roles, status |
| Delete users | ✅ Yes | With confirmation |
| View all users | ✅ Yes | Across all clubs |
| Assign roles | ✅ Yes | Admin, Coach, Athlete |
| **Club Management** | | |
| Create clubs | ✅ Yes | New sports/clubs |
| Edit clubs | ✅ Yes | Name, sport type, settings |
| Delete clubs | ✅ Yes | With confirmation |
| Assign coaches to clubs | ✅ Yes | Coach-club relationship |
| **System Management** | | |
| Access system settings | ✅ Yes | Global configuration |
| View audit logs | ✅ Yes | All user actions |
| Run diagnostics | ✅ Yes | Database health checks |
| Execute migrations | ✅ Yes | Database updates |
| **Data Access** | | |
| View all data | ✅ Yes | No RLS restrictions |
| Export data | ✅ Yes | All tables |
| Modify data | ✅ Yes | Direct database access |

**Special Capabilities:**
- Bypass RLS policies (service role)
- Override coach decisions
- Access all clubs and athletes
- Modify system configuration
- View complete audit trail

### Permission Enforcement

**Database Level (RLS Policies):**
```sql
-- Example: Coaches can only see their club's applications
CREATE POLICY "coach_view_own_club_applications"
ON membership_applications FOR SELECT
TO authenticated
USING (
  club_id IN (
    SELECT club_id FROM profiles 
    WHERE user_id = auth.uid() AND role = 'coach'
  )
);
```

**Application Level (Middleware):**
```typescript
// Middleware checks membership_status for athletes
if (profile.role === 'athlete' && 
    profile.membership_status !== 'active') {
  return redirect('/pending-approval');
}
```

**API Level (Server Actions):**
```typescript
// Server actions verify permissions before operations
export async function approveApplication(id: string) {
  const coach = await getCoachProfile();
  const application = await getApplication(id);
  
  // Verify coach owns this club
  if (application.club_id !== coach.club_id) {
    throw new Error('Unauthorized');
  }
  
  // Proceed with approval...
}
```

### Key Features

- **Club-Based Applications**: Athletes apply to clubs, not individual coaches
- **Coach Isolation**: Coaches only see applications for their club (enforced by RLS)
- **Duplicate Prevention**: Athletes cannot have multiple pending applications
- **Atomic Updates**: All status changes are transactional to prevent inconsistencies
- **Rejection Feedback**: Coaches must provide reasons for rejection
- **Reapplication**: Rejected athletes can submit new applications

## Database Setup

### Quick Setup

```bash
# Run all migrations
./scripts/auto-migrate.sh

# Or run specific migrations
./scripts/run-sql-via-api.sh scripts/31-update-membership-applications.sql
./scripts/run-sql-via-api.sh scripts/32-update-profiles-membership-status.sql
./scripts/run-sql-via-api.sh scripts/33-membership-approval-rls.sql
```

### Verify Setup

```bash
# Check data integrity
./scripts/run-sql-via-api.sh scripts/36-diagnose-membership-consistency.sql

# Verify migrations
./scripts/run-sql-via-api.sh scripts/verify-membership-migration-final.sql
```

See [Database Schema Documentation](./docs/MEMBERSHIP_APPROVAL_SYSTEM.md#database-schema) for complete schema details.

## Documentation

### 📚 Essential Reading

Start here for understanding the system:

| Document | Description | Audience |
|----------|-------------|----------|
| **[Membership Approval System](./docs/MEMBERSHIP_APPROVAL_SYSTEM.md)** | Complete system guide with flow diagrams and state transitions | All users |
| **[Troubleshooting Guide](./docs/MEMBERSHIP_TROUBLESHOOTING.md)** | Solutions for common issues and error messages | All users |
| **[Documentation Hub](./docs/README.md)** | Central index of all documentation | All users |

### 🔧 Technical Documentation

For developers and system administrators:

| Document | Description | Audience |
|----------|-------------|----------|
| **[Membership Registration Guide](./docs/MEMBERSHIP_REGISTRATION_GUIDE.md)** | Step-by-step registration process and API usage | Developers |
| **[Technical Documentation](./docs/MEMBERSHIP_TECHNICAL_DOCS.md)** | API specifications, database schema, and integration guides | Developers |
| **[Access Control Implementation](./docs/ACCESS_CONTROL_IMPLEMENTATION.md)** | Security model, RLS policies, and permission system | Developers, Admins |
| **[Membership Helper Functions](./docs/MEMBERSHIP_HELPER_FUNCTIONS.md)** | Database functions and stored procedures | Developers |
| **[Middleware Review](./docs/MIDDLEWARE_REVIEW.md)** | Authentication and authorization middleware | Developers |
| **[Index Optimization Report](./docs/INDEX_OPTIMIZATION_REPORT.md)** | Database performance and indexing strategy | DBAs, Developers |

### 📋 Operational Documentation

For system operations and maintenance:

| Document | Description | Audience |
|----------|-------------|----------|
| **[Migration Guide](./scripts/MIGRATION_GUIDE.md)** | Database migration procedures | Admins, DevOps |
| **[Auto Migration README](./scripts/AUTO_MIGRATION_README.md)** | Automated migration scripts usage | Admins, DevOps |
| **[Production Deployment Guide](./PRODUCTION_DEPLOYMENT_GUIDE.md)** | Production deployment checklist and procedures | DevOps |
| **[Supabase Setup](./SUPABASE_SETUP.md)** | Supabase configuration and setup | Admins, DevOps |
| **[Test Users Guide](./scripts/TEST_USERS.md)** | Test user accounts and credentials | Developers, QA |

### 📊 Reports and Analysis

System health and diagnostic reports:

| Document | Description | Audience |
|----------|-------------|----------|
| **[Membership Diagnostic Report](./docs/MEMBERSHIP_DIAGNOSTIC_REPORT.md)** | Data consistency analysis and findings | Admins, Developers |
| **[Migration Execution Report](./docs/MIGRATION_EXECUTION_REPORT.md)** | Migration execution results and verification | Admins, DevOps |
| **[Migration 40 Report](./docs/MIGRATION_40_REPORT.md)** | Constraint addition and validation results | Admins, Developers |
| **[Membership System Final Summary](./MEMBERSHIP_SYSTEM_FINAL_SUMMARY.md)** | Complete system implementation summary | All users |

### 🎯 Specification Documents

Design and requirements specifications:

#### Core System Specs
| Document | Description |
|----------|-------------|
| [Requirements](.kiro/specs/sports-club-management/requirements.md) | System requirements and acceptance criteria |
| [Design](.kiro/specs/sports-club-management/design.md) | Architecture, components, and design decisions |
| [Implementation Plan](.kiro/specs/sports-club-management/tasks.md) | Development tasks and implementation roadmap |

#### Feature Specs
| Feature | Requirements | Design | Tasks |
|---------|--------------|--------|-------|
| **Membership Approval Fix** | [Requirements](.kiro/specs/membership-approval-fix/requirements.md) | [Design](.kiro/specs/membership-approval-fix/design.md) | [Tasks](.kiro/specs/membership-approval-fix/tasks.md) |
| **Training Attendance** | [Requirements](.kiro/specs/training-attendance/requirements.md) | [Design](.kiro/specs/training-attendance/design.md) | [Tasks](.kiro/specs/training-attendance/tasks.md) |
| **Membership Registration** | - | - | [Tasks](.kiro/specs/membership-registration/tasks.md) |

### 🧪 Testing Documentation

Test guides and results:

| Document | Description | Audience |
|----------|-------------|----------|
| **[Manual Testing Checklist](./MANUAL_TESTING_CHECKLIST.md)** | Complete manual testing procedures | QA, Developers |
| **[Manual Testing Execution Guide](./MANUAL_TESTING_EXECUTION_GUIDE.md)** | Step-by-step testing instructions | QA |
| **[Test Results Summary](./TEST_RESULTS_SUMMARY.md)** | Latest test execution results | All users |
| **[Quick Test Reference](./QUICK_TEST_REFERENCE.md)** | Quick reference for common test scenarios | QA, Developers |

### 📖 How to Use This Documentation

**For New Developers:**
1. Start with [Membership Approval System](./docs/MEMBERSHIP_APPROVAL_SYSTEM.md)
2. Read [Technical Documentation](./docs/MEMBERSHIP_TECHNICAL_DOCS.md)
3. Review [Access Control Implementation](./docs/ACCESS_CONTROL_IMPLEMENTATION.md)
4. Check [Troubleshooting Guide](./docs/MEMBERSHIP_TROUBLESHOOTING.md)

**For System Administrators:**
1. Read [Production Deployment Guide](./PRODUCTION_DEPLOYMENT_GUIDE.md)
2. Review [Migration Guide](./scripts/MIGRATION_GUIDE.md)
3. Check [Membership Diagnostic Report](./docs/MEMBERSHIP_DIAGNOSTIC_REPORT.md)
4. Keep [Troubleshooting Guide](./docs/MEMBERSHIP_TROUBLESHOOTING.md) handy

**For End Users (Athletes/Coaches):**
1. Start with this README's [Quick Start Guide](#quick-start-guide)
2. Review [Membership Approval Flow](#membership-approval-flow)
3. Check [User Roles and Permissions](#user-roles-and-permissions)
4. Refer to [Troubleshooting Guide](./docs/MEMBERSHIP_TROUBLESHOOTING.md) for issues

## Troubleshooting

### Common Issues

**"Can't access dashboard after approval"**
- Check `profiles.membership_status` is set to `active`
- Logout and login again to refresh session
- See [Troubleshooting Guide](./docs/MEMBERSHIP_TROUBLESHOOTING.md#issue-4-athlete-cant-access-dashboard-after-approval)

**"Duplicate application error"**
- Check for existing pending applications
- Reject or approve old application
- See [Troubleshooting Guide](./docs/MEMBERSHIP_TROUBLESHOOTING.md#issue-6-duplicate-application-error-when-no-pending-application-visible)

**"Coach can't see applications"**
- Verify coach is assigned to a club
- Check RLS policies are enabled
- See [Troubleshooting Guide](./docs/MEMBERSHIP_TROUBLESHOOTING.md#issue-5-coach-cant-see-applications-for-their-club)

For more issues and solutions, see the [complete troubleshooting guide](./docs/MEMBERSHIP_TROUBLESHOOTING.md).

## License

Private project - All rights reserved
