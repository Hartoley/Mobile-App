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
    if (!mounted) return;

    const inAuthGroup = segment[0] === "auth";

    if (!user && !inAuthGroup && !isloadingUser) {
      router.replace("/");
    } else if (user && inAuthGroup && !isloadingUser) {
      router.replace("/home");
    }
  }, [mounted, segment, user, isloadingUser]);

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
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </RouteGuard>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
