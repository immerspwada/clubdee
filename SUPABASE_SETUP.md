# Supabase Setup Guide

This guide will help you set up Supabase for the Sports Club Management System.

## Prerequisites

- Node.js 18+ installed
- npm or yarn installed
- A Supabase account (sign up at https://supabase.com)

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in the project details:
   - **Name**: Sports Club Management
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (takes ~2 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

## Step 3: Configure Environment Variables

1. In your project root, copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Step 4: Install Supabase CLI

Install the Supabase CLI globally:

```bash
npm install -g supabase
```

Or use npx (no installation required):

```bash
npx supabase --help
```

## Step 5: Link Your Project

Link your local project to your Supabase project:

```bash
npx supabase link --project-ref your-project-id
```

You can find your project ID in the Supabase dashboard URL:
`https://supabase.com/dashboard/project/[your-project-id]`

## Step 6: Run Migrations

Apply all database migrations to your Supabase project:

```bash
npx supabase db push
```

This will:
- Create all tables (clubs, athletes, coaches, training_sessions, etc.)
- Set up RLS helper functions
- Apply RLS policies
- Create indexes and triggers

## Step 7: Verify the Setup

1. Go to your Supabase dashboard
2. Navigate to **Table Editor**
3. You should see all the tables:
   - user_roles
   - clubs
   - athletes
   - coaches
   - training_sessions
   - attendance_logs
   - performance_records
   - announcements

## Step 8: Create Your First Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Enter email and password
4. Click "Create user"
5. Copy the user's UUID

6. In **SQL Editor**, run this query to make them an admin:
   ```sql
   INSERT INTO user_roles (user_id, role)
   VALUES ('paste-user-uuid-here', 'admin');
   ```

## Step 9: Test the Connection

Run your development server:

```bash
npm run dev
```

Visit http://localhost:3000 and try to:
1. Register a new user
2. Login with your admin account
3. Access the admin dashboard

## Troubleshooting

### Migration Errors

If migrations fail:

1. Check the error message in the terminal
2. Go to Supabase dashboard → **SQL Editor**
3. Try running the migration SQL manually
4. Check for syntax errors or missing dependencies

### Connection Issues

If you can't connect to Supabase:

1. Verify your `.env.local` file has correct values
2. Check that your Supabase project is active
3. Ensure your API keys are correct (no extra spaces)
4. Restart your development server

### RLS Policy Issues

If you get "permission denied" errors:

1. Check that RLS is enabled on the table
2. Verify the user has a role in `user_roles` table
3. Check the RLS policies in **Authentication** → **Policies**
4. Test policies in SQL Editor with `SET ROLE` commands

## Advanced: Local Development with Supabase

For local development without internet:

```bash
# Start local Supabase
npx supabase start

# Stop local Supabase
npx supabase stop

# Reset local database
npx supabase db reset
```

Update `.env.local` for local development:
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
```

## GitHub Actions Setup (Optional)

To enable automated deployments:

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `SUPABASE_ACCESS_TOKEN`: Get from Supabase dashboard → Settings → Access Tokens
   - `SUPABASE_DB_PASSWORD`: Your database password
   - `SUPABASE_PROJECT_ID`: Your project reference ID
   - `VERCEL_TOKEN`: Get from Vercel account settings
   - `VERCEL_ORG_ID`: Get from Vercel project settings
   - `VERCEL_PROJECT_ID`: Get from Vercel project settings

3. Push to main branch to trigger automatic deployment

## Next Steps

After setup is complete:

1. ✅ Supabase project created
2. ✅ Environment variables configured
3. ✅ Migrations applied
4. ✅ Admin user created
5. ➡️ Proceed to Task 3: Authentication System

## Useful Commands

```bash
# Generate TypeScript types from database
npx supabase gen types typescript --project-id your-project-id > types/database.types.ts

# Create a new migration
npx supabase migration new migration_name

# View migration status
npx supabase migration list

# Rollback last migration (local only)
npx supabase db reset

# View database logs
npx supabase db logs
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
