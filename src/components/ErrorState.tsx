"use client"
import { View, StyleSheet } from "react-native"
import { Text, Button, useTheme } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Animated, { FadeIn } from "react-native-reanimated"

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  const theme = useTheme()

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.errorContainer }]}>
        <Icon name="alert-circle" size={40} color={theme.colors.error} />
      </View>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      <Button mode="contained" onPress={onRetry} style={styles.button} icon="refresh">
        Try Again
      </Button>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 24,
    maxWidth: 300,
  },
  button: {
    paddingHorizontal: 16,
  },
})

