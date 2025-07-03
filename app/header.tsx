import { useAuth } from "@/lib/autht-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface YouTubeHeaderProps {
  showSearch?: boolean;
  searchValue?: string;
  onMenuPress: () => void;
  onSearchChange: (text: string) => void;
  onSearchSubmit: () => void;
  onProfilePress: () => void;
  onNotificationsPress: () => void;
  onCastPress: () => void;
}

export default function YouTubeHeader({
  showSearch = false,
  searchValue = "",
  onMenuPress,
  onSearchChange,
  onSearchSubmit,
  onProfilePress,
  onNotificationsPress,
  onCastPress,
}: YouTubeHeaderProps) {
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      {/* Left menu icon */}
      <TouchableOpacity onPress={onMenuPress} style={styles.leftIcon}>
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>

      {/* Center: Logo or Search */}
      <View style={styles.centerContainer}>
        {!showSearch ? (
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
            }}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchValue}
            onChangeText={onSearchChange}
            onSubmitEditing={onSearchSubmit}
            returnKeyType="search"
          />
        )}
      </View>

      {/* Right icons */}
      <View style={styles.rightIcons}>
        <TouchableOpacity
          onPress={onNotificationsPress}
          style={styles.iconButton}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onProfilePress} style={styles.iconButton}>
          <Ionicons name="person-circle-outline" size={28} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={signOut} style={styles.iconButton}>
          <MaterialIcons name="logout" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    height: 86,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    elevation: 4,
  },
  leftIcon: {
    padding: 8,
  },
  centerContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  logo: {
    width: 100,
    height: 30,
  },
  searchInput: {
    backgroundColor: "#f1f3f4",
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 36,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 16,
    padding: 6,
  },
});
