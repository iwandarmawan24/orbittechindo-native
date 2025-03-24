"use client"
import { View, StyleSheet } from "react-native"
import { Text, useTheme } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Animated, { FadeIn } from "react-native-reanimated"

interface EmptyStateProps {
  icon: string
  title: string
  message: string
}

export default function EmptyState({ icon, title, message }: EmptyStateProps) {
  const theme = useTheme()

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Icon name={icon} size={40} color={theme.colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    minHeight: 300,
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
    maxWidth: 300,
  },
})

