import NextAuth, { AuthOptions } from "next-auth" // เพิ่ม AuthOptions
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

// 1. แยก Config ออกมาเป็นตัวแปร และใส่ export
export const authOptions: AuthOptions = {
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
            if (user) token.role = (user as any).role
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role
            }
            return session
        }
    },
    pages: { signIn: '/login' },
    secret: process.env.NEXTAUTH_SECRET,
}

// 2. เรียกใช้ตรงนี้
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }