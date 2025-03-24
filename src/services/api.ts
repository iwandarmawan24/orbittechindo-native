import type { MovieDetail, SearchResult } from "../types/movie"

// Use the provided API key
const API_KEY = "2eb22337"
const BASE_URL = "https://www.omdbapi.com/"

// Helper function to add retry logic
async function fetchWithRetry(url: string, retries = 3, delay = 1000): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url)

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

