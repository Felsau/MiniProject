### 1. Install Dependencies

```bash
npm install
```

This will install all production and development dependencies including:
- Next.js, React, TypeScript
- Tailwind CSS, PostCSS
- Prisma ORM, NextAuth.js
- Lucide React icons, bcrypt
- ESLint, Babel plugins, and type definitions

### 2. Setup Environment Variables

```bash

cp .env.example .env


```

### 3. Setup Database

```bash
npx prisma generate

npx prisma migrate dev

npx ts-node prisma/seed.ts
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 👤 Test Accounts

After seeding the database, you can login with these accounts (password: `123456`):

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| `admin` | `123456` | ADMIN | Full system access |
| `hr` | `123456` | HR | Can manage all jobs |
| `john.dev` | `123456` | USER | Regular user |
| `jane.design` | `123456` | USER | Regular user |


website/
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Prisma schema definition
│   ├── seed.ts          # Database seeding script
│   └── migrations/      # Migration files
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── api/         # API routes
│   │   ├── dashboard/   # Dashboard page
│   │   ├── login/       # Login page
│   │   └── ...
│   ├── components/      # React components
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript type definitions
└── public/              # Static assets


```bash
# Development
npm run dev              # Start development server

# Build & Production
npm run build            # Build for production
npm start                # Start production server

# Database Management
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Create and apply migrations
npm run db:seed          # Seed database with initial data
npm run db:studio        # Open Prisma Studio (Database GUI)
npm run db:reset         # Reset database and re-seed

# Code Quality
npm run lint             # Run ESLint


Create a .env

env
DATABASE_URL="file:./prisma/Database.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

## 📦 Installed npm Packages

### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| @prisma/client | 5.19.0 | Database ORM client |
| bcrypt | ^6.0.0 | Password hashing for authentication |
| lucide-react | ^0.563.0 | Icon library (ArrowLeft, Save, Edit, etc.) |
| next | 16.1.4 | React framework with App Router |
| next-auth | ^4.24.13 | Authentication & session management |
| openai | ^6.16.0 | OpenAI API integration |
| prisma | 5.19.0 | Database ORM |
| react | 19.2.3 | UI library |
| react-dom | 19.2.3 | React DOM |

### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| @prisma/client | ^5.22.0 | Prisma type definitions |
| @tailwindcss/postcss | ^4 | Tailwind CSS PostCSS plugin |
| @types/bcrypt | ^6.0.0 | TypeScript types for bcrypt |
| @types/node | ^20 | Node.js TypeScript types |
| @types/react | ^19 | React TypeScript types |
| @types/react-dom | ^19 | React DOM TypeScript types |
| babel-plugin-react-compiler | 1.0.0 | React compiler plugin |
| eslint | ^9 | Code linter |
| eslint-config-next | 16.1.4 | ESLint configuration for Next.js |
| prisma | ^5.22.0 | Prisma CLI |
| tailwindcss | ^4 | CSS utility framework |
| typescript | ^5 | TypeScript language |

### To Install Additional Packages
```bash
npm install <package-name>                   
npm install <package-name> --save-dev         
```