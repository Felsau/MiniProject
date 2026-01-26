import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { username: credentials?.username }
                })

                if (!user) return null

                const isMatch = await bcrypt.compare(credentials!.password, user.password)

                if (isMatch) {
                    // ส่ง Role ออกไปให้ JWT
                    return {
                        id: user.id.toString(),
                        name: user.username,
                        role: user.role 
                    }
                }
                return null
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // รับไม้ผลัดที่ 1: จาก Authorize -> JWT
            if (user) {
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            // รับไม้ผลัดที่ 2: จาก JWT -> Session (หน้าบ้าน)
            if (session.user) {
                session.user.role = token.role // ตอนนี้ TypeScript จะไม่แดงแล้ว!
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }