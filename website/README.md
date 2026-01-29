# 🚀 Job Recruitment System

A modern job recruitment platform built with Next.js 16, Prisma, and NextAuth. This system allows users to browse job postings, and authenticated users can create and manage job listings.

## ✨ Features

- 🔐 **Authentication System**: Secure login with NextAuth and bcrypt password hashing
- 👥 **Role-Based Access**: Admin, HR, and User roles with different permissions
- 💼 **Job Management**: Create, view, update, and delete job postings
- 📊 **User Profiles**: Complete profile management with personal information
- 🎨 **Modern UI**: Clean and responsive design with Tailwind CSS
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Password Hashing**: bcrypt

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and set your values
# Important: Generate a secure NEXTAUTH_SECRET
```

### 3. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database with sample data
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

## 📁 Project Structure

```
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
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server

# Build
npm run build            # Build for production
npm start                # Start production server

# Database
npx prisma studio        # Open Prisma Studio (Database GUI)
npx prisma migrate dev   # Create and apply migrations
npx ts-node prisma/seed.ts  # Seed database

# Code Quality
npm run lint             # Run ESLint
```

## 📝 Database Schema

### User Model
- Authentication (username, password)
- Role management (ADMIN, HR, USER)
- Profile information (fullName, email, phone, position, bio)
- Relations to Job postings

### Job Model
- Job details (title, department, location, salary, description)
- Timestamps (createdAt, updatedAt)
- Author relationship

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./prisma/Database.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created with ❤️ by the Development Team
