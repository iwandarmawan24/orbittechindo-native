import { MD3LightTheme, MD3DarkTheme } from "react-native-paper"
import { DefaultTheme as NavigationLightTheme, DarkTheme as NavigationDarkTheme } from "@react-navigation/native"

// Define custom colors
const customColors = {
  light: {
    primary: "#000000",
    primaryContainer: "#E6E6E6",
    secondary: "#424242",
    secondaryContainer: "#F5F5F5",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    error: "#B00020",
    errorContainer: "#FFEBEE",
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",
    onBackground: "#000000",
    onSurface: "#000000",
    onError: "#FFFFFF",
  },
  dark: {
    primary: "#FFFFFF",
    primaryContainer: "#333333",
    secondary: "#BBBBBB",
    secondaryContainer: "#333333",
    background: "#121212",
    surface: "#1E1E1E",
    error: "#CF6679",
    errorContainer: "#541313",
    onPrimary: "#000000",
    onSecondary: "#000000",
    onBackground: "#FFFFFF",
    onSurface: "#FFFFFF",
    onError: "#000000",
  },
}

// Create custom light theme
export const lightTheme = {
  ...MD3LightTheme,
  ...NavigationLightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...NavigationLightTheme.colors,
    ...customColors.light,
  },
}

// Create custom dark theme
export const darkTheme = {
  ...MD3DarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...NavigationDarkTheme.colors,
    ...customColors.dark,
  },
}

// Export default theme (light theme)
export const theme = lightTheme

