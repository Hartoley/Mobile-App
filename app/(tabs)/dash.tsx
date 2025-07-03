import { useAuth } from "@/lib/autht-context";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import YouTubeHeader from "../header"; // import the header component

export default function Index() {
  const { signOut } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <View style={{ flex: 1 }}>
      {/* YouTube-style header */}
      <YouTubeHeader
        showSearch={showSearch}
        searchValue={search}
        onSearchChange={setSearch}
        onSearchSubmit={() => {
          console.log("Search submitted:", search);
          setShowSearch(false); // close search on submit
        }}
        onMenuPress={() => console.log("Menu pressed")}
        onCastPress={() => console.log("Cast pressed")}
        onNotificationsPress={() => console.log("Notifications pressed")}
        onProfilePress={() => console.log("Profile pressed")}
      />

      {/* Main content */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-pink-600">THis is Dash not index</Text>

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
