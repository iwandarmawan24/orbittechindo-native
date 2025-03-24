"use client"

import { useState } from "react"
import { StyleSheet, View, Image, Dimensions } from "react-native"
import { Text, Card, IconButton, useTheme } from "react-native-paper"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Movie } from "../types/movie"

interface MovieCardProps {
  movie: Movie
  onPress: () => void
  isFavorite?: boolean
}

export default function MovieCard({ movie, onPress, isFavorite = false }: MovieCardProps) {
  const theme = useTheme()
  const [favorite, setFavorite] = useState(isFavorite)

  const posterUrl =
    movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster"

  const toggleFavorite = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem("favorites")
      let favorites: Movie[] = favoritesData ? JSON.parse(favoritesData) : []

      if (favorite) {
        // Remove from favorites
        favorites = favorites.filter((item) => item.imdbID !== movie.imdbID)
      } else {
        // Add to favorites
        if (!favorites.some((item) => item.imdbID === movie.imdbID)) {
          favorites.push(movie)
        }
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(favorites))
      setFavorite(!favorite)
    } catch (error) {
      console.error("Error updating favorites:", error)
    }
  }

  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: posterUrl }} style={styles.image} />
        <IconButton
          icon={favorite ? "heart" : "heart-outline"}
          iconColor={favorite ? theme.colors.error : theme.colors.onSurface}
          style={styles.favoriteButton}
          size={20}
          onPress={toggleFavorite}
        />
      </View>
      <Card.Content style={styles.content}>
        <Text numberOfLines={1} style={styles.title}>
          {movie.Title}
        </Text>
        <View style={styles.metaContainer}>
          <Text style={styles.year}>{movie.Year}</Text>
          <Text style={styles.type}>{movie.Type}</Text>
        </View>
      </Card.Content>
    </Card>
  )
}

const { width } = Dimensions.get("window")
const cardWidth = (width - 48) / 2 // 2 columns with padding

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    marginBottom: 16,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: cardWidth * 1.5, // 3:2 aspect ratio
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: 4,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  content: {
    padding: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  year: {
    fontSize: 12,
    opacity: 0.7,
  },
  type: {
    fontSize: 12,
    textTransform: "capitalize",
    opacity: 0.7,
  },
})

