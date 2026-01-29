# 📁 Project Structure Documentation

## Overview
This document provides a comprehensive overview of the Job Recruitment System's file structure and organization.

## Directory Structure

```
website/
│
├── 📂 prisma/                      # Database configuration
│   ├── schema.prisma               # Database schema definition
│   ├── seed.ts                     # Database seeding script
│   ├── Database.db                 # SQLite database file
│   └── migrations/                 # Database migration history
│       ├── migration_lock.toml
│       ├── 20260128151040_add_job_table/
│       ├── 20260128162905_add_profile_fields/
│       └── 20260129171002_init_migration/
│
├── 📂 src/                         # Source code
│   │
│   ├── 📂 app/                     # Next.js App Router
│   │   ├── layout.tsx              # Root layout component
│   │   ├── page.tsx                # Home page
│   │   ├── globals.css             # Global styles
│   │   │
│   │   ├── 📂 api/                 # API routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts    # NextAuth configuration
│   │   │   ├── job/
│   │   │   │   └── route.ts        # Job API endpoints
│   │   │   └── register/
│   │   │       └── route.tsx       # User registration API
│   │   │
│   │   ├── 📂 dashboard/           # Dashboard page
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📂 login/               # Login page
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📂 register/            # Registration page
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📂 profile/             # User profile page
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📂 create-job/          # Job creation page
│   │   │   └── page.tsx
│   │   │
│   │   └── 📂 about/               # About page
│   │       └── page.tsx
│   │
│   ├── 📂 components/              # Reusable React components
│   │   ├── Navbar.tsx              # Navigation bar
│   │   ├── Sidebar.tsx             # Sidebar navigation
│   │   ├── LogoutButton.tsx        # Logout functionality
│   │   ├── DeleteJobButton.tsx     # Job deletion
│   │   ├── RegisterForm.tsx        # Registration form
│   │   ├── SessionProvider.tsx     # Auth session provider
│   │   │
│   │   └── 📂 jobs/                # Job-related components
│   │       ├── JobGrid.tsx         # Job listing grid
│   │       ├── CreateJobModal.tsx  # Job creation modal
│   │       └── types.ts            # Job type definitions
│   │
│   ├── 📂 actions/                 # Server actions
│   │   └── jobActions.ts           # Job-related actions
│   │
│   ├── 📂 lib/                     # Utility libraries
│   │   └── prisma.ts               # Prisma client singleton
│   │
│   └── 📂 types/                   # TypeScript type definitions
│       └── next-auth.d.ts          # NextAuth type extensions
│
├── 📂 public/                      # Static assets
│
├── 📄 Configuration Files
│   ├── .env                        # Environment variables (gitignored)
│   ├── .env.example                # Environment template
│   ├── .gitignore                  # Git ignore rules
│   ├── eslint.config.mjs           # ESLint configuration
│   ├── next.config.ts              # Next.js configuration
│   ├── next-env.d.ts               # Next.js TypeScript declarations
│   ├── postcss.config.mjs          # PostCSS configuration
│   ├── tsconfig.json               # TypeScript configuration
│   ├── package.json                # Project dependencies & scripts
│   └── package-lock.json           # Locked dependencies
│
└── 📄 README.md                    # Project documentation
```

## Key Files Explained

### Database Layer (`prisma/`)

**schema.prisma**
- Defines database models: User, Job, departments, job_position
- Configures SQLite as the database provider
- Sets up relations between models

**seed.ts**
- Populates database with sample data
- Creates test users (admin, hr, regular users)
- Generates sample job postings

### Application Layer (`src/app/`)

**Layout & Pages**
- `layout.tsx`: Root layout with navigation and session provider
- `page.tsx`: Landing page with job listings
- Route-specific pages in their own folders

**API Routes (`api/`)**
- `auth/[...nextauth]/route.ts`: Handles authentication
- `job/route.ts`: Job CRUD operations
- `register/route.tsx`: User registration endpoint

### Component Layer (`src/components/`)

**Navigation**
- `Navbar.tsx`: Top navigation bar
- `Sidebar.tsx`: Side navigation menu

**Job Components**
- `JobGrid.tsx`: Displays job listings in grid
- `CreateJobModal.tsx`: Modal for creating jobs
- `DeleteJobButton.tsx`: Job deletion with confirmation

**Auth Components**
- `LogoutButton.tsx`: Sign out functionality
- `RegisterForm.tsx`: User registration form
- `SessionProvider.tsx`: Wraps app with auth context

### Utility Layer (`src/lib/`, `src/actions/`)

**lib/prisma.ts**
- Singleton Prisma client instance
- Prevents multiple database connections
- Optimized for development and production

**actions/jobActions.ts**
- Server actions for job operations
- Type-safe data mutations

### Configuration Files

**.env.example**
- Template for environment variables
- Documents required configuration
- Safe to commit to version control

**package.json**
- Project metadata
- Dependencies management
- Custom scripts for database operations

**tsconfig.json**
- TypeScript compiler options
- Path aliases configuration
- Strict type checking enabled

## Development Workflow

### 1. Database Changes
```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
npm run db:migrate

# 3. Regenerate client
npm run db:generate

# 4. (Optional) Seed database
npm run db:seed
```

### 2. Adding New Features
```
# 1. Create component in src/components/
# 2. Add page in src/app/[feature]/
# 3. Add API route if needed in src/app/api/
# 4. Add server actions in src/actions/
```

### 3. Environment Setup
```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env with your values

# 3. Generate Prisma client
npm run db:generate
```

## Best Practices

### File Naming
- Components: PascalCase (e.g., `JobGrid.tsx`)
- Pages: lowercase (e.g., `page.tsx`)
- Utilities: camelCase (e.g., `jobActions.ts`)
- Types: camelCase with `.d.ts` extension

### Component Organization
- One component per file
- Co-locate related components in folders
- Export types alongside components

### API Routes
- Use REST conventions
- Return proper HTTP status codes
- Include error handling

### Database
- Never commit `.env` or `Database.db`
- Always create migrations for schema changes
- Test seeds before committing

## Security Notes

🔒 **Never Commit:**
- `.env` file (contains secrets)
- `Database.db` (contains user data)
- `node_modules/` (large, regenerable)

✅ **Always Commit:**
- `.env.example` (template only)
- `migrations/` (version control)
- `schema.prisma` (source of truth)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
