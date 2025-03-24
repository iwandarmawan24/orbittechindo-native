"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMovieStore } from "@/store/movie-store"
import { motion } from "framer-motion"
import { Filter } from "lucide-react"

export default function FilterSection() {
  const { type, yearRange, setType, setYearRange, searchTerm, searchMovies } = useMovieStore()
  const [startYear, setStartYear] = useState<string>("")
  const [endYear, setEndYear] = useState<string>("")
  const currentYear = new Date().getFullYear()

  // Generate years for select options (from 1900 to current year)
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => (currentYear - i).toString())

  useEffect(() => {
    if (yearRange && yearRange.length === 2) {
      setStartYear(yearRange[0].toString())
      setEndYear(yearRange[1].toString())
    }
  }, [yearRange])

  const handleStartYearChange = (value: string) => {
    setStartYear(value)
    updateYearRange(value, endYear)
  }

  const handleEndYearChange = (value: string) => {
    setEndYear(value)
    updateYearRange(startYear, value)
  }

  const updateYearRange = (start: string, end: string) => {
    // Only update if both values are selected
    if (start && end) {
      const startNum = Number.parseInt(start)
      const endNum = Number.parseInt(end)

      // Ensure start year is not greater than end year
      if (startNum <= endNum) {
        setYearRange([startNum, endNum])

        // Trigger search if there's already a search term
        if (searchTerm) {
          searchMovies(searchTerm, type, [startNum, endNum])
        }
      }
    } else if (!start && !end) {
      // If both are empty, reset the year range
      setYearRange([])

      // Trigger search if there's already a search term
      if (searchTerm) {
        searchMovies(searchTerm, type, [])
      }
    }
  }

  const handleTypeChange = (value: string) => {
    setType(value)
    // Trigger search if there's already a search term
    if (searchTerm) {
      const yearRangeToUse = startYear && endYear ? [Number.parseInt(startYear), Number.parseInt(endYear)] : []
      searchMovies(searchTerm, value, yearRangeToUse)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-primary/10 rounded-xl blur-md"></div>
      <div className="relative bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-border/50">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-lg font-semibold">Refine Your Search</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <label className="block text-sm font-medium">Content Type</label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger className="bg-background/80 border-border/50">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="movie">Movie</SelectItem>
                <SelectItem value="series">Series</SelectItem>
                <SelectItem value="episode">Episode</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">Start Year</label>
            <Select value={startYear} onValueChange={handleStartYearChange}>
              <SelectTrigger className="bg-background/80 border-border/50">
                <SelectValue placeholder="From year" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                <SelectItem value="any">Any</SelectItem>
                {years.map((year) => (
                  <SelectItem key={`start-${year}`} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">End Year</label>
            <Select value={endYear} onValueChange={handleEndYearChange}>
              <SelectTrigger className="bg-background/80 border-border/50">
                <SelectValue placeholder="To year" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                <SelectItem value="any">Any</SelectItem>
                {years.map((year) => (
                  <SelectItem key={`end-${year}`} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

