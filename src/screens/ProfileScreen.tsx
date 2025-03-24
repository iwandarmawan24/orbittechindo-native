"use client"
import { StyleSheet, ScrollView, Alert } from "react-native"
import { Text, Avatar, Button, List, Divider, useTheme } from "react-native-paper"
import Animated, { FadeInDown } from "react-native-reanimated"

import { useAuth } from "../contexts/AuthContext"

export default function ProfileScreen() {
  const { user, logout } = useAuth()
  const theme = useTheme()

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => logout(),
          style: "destructive",
        },
      ],
      { cancelable: true },
    )
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
        <Avatar.Text size={80} label={user?.name?.charAt(0) || "U"} backgroundColor={theme.colors.primary} />
        <Text style={styles.name}>{user?.name || "User"}</Text>
        <Text style={styles.email}>{user?.email || "user@example.com"}</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <List.Item
          title="Edit Profile"
          left={(props) => <List.Icon {...props} icon="account-edit" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
        <Divider />
        <List.Item
          title="Change Password"
          left={(props) => <List.Icon {...props} icon="lock-reset" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
        <Divider />
        <List.Item
          title="Notification Settings"
          left={(props) => <List.Icon {...props} icon="bell-outline" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <List.Item
          title="Theme"
          description="Light"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
        <Divider />
        <List.Item
          title="Language"
          description="English"
          left={(props) => <List.Icon {...props} icon="translate" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <List.Item
          title="App Version"
          description="1.0.0"
          left={(props) => <List.Icon {...props} icon="information-outline" />}
        />
        <Divider />
        <List.Item
          title="Terms of Service"
          left={(props) => <List.Icon {...props} icon="file-document-outline" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
        <Divider />
        <List.Item
          title="Privacy Policy"
          left={(props) => <List.Icon {...props} icon="shield-account" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.logoutContainer}>
        <Button
          mode="outlined"
          icon="logout"
          onPress={handleLogout}
          style={[styles.logoutButton, { borderColor: theme.colors.error }]}
          textColor={theme.colors.error}
        >
          Logout
        </Button>
      </Animated.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    padding: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  logoutContainer: {
    padding: 16,
    marginBottom: 32,
  },
  logoutButton: {
    borderWidth: 1,
  },
})

