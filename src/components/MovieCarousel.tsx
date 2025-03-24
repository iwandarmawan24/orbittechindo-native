"use client"

import { useState, useEffect, useRef } from "react"
import { View, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity } from "react-native"
import { Text, Button, useTheme } from "react-native-paper"
import Animated, { FadeIn } from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"

import { searchMovies } from "../services/api"
import type { Movie } from "../types/movie"
import LoadingIndicator from "./LoadingIndicator"

interface MovieCarouselProps {
  onMoviePress: (id: string) => void
}

export default function MovieCarousel({ onMoviePress }: MovieCarouselProps) {
  const theme = useTheme()
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  const { width } = Dimensions.get("window")

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
      } catch (error) {
        console.error("Error fetching featured movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedMovies()
  }, [])

  useEffect(() => {
    // Auto-advance carousel every 6 seconds
    const interval = setInterval(() => {
      if (featuredMovies.length > 0) {
        const nextIndex = (currentIndex + 1) % featuredMovies.length
        setCurrentIndex(nextIndex)
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        })
      }
    }, 6000)

    return () => clearInterval(interval)
  }, [currentIndex, featuredMovies.length])

  const handleDotPress = (index: number) => {
    setCurrentIndex(index)
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    })
  }

  const renderItem = ({ item }: { item: Movie }) => {
    const posterUrl =
      item.Poster && item.Poster !== "N/A" ? item.Poster : "https://via.placeholder.com/300x450?text=No+Poster"

    return (
      <View style={[styles.slide, { width }]}>
        <Image source={{ uri: posterUrl }} style={styles.image} />
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.gradient} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.Title}</Text>
          <Text style={styles.year}>{item.Year}</Text>
          <Button mode="contained" onPress={() => onMoviePress(item.imdbID)} style={styles.button}>
            View Details
          </Button>
        </View>
      </View>
    )
  }

  if (loading || featuredMovies.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingIndicator />
      </View>
    )
  }

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={featuredMovies}
        renderItem={renderItem}
        keyExtractor={(item) => item.imdbID}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width)
          setCurrentIndex(newIndex)
        }}
        initialScrollIndex={0}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <View style={styles.pagination}>
        {featuredMovies.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              { backgroundColor: index === currentIndex ? theme.colors.primary : "rgba(255, 255, 255, 0.5)" },
              index === currentIndex && styles.activeDot,
            ]}
            onPress={() => handleDotPress(index)}
          />
        ))}
      </View>
    </Animated.View>
  )
}

const { width } = Dimensions.get("window")
const height = width * 0.7

const styles = StyleSheet.create({
  container: {
    height,
    borderRadius: 12,
    overflow: "hidden",
  },
  loadingContainer: {
    height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
  },
  slide: {
    height,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
  },
  contentContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  year: {
    color: "white",
    fontSize: 16,
    marginBottom: 16,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    alignSelf: "flex-start",
  },
  pagination: {
    position: "absolute",
    bottom: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
  },
})

