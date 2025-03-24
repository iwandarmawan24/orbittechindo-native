import { StatusBar } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { PaperProvider } from "react-native-paper"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import AppNavigator from "./src/navigation/AppNavigator"
import { AuthProvider } from "./src/contexts/AuthContext"
import { theme } from "./src/theme"

// Create a client for React Query
const queryClient = new QueryClient()

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SafeAreaProvider>
            <PaperProvider theme={theme}>
              <NavigationContainer>
                <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
                <AppNavigator />
              </NavigationContainer>
            </PaperProvider>
          </SafeAreaProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}

