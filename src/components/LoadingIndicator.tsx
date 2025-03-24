"use client"
import { View, StyleSheet } from "react-native"
import { ActivityIndicator, Text, useTheme } from "react-native-paper"

interface LoadingIndicatorProps {
  message?: string
}

export default function LoadingIndicator({ message = "Loading..." }: LoadingIndicatorProps) {
  const theme = useTheme()

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
})

