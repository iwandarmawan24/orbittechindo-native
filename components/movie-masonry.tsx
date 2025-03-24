"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Film, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMovieStore } from "@/store/movie-store"
import type { Movie } from "@/types/movie"
import { motion } from "framer-motion"

export default function MovieMasonry() {
  const { movies, searchTerm, type, yearRange, searchMovies, loading, error } = useMovieStore()
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    // Only trigger search when searchTerm changes and is not empty
    if (searchTerm) {
      searchMovies(searchTerm, type, yearRange)
      setHasSearched(true)
    }
  }, [searchTerm, type, yearRange, searchMovies])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-[350px] bg-muted/50 rounded-xl animate-pulse"></div>
          ))}
      </div>
    )
  }

  if (!hasSearched) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <Search className="h-10 w-10 text-primary/70" />
        </div>
        <h2 className="text-2xl font-semibold mb-4">Discover Your Next Favorite</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Use the search bar above to explore thousands of movies, TV shows, and more
        </p>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6">
          <Film className="h-10 w-10 text-destructive/70" />
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-destructive">Search Error</h2>
        <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
      </motion.div>
    )
  }

  if (movies.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
          <Film className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-4">No Results Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't find any matches for "{searchTerm}". Try adjusting your search or filters.
        </p>
      </motion.div>
    )
  }

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
      >
        Search Results
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie: Movie, index) => (
          <motion.div
            key={movie.imdbID}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Link href={`/movies/${movie.imdbID}`}>
              <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="relative aspect-[2/3] w-full overflow-hidden">
                  {movie.Poster && movie.Poster !== "N/A" ? (
                    <Image
                      src={movie.Poster || "/placeholder.svg"}
                      alt={movie.Title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                      <Film className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-4 relative">
                  <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {movie.Title}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="outline" className="bg-background/80">
                      {movie.Year}
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      {movie.Type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

