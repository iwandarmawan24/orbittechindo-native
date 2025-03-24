"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"

interface AuthCheckProps {
  children: React.ReactNode
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const [verified, setVerified] = useState(false)

  // Only run on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      if (isAuthenticated) {
        const isValid = checkAuth()
        if (isValid) {
          setVerified(true)
        } else {
          router.push("/auth/login")
        }
      } else {
        router.push("/auth/login")
      }
    }
    console.log("mounted", mounted)
  }, [mounted, isAuthenticated, checkAuth, router])

  if (!mounted || !verified) {
    return null
  }

  return <>{children}</>
}

