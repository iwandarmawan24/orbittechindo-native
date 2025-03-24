import { create } from "zustand"
import { searchMovies as apiSearchMovies } from "@/lib/api"
import type { Movie } from "@/types/movie"

interface MovieState {
  movies: Movie[]
  searchTerm: string
  type: string
  yearRange: number[]
  loading: boolean
  error: string | null
  setSearchTerm: (term: string) => void
  setType: (type: string) => void
  setYearRange: (range: number[]) => void
  searchMovies: (term: string, type: string, yearRange: number[]) => Promise<void>
}

export const useMovieStore = create<MovieState>((set, get) => ({
  movies: [],
  searchTerm: "",
  type: "any", // Default to "any" instead of empty string
  yearRange: [],
  loading: false,
  error: null,
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setType: (type: string) => set({ type }),
  setYearRange: (range: number[]) => set({ yearRange: range }),
  searchMovies: async (term: string, type: string, yearRange: number[]) => {
    if (!term) {
      set({ movies: [], loading: false, error: null })
      return
    }

    set({ loading: true, error: null })

    try {
      console.log("Searching with params:", { term, type, yearRange })

      // Only use year parameter if yearRange has values
      const yearParam = yearRange && yearRange.length === 2 ? `${yearRange[0]}` : ""

      // Convert type "any" to empty string for the API
      const apiType = type === "any" ? "" : type

      const result = await apiSearchMovies(term, apiType, yearParam)

      if (result.Response === "True" && result.Search) {
        // If we're using a year range, filter the results client-side
        let filteredMovies = result.Search

        if (yearRange && yearRange.length === 2) {
          filteredMovies = filteredMovies.filter((movie) => {
            const movieYear = Number.parseInt(movie.Year)
            return !isNaN(movieYear) && movieYear >= yearRange[0] && movieYear <= yearRange[1]
          })
        }

        set({ movies: filteredMovies, loading: false })
      } else {
        set({
          movies: [],
          loading: false,
          error: result.Error || "No movies found",
        })
      }
    } catch (error) {
      console.error("Error in searchMovies:", error)
      set({
        movies: [],
        loading: false,
        error: "Failed to fetch movies",
      })
    }
  },
}))

