import { Stack, Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

export default function Layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" headerShown={false} />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="profile" />
      </Stack>
    </AuthProvider>
  );
}
