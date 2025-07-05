import { useAuth } from "@/lib/autht-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function YouTubeHeader() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const isNavigatingRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      isNavigatingRef.current = false;
    }, [])
  );

  const handleNotificationPress = () => {
    if (isNavigatingRef.current) return;

    isNavigatingRef.current = true; // block further presses immediately
    router.push("/notification");
  };
  const edit = () => {
    router.push("/editProfile");
  };

  return (
    <View style={styles.container}>
      {/* Top: Location and Bell */}
      <View style={styles.topRow}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={14} color="#ffbe55" />
          <Text style={styles.locationText}>New York, USA</Text>
          <Ionicons name="chevron-down" size={12} color="#fff" />
        </View>

        <View className="flex-row gap-2">
          {/* <TouchableOpacity onPress={signOut} style={styles.bellWrapper}>
            <Ionicons name="log-out" size={16} color="white" />
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.bellWrapper}
            onPress={handleNotificationPress}
            disabled={isNavigating}
          >
            <Ionicons name="notifications-outline" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar + Filter */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Ionicons
            name="search"
            size={16}
            color="#555"
            style={{ marginLeft: 6 }}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#666"
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity style={styles.filterButton} onPress={edit}>
          <Ionicons name="settings" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 64,
    paddingHorizontal: 14,
    paddingBottom: 34,
    gap: 10,
    backgroundColor: "rgb(0,20,77)",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  locationText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    marginHorizontal: 4,
  },
  bellWrapper: {
    backgroundColor: "#0d1a47",
    padding: 6,
    borderRadius: 10,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 4,
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: "#000",
    paddingHorizontal: 6,
  },
  filterButton: {
    backgroundColor: "rgb(116,98,255)",
    borderRadius: 10,
    padding: 8,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
