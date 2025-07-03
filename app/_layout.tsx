import { AuthProvider, useAuth } from "@/lib/autht-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./globals.css";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isloadingUser } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const segment = useSegments();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const inAuthGroup = segment[0] === "auth";
    if (mounted && !user && !inAuthGroup && !isloadingUser) {
      router.replace("/auth");
    } else if (mounted && user && inAuthGroup && !isloadingUser) {
      router.replace("/");
    }
  }, [mounted, segment, user]);

  if (!mounted) return null; // Prevent render until mounted

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
              {/* Root landing page */}
              <Stack.Screen name="index" options={{ headerShown: false }} />
              {/* Tabs group */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </RouteGuard>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
