"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Film, LogIn, LogOut, User, Search, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/store/auth-store"
import { motion } from "framer-motion"

export default function Header() {
  const router = useRouter()
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  // Only run on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check authentication status on component mount
  useEffect(() => {
    if (mounted && isAuthenticated) {
      const isValid = checkAuth()
      if (!isValid) {
        // Token is invalid or expired, logout
        logout()
      }
    }
  }, [mounted, isAuthenticated, checkAuth, logout])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Don't render user-specific content during SSR
  if (!mounted) {
    return (
      <header className="border-b backdrop-blur-md bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <Film className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">MovieExplorer</span>
            </Link>
            <div className="h-10 w-24 bg-muted/30 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b backdrop-blur-md bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div initial={{ rotate: 0 }} whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
              <Film className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="font-bold text-xl group-hover:text-primary transition-colors">MovieExplorer</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">
              Favorites
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/")}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {isAuthenticated && user ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => router.push("/favorites")}
                >
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Favorites</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{user.name || "User"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="cursor-pointer">
                        Favorites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => router.push("/auth/login")}>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

