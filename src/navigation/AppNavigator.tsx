"use client"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useTheme } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import { useAuth } from "../contexts/AuthContext"
import HomeScreen from "../screens/HomeScreen"
import MovieDetailsScreen from "../screens/MovieDetailsScreen"
import LoginScreen from "../screens/LoginScreen"
import RegisterScreen from "../screens/RegisterScreen"
import FavoritesScreen from "../screens/FavoritesScreen"
import ProfileScreen from "../screens/ProfileScreen"
import type { RootStackParamList, MainTabParamList } from "../types/navigation"

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<MainTabParamList>()

function MainTabs() {
  const theme = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.surfaceVariant,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="heart" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="account" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    // You could return a splash screen here
    return null
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="MovieDetails"
            component={MovieDetailsScreen}
            options={{
              headerShown: true,
              title: "",
              headerTransparent: true,
              headerBackTitle: "Back",
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}

