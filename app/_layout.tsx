import { AuthProvider, useAuth } from "@/lib/autht-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./globals.css";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isloadingUser } = useAuth();
  const router = useRouter();
  const segment = useSegments();
  const [mounted, setMounted] = useState(false);

  // Set mounted after first render
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const storedUserId = await AsyncStorage.getItem("QurioUser");
      const storedUserEmail = await AsyncStorage.getItem("QurioUserEmail");
      const storedUserName = await AsyncStorage.getItem("QurioUserName");

      if (storedUserId && storedUserEmail && storedUserName) {
        console.log("Stored User Name:", storedUserName);
      } else {
        console.log("No user data found in AsyncStorage.");
      }
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Only run navigation logic after mounted and user is loaded
  useEffect(() => {
    if (!mounted || isloadingUser) {
      console.log("Waiting for mount or user loading...");
      return;
    }

    const inAuthGroup = segment[0] === "auth";

    if (!user && !inAuthGroup) {
      console.log("Redirecting to / because no user");
      router.replace("/");
    } else if (user && inAuthGroup) {
      console.log("Redirecting to /home because user is signed in");
      router.replace("/home");
    } else {
      console.log("No navigation triggered");
    }
  }, [mounted, segment, user, isloadingUser, router]);

  if (!mounted) return null;

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <SafeAreaProvider>
          <RouteGuard>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
          </RouteGuard>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
