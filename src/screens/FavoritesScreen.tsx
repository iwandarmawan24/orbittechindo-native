"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, FlatList } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Text, useTheme } from "react-native-paper"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Animated, { FadeInDown } from "react-native-reanimated"

import type { RootStackParamList } from "../types/navigation"
import type { Movie } from "../types/movie"
import MovieCard from "../components/MovieCard"
import EmptyState from "../components/EmptyState"
import LoadingIndicator from "../components/LoadingIndicator"

type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Main">

export default function FavoritesScreen() {
  const navigation = useNavigation<FavoritesScreenNavigationProp>()
  const theme = useTheme()
  const [favorites, setFavorites] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoritesData = await AsyncStorage.getItem("favorites")
        if (favoritesData) {
          setFavorites(JSON.parse(favoritesData))
        }
      } catch (error) {
        console.error("Error loading favorites:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()

    // Refresh favorites when the screen is focused
    const unsubscribe = navigation.addListener("focus", loadFavorites)
    return unsubscribe
  }, [navigation])

  const renderMovieItem = ({ item, index }: { item: Movie; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()} style={styles.movieCardContainer}>
      <MovieCard
        movie={item}
        onPress={() => navigation.navigate("MovieDetails", { id: item.imdbID })}
        isFavorite={true}
      />
    </Animated.View>
  )

  if (loading) {
    return <LoadingIndicator />
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Favorites</Text>
      </View>

      {favorites.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="No Favorites Yet"
          message="Movies you add to favorites will appear here"
        />
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.imdbID}
          numColumns={2}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 16,
  },
  movieCardContainer: {
    flex: 1,
    padding: 8,
    maxWidth: "50%",
  },
})

