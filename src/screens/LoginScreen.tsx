"use client"

import { useState } from "react"
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Text, TextInput, Button, useTheme } from "react-native-paper"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Animated, { FadeInDown } from "react-native-reanimated"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import type { RootStackParamList } from "../types/navigation"
import { useAuth } from "../contexts/AuthContext"
import ErrorMessage from "../components/ErrorMessage"

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>()
  const theme = useTheme()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await login(data.email, data.password)

      if (!result.success) {
        setError(result.message)
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.logoContainer}>
          <Icon name="movie-outline" size={60} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.primary }]}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account to continue</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.formContainer}>
          {error && <ErrorMessage message={error} />}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email" />}
                style={styles.input}
                error={!!errors.email}
              />
            )}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!showPassword}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
                error={!!errors.password}
              />
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            Sign In
          </Button>

          <Text style={styles.demoText}>
            Demo credentials: user@example.com / password123{"\n"}
            Or use any email with password "password"
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text
              style={[styles.link, { color: theme.colors.primary }]}
              onPress={() => navigation.navigate("Register")}
            >
              Create an account
            </Text>
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 16,
    marginLeft: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  demoText: {
    marginTop: 16,
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
  },
  link: {
    fontWeight: "bold",
  },
})

