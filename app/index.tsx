import { useAuth } from "@/lib/autht-context";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function Index() {
  const { signOut } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <View style={{ flex: 1 }}>
      {/* Main content */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-pink-600">Hello NativeWind</Text>

        <Link href="/auth">
          <Text className="text-blue-600 underline mt-4">Go to LogIn</Text>
        </Link>

        <Button
          onPress={signOut}
          mode="text"
          icon={"logout"}
          style={{ marginTop: 16 }}
        >
          Sign Out
        </Button>
      </View>
    </View>
  );
}
