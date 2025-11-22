# Sports Club Management System

A comprehensive web application for managing sports clubs, athletes, coaches, and training activities.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React Server Components, TailwindCSS, shadcn/ui
- **Backend**: Supabase (Auth, Database, Realtime, Edge Functions)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Testing**: Vitest (unit tests), fast-check (property-based tests)
- **Deployment**: Vercel (Frontend), Supabase (Backend)

## Features

- 🔐 Role-based authentication (Admin, Coach, Athlete)
- 👥 User management with RLS security
- 🏋️ Training session scheduling
- ✅ Attendance tracking with QR code check-in
- 📊 Performance tracking and analytics
- 📢 Announcement system
- 📱 Progressive Web App (PWA) support
- 📈 Reporting and data export

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

   ```bash
   cp .env.local.example .env.local
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

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

## Database Setup

See `.kiro/specs/sports-club-management/design.md` for the complete database schema and RLS policies.

## Documentation

- [Requirements](.kiro/specs/sports-club-management/requirements.md)
- [Design](.kiro/specs/sports-club-management/design.md)
- [Implementation Plan](.kiro/specs/sports-club-management/tasks.md)

## License

Private project - All rights reserved
