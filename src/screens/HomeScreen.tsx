"use client"

import { useState } from "react"
import { View, StyleSheet, ScrollView, FlatList } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Searchbar, Text, useTheme } from "react-native-paper"
import Animated, { FadeInDown } from "react-native-reanimated"

import type { RootStackParamList } from "../types/navigation"
import { searchMovies } from "../services/api"
import type { Movie } from "../types/movie"
import MovieCard from "../components/MovieCard"
import MovieCarousel from "../components/MovieCarousel"
import FilterSection from "../components/FilterSection"
import LoadingIndicator from "../components/LoadingIndicator"
import EmptyState from "../components/EmptyState"

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Main">

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>()
  const theme = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [type, setType] = useState("any")
  const [yearRange, setYearRange] = useState<number[]>([])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)

    try {
      const yearParam = yearRange.length === 2 ? `${yearRange[0]}` : ""
      const apiType = type === "any" ? "" : type

      const result = await searchMovies(searchQuery, apiType, yearParam)

      if (result.Response === "True" && result.Search) {
        let filteredMovies = result.Search

        if (yearRange.length === 2) {
          filteredMovies = filteredMovies.filter((movie) => {
            const movieYear = Number.parseInt(movie.Year)
            return !isNaN(movieYear) && movieYear >= yearRange[0] && movieYear <= yearRange[1]
          })
        }

        setMovies(filteredMovies)
      } else {
        setMovies([])
        setError(result.Error || "No movies found")
      }
    } catch (error) {
      console.error("Error searching movies:", error)
      setError("Failed to fetch movies")
      setMovies([])
    } finally {
      setLoading(false)
      setHasSearched(true)
    }
  }

  const handleFilterChange = (newType: string, newYearRange: number[]) => {
    setType(newType)
    setYearRange(newYearRange)

    if (searchQuery.trim()) {
      handleSearch()
    }
  }

  const renderMovieItem = ({ item, index }: { item: Movie; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()} style={styles.movieCardContainer}>
      <MovieCard movie={item} onPress={() => navigation.navigate("MovieDetails", { id: item.imdbID })} />
    </Animated.View>
  )

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>Movie Explorer</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.carouselContainer}>
          <MovieCarousel onMoviePress={(id) => navigation.navigate("MovieDetails", { id })} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.searchContainer}>
          <Searchbar
            placeholder="Search for movies, series..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            onSubmitEditing={handleSearch}
            style={styles.searchBar}
            iconColor={theme.colors.primary}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.filterContainer}>
          <FilterSection onFilterChange={handleFilterChange} />
        </Animated.View>

        {loading ? (
          <LoadingIndicator />
        ) : error ? (
          <EmptyState icon="alert-circle-outline" title="Search Error" message={error} />
        ) : hasSearched && movies.length === 0 ? (
          <EmptyState
            icon="movie-outline"
            title="No Results Found"
            message={`We couldn't find any matches for "${searchQuery}". Try adjusting your search or filters.`}
          />
        ) : !hasSearched ? (
          <EmptyState
            icon="magnify"
            title="Discover Your Next Favorite"
            message="Use the search bar above to explore thousands of movies, TV shows, and more"
          />
        ) : (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Search Results</Text>
            <FlatList
              data={movies}
              renderItem={renderMovieItem}
              keyExtractor={(item) => item.imdbID}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.movieGrid}
            />
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  carouselContainer: {
    marginBottom: 24,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    elevation: 4,
    borderRadius: 8,
  },
  filterContainer: {
    marginBottom: 24,
  },
  resultsContainer: {
    marginTop: 8,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  movieGrid: {
    paddingBottom: 16,
  },
  movieCardContainer: {
    flex: 1,
    padding: 8,
    maxWidth: "50%",
  },
})

