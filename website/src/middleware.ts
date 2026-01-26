import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// เขียนแบบ Explicit function ตามที่ Next.js 16 ต้องการ
export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
)

export const config = { 
  matcher: ["/dashboard/:path*", "/register"] 
}