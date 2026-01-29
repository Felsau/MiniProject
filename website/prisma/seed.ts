// ============================================
// Database Seed Script
// ============================================

import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('\n🌱 Starting database seed...')
  console.log('================================\n')

  // Clear existing data
  console.log('🗑️  Cleaning old data...')
  await prisma.job.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Old data cleared\n')

  // Hash password (all users use: 123456)
  const passwordHash = await bcrypt.hash('123456', 10)

  // ============================================
  // Create Users
  // ============================================
  console.log('👥 Creating users...')

  // 1. Admin User
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: passwordHash,
      role: 'ADMIN',
      fullName: 'Somchai Administrator',
      email: 'admin@company.com',
      phone: '081-111-1111',
      position: 'Chief Technology Officer',
      bio: 'Oversees all technical operations and system architecture.'
    }
  })
  console.log('  ✓ Admin created:', admin.username)

  // 2. HR Manager
  const hr = await prisma.user.create({
    data: {
      username: 'hr',
      password: passwordHash,
      role: 'HR',
      fullName: 'Sudsuay Jaidee',
      email: 'hr@company.com',
      phone: '082-222-2222',
      position: 'Human Resources Manager',
      bio: 'Manages recruitment and employee relations.'
    }
  })
  console.log('  ✓ HR created:', hr.username)

  // 3. Regular Users
  const user1 = await prisma.user.create({
    data: {
      username: 'john.dev',
      password: passwordHash,
      role: 'USER',
      fullName: 'John Developer',
      email: 'john@company.com',
      phone: '083-333-3333',
      position: 'Senior Full-Stack Developer',
      bio: '5 years experience in web development. Love coding!'
    }
  })
  console.log('  ✓ User created:', user1.username)

  const user2 = await prisma.user.create({
    data: {
      username: 'jane.design',
      password: passwordHash,
      role: 'USER',
      fullName: 'Jane Designer',
      email: 'jane@company.com',
      phone: '084-444-4444',
      position: 'UI/UX Designer',
      bio: 'Passionate about creating beautiful user experiences.'
    }
  })
  console.log('  ✓ User created:', user2.username)

  // ============================================
  // Create Job Postings
  // ============================================
  console.log('\n💼 Creating job postings...')

  // Jobs by Admin
  await prisma.job.createMany({
    data: [
      {
        title: 'Senior React Developer',
        department: 'IT - Development',
        location: 'Bangkok (Hybrid)',
        salary: '60,000 - 80,000 THB',
        description: 'We are looking for an experienced React developer to join our frontend team. Must have strong knowledge in Next.js, TypeScript, and modern web technologies.',
        employmentType: 'FULL_TIME',
        postedBy: admin.id
      },
      {
        title: 'DevOps Engineer',
        department: 'IT - Infrastructure',
        location: 'Bangkok',
        salary: '70,000 - 90,000 THB',
        description: 'Seeking a skilled DevOps engineer to manage our cloud infrastructure, CI/CD pipelines, and automation processes. Experience with AWS, Docker, and Kubernetes required.',
        employmentType: 'FULL_TIME',
        postedBy: admin.id
      },
      {
        title: 'Backend Developer (Node.js)',
        department: 'IT - Development',
        location: 'Remote',
        salary: '50,000 - 70,000 THB',
        description: 'Join our backend team to build scalable APIs and microservices. Strong experience with Node.js, Express, and database design is essential.',
        employmentType: 'FULL_TIME',
        postedBy: admin.id
      }
    ]
  })
  console.log('  ✓ 3 jobs created by Admin')

  // Jobs by HR
  await prisma.job.createMany({
    data: [
      {
        title: 'Marketing Specialist',
        department: 'Marketing',
        location: 'Chiang Mai',
        salary: '30,000 - 40,000 THB',
        description: 'Looking for a creative marketing specialist to manage our social media, content creation, and digital marketing campaigns.',
        employmentType: 'FULL_TIME',
        postedBy: hr.id
      },
      {
        title: 'HR Coordinator',
        department: 'Human Resources',
        location: 'Bangkok',
        salary: '35,000 - 45,000 THB',
        description: 'Support HR operations including recruitment, onboarding, and employee engagement activities.',
        employmentType: 'FULL_TIME',
        postedBy: hr.id
      },
      {
        title: 'Sales Executive',
        department: 'Sales',
        location: 'Bangkok',
        salary: '25,000 + Commission',
        description: 'Dynamic sales role with excellent commission structure. Experience in B2B sales preferred.',
        employmentType: 'FULL_TIME',
        postedBy: hr.id
      }
    ]
  })
  console.log('  ✓ 3 jobs created by HR')

  // Jobs by Regular Users
  await prisma.job.create({
    data: {
      title: 'Junior Frontend Developer',
      department: 'IT - Development',
      location: 'Bangkok',
      salary: '25,000 - 35,000 THB',
      description: 'Great opportunity for fresh graduates or junior developers to learn and grow. We provide mentorship and training in modern web technologies.',
      employmentType: 'INTERNSHIP',
      postedBy: user1.id
    }
  })
  console.log('  ✓ 1 job created by', user1.username)

  await prisma.job.create({
    data: {
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Remote',
      salary: '40,000 - 55,000 THB',
      description: 'Create beautiful and intuitive user interfaces. Work with modern design tools like Figma, and collaborate closely with developers.',
      employmentType: 'CONTRACT',
      postedBy: user2.id
    }
  })
  console.log('  ✓ 1 job created by', user2.username)

  // ============================================
  // Summary
  // ============================================
  const userCount = await prisma.user.count()
  const jobCount = await prisma.job.count()

  console.log('\n================================')
  console.log('✅ Database seeding completed!')
  console.log('================================')
  console.log(`👥 Users created: ${userCount}`)
  console.log(`💼 Jobs created: ${jobCount}`)
  console.log('\n🔑 Login credentials (password: 123456):')
  console.log('   - admin / 123456 (Admin)')
  console.log('   - hr / 123456 (HR)')
  console.log('   - john.dev / 123456 (User)')
  console.log('   - jane.design / 123456 (User)')
  console.log('================================\n')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })