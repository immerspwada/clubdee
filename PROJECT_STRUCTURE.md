# Project Structure

## Directory Overview

```
sports-club-management/
├── app/                          # Next.js App Router
│   ├── dashboard/
│   │   ├── admin/               # Admin dashboard pages
│   │   ├── coach/               # Coach dashboard pages
│   │   └── athlete/             # Athlete dashboard pages
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── auth/                    # Authentication components
│   ├── admin/                   # Admin-specific components
│   ├── coach/                   # Coach-specific components
│   └── athlete/                 # Athlete-specific components
│
├── lib/                         # Utility libraries
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── server.ts           # Server Supabase client
│   │   └── middleware.ts       # Supabase middleware utilities
│   └── utils.ts                # General utility functions
│
├── types/                       # TypeScript type definitions
│   ├── database.types.ts       # Database types (Supabase generated)
│   └── index.ts                # Application types
│
├── hooks/                       # Custom React hooks
│
├── tests/                       # Test files
│   ├── setup.ts                # Test setup configuration
│   └── sample.test.ts          # Sample tests
│
├── middleware.ts                # Next.js middleware
├── vitest.config.ts            # Vitest configuration
├── .env.local.example          # Environment variables template
└── README.md                   # Project documentation
```

## Key Files

### Configuration Files

- **next.config.ts**: Next.js configuration
- **tailwind.config.ts**: TailwindCSS configuration
- **tsconfig.json**: TypeScript configuration
- **vitest.config.ts**: Vitest testing configuration
- **eslint.config.mjs**: ESLint configuration
- **.prettierrc**: Prettier code formatting configuration
- **components.json**: shadcn/ui configuration

### Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development Workflow

1. **Start development server**: `npm run dev`
2. **Run tests**: `npm test`
3. **Run tests with UI**: `npm run test:ui`
4. **Lint code**: `npm run lint`
5. **Format code**: `npm run format`
6. **Build for production**: `npm run build`

## Testing Strategy

- **Unit Tests**: Located in `tests/` directory, using Vitest
- **Property-Based Tests**: Using fast-check library
- **Test Coverage**: Run `npm run test:coverage` to generate coverage report

## Component Organization

### UI Components (`components/ui/`)

- Reusable UI components from shadcn/ui
- Button, Input, Card, Dialog, etc.

### Feature Components

- **auth/**: Login, Registration, OTP verification
- **admin/**: User management, Club management, Dashboard
- **coach/**: Athlete management, Training sessions, Attendance
- **athlete/**: Profile, Schedule, Performance history

## Supabase Integration

### Client Types

- **Browser Client** (`lib/supabase/client.ts`): For client components
- **Server Client** (`lib/supabase/server.ts`): For server components and API routes
- **Middleware** (`lib/supabase/middleware.ts`): For session management

### Database Types

- Auto-generated types in `types/database.types.ts`
- Run `npx supabase gen types typescript --project-id <project-id> > types/database.types.ts` to regenerate

## Next Steps

1. Set up Supabase project and configure environment variables
2. Implement database schema (Task 2)
3. Build authentication system (Task 3)
4. Develop role-specific dashboards (Tasks 4-7)

## Notes

- All routes under `/dashboard/*` are protected by authentication middleware
- RLS policies will be enforced at the database level
- Property-based tests are marked as optional in the task list
