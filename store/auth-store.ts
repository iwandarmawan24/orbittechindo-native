import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

// JWT token expiration time (24 hours)
const TOKEN_EXPIRATION = 60 * 60 * 24

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (email: string, name: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  checkAuth: () => boolean
}

// Mock user database
const MOCK_USERS: Record<string, { id: string; email: string; name: string; password: string }> = {
  "user@example.com": {
    id: "user-1",
    email: "user@example.com",
    name: "Demo User",
    password: "password123",
  },
}

// Helper function to generate a JWT-like token
function generateJWT(payload: any): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  const now = Math.floor(Date.now() / 1000)
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + TOKEN_EXPIRATION,
  }

  // Encode header and payload
  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(tokenPayload))

  // Simple signature (not secure, just for demo)
  const signature = btoa(JSON.stringify(header) + JSON.stringify(tokenPayload) + "secret")

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

// Helper function to verify a JWT-like token
function verifyJWT(token: string): string | object {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split(".")

    // Decode payload
    const payload = JSON.parse(atob(encodedPayload))

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      throw new Error("Token expired")
    }

    return payload
  } catch (error) {
    throw new Error("Invalid token")
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (email: string, password: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Check if user exists in our mock database
        const user = MOCK_USERS[email.toLowerCase()]

        // For demo purposes, also allow any email with "password" as the password
        if (user && user.password === password) {
          // Create a JWT-like token
          const token = generateJWT({
            id: user.id,
            email: user.email,
            name: user.name,
          })

          set({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
            },
            isAuthenticated: true,
            token,
          })

          return { success: true, message: "Login successful" }
        } else if (password === "password") {
          // Allow any email with "password" as password for demo purposes
          const userId = `user-${Date.now()}`
          const token = generateJWT({
            id: userId,
            email,
            name: email.split("@")[0],
          })

          set({
            user: {
              id: userId,
              email,
              name: email.split("@")[0],
            },
            isAuthenticated: true,
            token,
          })

          return { success: true, message: "Login successful" }
        }

        return { success: false, message: "Invalid email or password" }
      },

      register: async (email: string, name: string, password: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check if user already exists
        if (MOCK_USERS[email.toLowerCase()]) {
          return { success: false, message: "User already exists" }
        }

        // Create a new user
        const userId = `user-${Date.now()}`

        // In a real app, we would save this to a database
        // For this mock implementation, we'll add it to our in-memory store
        MOCK_USERS[email.toLowerCase()] = {
          id: userId,
          email,
          name,
          password,
        }

        // Create a JWT-like token
        const token = generateJWT({
          id: userId,
          email,
          name,
        })

        set({
          user: {
            id: userId,
            email,
            name,
          },
          isAuthenticated: true,
          token,
        })

        return { success: true, message: "Registration successful" }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
        })
      },

      checkAuth: () => {
        const { token } = get()

        if (!token) return false

        try {
          // Verify the token
          const decoded = verifyJWT(token)

          // Check if token is expired
          if (!decoded || typeof decoded === "string") {
            return false
          }

          return true
        } catch (error) {
          // Token is invalid
          set({
            user: null,
            isAuthenticated: false,
            token: null,
          })
          return false
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage), // Explicitly use localStorage
    },
  ),
)

