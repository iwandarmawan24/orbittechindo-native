"use client"

import type React from "react"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMovieStore } from "@/store/movie-store"
import { motion } from "framer-motion"

export default function SearchBar() {
  const [inputValue, setInputValue] = useState("")
  const { setSearchTerm, searchMovies, type, yearRange } = useMovieStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setSearchTerm(inputValue)
      // Directly call searchMovies to ensure the search is triggered
      searchMovies(inputValue, type, yearRange)
    }
  }

  const clearSearch = () => {
    setInputValue("")
    setSearchTerm("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <form onSubmit={handleSearch} className="relative">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:bg-primary/30 transition-colors"></div>
          <div className="relative bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for movies, series, or episodes..."
                className="pl-12 pr-24 py-6 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              {inputValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-20 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={clearSearch}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
              <Button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-6 bg-primary hover:bg-primary/90"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  )
}

