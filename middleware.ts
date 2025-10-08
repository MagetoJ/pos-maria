import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get("userRole")?.value
  const userId = request.cookies.get("userId")?.value
  const pathname = request.nextUrl.pathname

  // Public routes
  if (pathname === "/" || pathname === "/login" || pathname.startsWith("/qr-order")) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!userId || !userRole) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const roleRoutes: Record<string, string[]> = {
    admin: ["/admin", "/waiter", "/receptionist"],
    waiter: ["/waiter"],
    reception: ["/receptionist"],
  }

  const allowedRoutes = roleRoutes[userRole] || []
  const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route))

  if (!hasAccess) {
    // Redirect to appropriate dashboard based on role
    const defaultRoutes: Record<string, string> = {
      admin: "/admin",
      waiter: "/waiter",
      reception: "/receptionist",
    }
    return NextResponse.redirect(new URL(defaultRoutes[userRole] || "/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)"],
}
