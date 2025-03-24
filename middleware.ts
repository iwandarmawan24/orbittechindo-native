import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// JWT verification function (simplified for client-side)
function isValidToken(token: string): boolean {
  try {
    if (!token) return false

    // Parse the token (in a real app, we would verify the signature)
    const [_, encodedPayload] = token.split(".")
    if (!encodedPayload) return false

    // Decode the payload
    const payload = JSON.parse(atob(encodedPayload))

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return false
    }

    return true
  } catch (error) {
    return false
  }
}

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/auth/login" || path === "/auth/register"

  // For protected routes only - don't check auth for public routes
  // if (path.startsWith("/movies/")) {
  //   // Get the token from localStorage (via cookies in server context)
  //   const authStorage = request.cookies.get("auth-storage")?.value
  //   let isAuthenticated = false

  //   if (authStorage) {
  //     try {
  //       // Parse the auth storage to get the token
  //       const parsedStorage = JSON.parse(authStorage)
  //       const token = parsedStorage.state?.token

  //       // Verify the token
  //       isAuthenticated = token ? isValidToken(token) : false
  //     } catch (error) {
  //       isAuthenticated = false
  //     }
  //   }

  //   // If the user is not authenticated for a protected route, redirect to login
  //   if (!isAuthenticated) {
  //     return NextResponse.redirect(new URL("/auth/login", request.url))
  //   }
  // }

  // If the user is authenticated and tries to access login/register, redirect to home
  if (isPublicPath) {
    const authStorage = request.cookies.get("auth-storage")?.value
    let isAuthenticated = false

    if (authStorage) {
      try {
        const parsedStorage = JSON.parse(authStorage)
        const token = parsedStorage.state?.token
        isAuthenticated = token ? isValidToken(token) : false
      } catch (error) {
        isAuthenticated = false
      }
    }

    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/movies/:path*", "/auth/login", "/auth/register"],
}

