"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

