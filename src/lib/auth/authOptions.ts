import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db/prisma"
import bcrypt from "bcrypt"

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
            if (user) token.role = (user as { role: string }).role
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as { role: string }).role = token.role as string
            }
            return session
        }
    },
    pages: { signIn: '/login' },
    secret: process.env.NEXTAUTH_SECRET,
}
