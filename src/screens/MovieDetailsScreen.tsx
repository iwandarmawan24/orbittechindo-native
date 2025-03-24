"use client"

import { useEffect, useState } from "react"
import { View, ScrollView, StyleSheet, Image, Dimensions } from "react-native"
import { useRoute, type RouteProp, useNavigation } from "@react-navigation/native"
import { Text, Chip, Divider, useTheme, IconButton } from "react-native-paper"
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { SafeAreaView } from "react-native-safe-area-context"

import type { RootStackParamList } from "../types/navigation"
import { getMovieById } from "../services/api"
import type { MovieDetail } from "../types/movie"
import LoadingIndicator from "../components/LoadingIndicator"
import ErrorState from "../components/ErrorState"

type MovieDetailsRouteProp = RouteProp<RootStackParamList, "MovieDetails">

export default function MovieDetailsScreen() {
  const route = useRoute<MovieDetailsRouteProp>()
  const navigation = useNavigation()
  const theme = useTheme()
  const { id } = route.params
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true)
        const data = await getMovieById(id)
        setMovie(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching movie details:", err)
        setError("Failed to load movie details")
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id])

  if (loading) {
    return <LoadingIndicator />
  }

  if (error || !movie) {
    return <ErrorState message={error || "Movie not found"} onRetry={() => navigation.goBack()} />
  }

  const posterUrl =
    movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster"

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.posterContainer}>
          <Image source={{ uri: posterUrl }} style={styles.posterImage} />
          <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.gradient} />
          <SafeAreaView edges={["top"]} style={styles.headerContainer}>
            <IconButton
              icon="arrow-left"
              iconColor="white"
              size={24}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
          </SafeAreaView>
        </View>

        <View style={styles.contentContainer}>
          <Animated.View entering={FadeIn.delay(200).duration(500)}>
            <Text style={styles.title}>{movie.Title}</Text>

            <View style={styles.metaContainer}>
              {movie.Year && movie.Year !== "N/A" && (
                <Chip icon="calendar" style={styles.chip}>
                  {movie.Year}
                </Chip>
              )}
              {movie.Runtime && movie.Runtime !== "N/A" && (
                <Chip icon="clock-outline" style={styles.chip}>
                  {movie.Runtime}
                </Chip>
              )}
              {movie.Rated && movie.Rated !== "N/A" && <Chip style={styles.chip}>{movie.Rated}</Chip>}
              {movie.imdbRating && movie.imdbRating !== "N/A" && (
                <Chip icon="star" style={[styles.chip, { backgroundColor: theme.colors.primaryContainer }]}>
                  {movie.imdbRating}/10
                </Chip>
              )}
            </View>
          </Animated.View>

          {movie.Genre && movie.Genre !== "N/A" && (
            <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.genreContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {movie.Genre.split(", ").map((genre) => (
                  <Chip key={genre} style={[styles.genreChip, { backgroundColor: theme.colors.secondaryContainer }]}>
                    {genre}
                  </Chip>
                ))}
              </ScrollView>
            </Animated.View>
          )}

          {movie.Plot && movie.Plot !== "N/A" && (
            <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.section}>
              <Text style={styles.sectionTitle}>Plot</Text>
              <Text style={styles.plotText}>{movie.Plot}</Text>
            </Animated.View>
          )}

          <Divider style={styles.divider} />

          <Animated.View entering={FadeInDown.delay(500).duration(500)}>
            <View style={styles.infoGrid}>
              {movie.Director && movie.Director !== "N/A" && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Director</Text>
                  <Text style={styles.infoValue}>{movie.Director}</Text>
                </View>
              )}

              {movie.Writer && movie.Writer !== "N/A" && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Writer</Text>
                  <Text style={styles.infoValue}>{movie.Writer}</Text>
                </View>
              )}

              {movie.Actors && movie.Actors !== "N/A" && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Actors</Text>
                  <Text style={styles.infoValue}>{movie.Actors}</Text>
                </View>
              )}

              {movie.Language && movie.Language !== "N/A" && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Language</Text>
                  <Text style={styles.infoValue}>{movie.Language}</Text>
                </View>
              )}
            </View>
          </Animated.View>

          {movie.Ratings && movie.Ratings.length > 0 && (
            <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.section}>
              <Text style={styles.sectionTitle}>Ratings</Text>
              <View style={styles.ratingsContainer}>
                {movie.Ratings.map((rating, index) => (
                  <View key={index} style={styles.ratingItem}>
                    <Text style={styles.ratingSource}>{rating.Source}</Text>
                    <Text style={styles.ratingValue}>{rating.Value}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const { width } = Dimensions.get("window")
const posterHeight = width * 1.2

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  posterContainer: {
    height: posterHeight,
    width: "100%",
    position: "relative",
  },
  posterImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    margin: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  contentContainer: {
    padding: 16,
    marginTop: -40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  genreContainer: {
    marginBottom: 16,
  },
  genreChip: {
    marginRight: 8,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  plotText: {
    lineHeight: 22,
    opacity: 0.8,
  },
  divider: {
    marginVertical: 16,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoItem: {
    width: "50%",
    paddingRight: 16,
    marginBottom: 16,
  },
  infoLabel: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  infoValue: {
    opacity: 0.8,
  },
  ratingsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  ratingItem: {
    width: "33.33%",
    padding: 8,
    marginBottom: 8,
  },
  ratingSource: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
})

