"use client"
import { View, StyleSheet } from "react-native"
import { Text, useTheme } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

interface ErrorMessageProps {
  message: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  const theme = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.errorContainer }]}>
      <Icon name="alert-circle" size={20} color={theme.colors.error} />
      <Text style={[styles.message, { color: theme.colors.error }]}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  message: {
    marginLeft: 8,
    flex: 1,
  },
})

