import type { MovieDetail, SearchResult } from "@/types/movie"

// Use the provided API key
const API_KEY = "2eb22337"
const BASE_URL = "https://www.omdbapi.com/"
const POSTER_URL = "https://img.omdbapi.com/"

// Helper function to add retry logic
async function fetchWithRetry(url: string, retries = 3, delay = 1000): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        cache: "no-store", // Disable caching to avoid stale responses
        next: { revalidate: 0 }, // For Next.js, ensure fresh data
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      return response
    } catch (error) {
      console.error(`Fetch attempt ${attempt + 1} failed:`, error)
      lastError = error instanceof Error ? error : new Error(String(error))

      // Wait before retrying
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error("Failed to fetch after multiple attempts")
}

export async function searchMovies(searchTerm: string, type = "", year = ""): Promise<SearchResult> {
  try {
    console.log("Searching movies with:", { searchTerm, type, year })

    const params = new URLSearchParams({
      apikey: API_KEY,
      s: searchTerm,
    })

    if (type && type !== "any") {
      params.append("type", type)
    }

    // Only add year parameter if it's provided
    if (year) {
      params.append("y", year)
    }

    const url = `${BASE_URL}?${params.toString()}`
    console.log("API Request URL:", url)

    const response = await fetchWithRetry(url)
    const data = await response.json()

    console.log("API Response:", data)

    if (data.Response === "False") {
      return {
        Search: [],
        totalResults: "0",
        Response: "False",
        Error: data.Error || "No results found",
      }
    }

    return data
  } catch (error) {
    console.error("Error searching movies:", error)
    return {
      Search: [],
      totalResults: "0",
      Response: "False",
      Error: "Failed to fetch movies. Please try again.",
    }
  }
}

export async function getMovieById(id: string): Promise<MovieDetail> {
  try {
    console.log("Fetching movie details for ID:", id)

    if (!id) {
      throw new Error("Movie ID is required")
    }

    const params = new URLSearchParams({
      apikey: API_KEY,
      i: id,
      plot: "full",
    })

    const url = `${BASE_URL}?${params.toString()}`
    console.log("API Request URL:", url)

    const response = await fetchWithRetry(url)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log("API Response:", data)

    if (data.Response === "False") {
      throw new Error(data.Error || "Movie not found")
    }

    return data
  } catch (error) {
    console.error("Error fetching movie details:", error)
    // Re-throw the error to be handled by the calling component
    throw new Error("Failed to fetch movie details. Please try again later.")
  }
}

// Fallback function to use mock data if the API fails
export async function getMovieByIdWithFallback(id: string): Promise<MovieDetail> {
  try {
    return await getMovieById(id)
  } catch (error) {
    console.error("Using fallback data due to API error:", error)

    // Return mock data as fallback
    return {
      Title: "Sample Movie",
      Year: "2023",
      Rated: "PG-13",
      Released: "01 Jan 2023",
      Runtime: "120 min",
      Genre: "Action, Drama",
      Director: "Sample Director",
      Writer: "Sample Writer",
      Actors: "Actor 1, Actor 2, Actor 3",
      Plot: "This is a fallback movie description used when the API is unavailable.",
      Language: "English",
      Country: "USA",
      Awards: "N/A",
      Poster: "/placeholder.svg?height=600&width=400",
      Ratings: [
        {
          Source: "Internet Movie Database",
          Value: "7.5/10",
        },
        {
          Source: "Rotten Tomatoes",
          Value: "85%",
        },
      ],
      Metascore: "75",
      imdbRating: "7.5",
      imdbVotes: "10,000",
      imdbID: id || "tt0000000",
      Type: "movie",
      DVD: "N/A",
      BoxOffice: "N/A",
      Production: "N/A",
      Website: "N/A",
      Response: "True",
    }
  }
}

