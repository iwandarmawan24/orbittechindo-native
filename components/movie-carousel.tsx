"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { searchMovies } from "@/lib/api"
import type { Movie } from "@/types/movie"
import { motion, AnimatePresence } from "framer-motion"

export default function MovieCarousel() {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        // Fetch some popular movies for the carousel
        const featuredTitles = ["Avengers", "Star Wars", "Jurassic Park", "Harry Potter", "Lord of the Rings"]
        const results = await Promise.all(featuredTitles.map((title) => searchMovies(title, "movie", "")))

        const movies = results
          .flatMap((result) => result.Search || [])
          .filter((movie) => movie.Poster && movie.Poster !== "N/A")
          .slice(0, 5)

        setFeaturedMovies(movies)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching featured movies:", error)
        setLoading(false)
      }
    }

    fetchFeaturedMovies()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? featuredMovies.length - 1 : prevIndex - 1))
  }

  useEffect(() => {
    // Auto-advance carousel every 6 seconds
    const interval = setInterval(() => {
      nextSlide()
    }, 6000)

    return () => clearInterval(interval)
  }, [currentIndex, featuredMovies.length])

  if (loading || featuredMovies.length === 0) {
    return (
      <div className="h-[500px] w-full bg-muted/30 rounded-xl flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-48 bg-muted mb-4 rounded"></div>
          <div className="h-4 w-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  const currentMovie = featuredMovies[currentIndex]

  return (
    <div className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      <div
        className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: `url(${currentMovie.Poster})`,
          filter: "blur(10px)",
          transform: "scale(1.1)",
        }}
      ></div>

      <div className="relative z-20 h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.imdbID}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl"
          >
            <Card className="bg-black/40 backdrop-blur-md border-0 shadow-xl overflow-hidden">
              <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="relative h-[350px] w-[230px] flex-shrink-0 rounded-lg overflow-hidden shadow-2xl transform transition-transform hover:scale-105">
                  <Image
                    src={currentMovie.Poster || "/placeholder.svg"}
                    alt={currentMovie.Title}
                    fill
                    className="object-cover"
                    sizes="230px"
                    priority
                  />
                </div>
                <div className="text-white">
                  <Badge variant="outline" className="mb-3 text-xs font-normal border-white/20 text-white/80">
                    Featured
                  </Badge>
                  <h2 className="text-4xl font-bold mb-3 text-white">{currentMovie.Title}</h2>
                  <div className="flex items-center mb-4">
                    <Badge className="mr-2 bg-primary/80">{currentMovie.Year}</Badge>
                    <Badge variant="secondary" className="mr-2">
                      {currentMovie.Type}
                    </Badge>
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-4 w-4 fill-yellow-400 mr-1" />
                      <span className="text-sm">8.5</span>
                    </div>
                  </div>
                  <p className="text-white/80 mb-6 max-w-xl">
                    Discover more about this acclaimed title, including cast, ratings, and plot details.
                  </p>
                  <Link href={`/movies/${currentMovie.imdbID}`}>
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 text-white hover:bg-black/30 h-12 w-12 rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8" />
        <span className="sr-only">Previous</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-white hover:bg-black/30 h-12 w-12 rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8" />
        <span className="sr-only">Next</span>
      </Button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-primary w-8" : "bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

