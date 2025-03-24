"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"
import { useAuthStore } from "@/store/auth-store"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Film } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  // Only run on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push("/")
    }
  }, [mounted, isAuthenticated, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <Film className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="mt-4 text-3xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <div className="bg-card/80 backdrop-blur-sm shadow-xl rounded-xl p-8 border border-border/50">
          <LoginForm />
        </div>

        <p className="text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

