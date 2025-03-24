"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Mock user database (similar to the web version)
const MOCK_USERS: Record<string, { id: string; email: string; name: string; password: string }> = {
  "user@example.com": {
    id: "user-1",
    email: "user@example.com",
    name: "Demo User",
    password: "password123",
  },
}

// JWT token expiration time (24 hours)
const TOKEN_EXPIRATION = 60 * 60 * 24

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (email: string, name: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing auth on app start
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const authData = await AsyncStorage.getItem("auth")

        if (authData) {
          const { user, token } = JSON.parse(authData)

          try {
            // Verify the token
            verifyJWT(token)
            setUser(user)
            setIsAuthenticated(true)
          } catch (error) {
            // Token is invalid or expired
            await AsyncStorage.removeItem("auth")
          }
        }
      } catch (error) {
        console.error("Failed to load auth state:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAuthState()
  }, [])

  const login = async (email: string, password: string) => {
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

      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
      }

      setUser(userData)
      setIsAuthenticated(true)

      // Save to AsyncStorage
      await AsyncStorage.setItem("auth", JSON.stringify({ user: userData, token }))

      return { success: true, message: "Login successful" }
    } else if (password === "password") {
      // Allow any email with "password" as password for demo purposes
      const userId = `user-${Date.now()}`
      const token = generateJWT({
        id: userId,
        email,
        name: email.split("@")[0],
      })

      const userData = {
        id: userId,
        email,
        name: email.split("@")[0],
      }

      setUser(userData)
      setIsAuthenticated(true)

      // Save to AsyncStorage
      await AsyncStorage.setItem("auth", JSON.stringify({ user: userData, token }))

      return { success: true, message: "Login successful" }
    }

    return { success: false, message: "Invalid email or password" }
  }

  const register = async (email: string, name: string, password: string) => {
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

    const userData = {
      id: userId,
      email,
      name,
    }

    setUser(userData)
    setIsAuthenticated(true)

    // Save to AsyncStorage
    await AsyncStorage.setItem("auth", JSON.stringify({ user: userData, token }))

    return { success: true, message: "Registration successful" }
  }

  const logout = async () => {
    setUser(null)
    setIsAuthenticated(false)
    await AsyncStorage.removeItem("auth")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

