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

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Register">

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>()
  const theme = useTheme()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await register(data.email, data.name, data.password)

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
          <Text style={[styles.title, { color: theme.colors.primary }]}>Create an Account</Text>
          <Text style={styles.subtitle}>Join our community of movie enthusiasts</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.formContainer}>
          {error && <ErrorMessage message={error} />}

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Full Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                left={<TextInput.Icon icon="account" />}
                style={styles.input}
                error={!!errors.name}
              />
            )}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Confirm Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!showConfirmPassword}
                left={<TextInput.Icon icon="lock-check" />}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? "eye-off" : "eye"}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                style={styles.input}
                error={!!errors.confirmPassword}
              />
            )}
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Phone Number"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
                left={<TextInput.Icon icon="phone" />}
                style={styles.input}
                error={!!errors.phone}
              />
            )}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            Create Account
          </Button>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text style={[styles.link, { color: theme.colors.primary }]} onPress={() => navigation.navigate("Login")}>
              Sign in
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
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 16,
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
  footer: {
    alignItems: "center",
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
  },
  link: {
    fontWeight: "bold",
  },
})

