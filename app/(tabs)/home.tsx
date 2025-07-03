import { useAuth } from "@/lib/autht-context";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import YouTubeHeader from "../header"; // import the header component

export default function Index() {
  const { signOut } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <>
      <View style={styles.container} className="flex-1 bg-gray-700">
        <YouTubeHeader />

        <View style={styles.child} className="flex-1 "></View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#009af8",
  },

  child: {
    backgroundColor: "red",
    marginBottom: 50,
    paddingHorizontal: 10,
  },
});
