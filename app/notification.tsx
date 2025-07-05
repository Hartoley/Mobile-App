import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const notifications = [
  {
    id: "1",
    name: "Patrick Hill",
    action: "liked",
    item: "Onboarding Screen UI Design",
    time: "7m",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2",
    name: "Kyle Powell",
    action: "liked",
    item: "Onboarding Screen UI Design",
    time: "8m",
    avatar: "https://randomuser.me/api/portraits/men/43.jpg",
  },
  {
    id: "3",
    name: "Danielle Baker",
    action: "liked",
    item: "Onboarding Screen UI Design",
    time: "12m",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    id: "4",
    name: "Christine Brewer",
    action: "liked",
    item: "Dashboard Screen UI Design",
    time: "35m",
    avatar: "https://randomuser.me/api/portraits/women/41.jpg",
  },
  {
    id: "5",
    name: "Jose McCoy",
    action: "commented",
    item: "Dashboard Screen UI Design",
    time: "36m",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    id: "6",
    name: "Kyle Wagner",
    action: "liked",
    item: "Food App UI Design",
    time: "22 July",
    avatar: "https://randomuser.me/api/portraits/men/63.jpg",
  },
  {
    id: "7",
    name: "Tyler Fox",
    action: "liked",
    item: "Food App UI Design Approved",
    time: "22 July",
    avatar: "https://randomuser.me/api/portraits/men/24.jpg",
  },
  {
    id: "8",
    name: "Natasha Lucas",
    action: "commented",
    item: "Signup Screen UI Design",
    time: "25 July",
    avatar: "https://randomuser.me/api/portraits/women/31.jpg",
  },
  {
    id: "9",
    name: "Kelly Williamson",
    action: "liked",
    item: "Onboarding Screen UI Design",
    time: "25 July",
    avatar: "https://randomuser.me/api/portraits/women/55.jpg",
  },

  {
    id: "10",
    name: "Tyler Fox",
    action: "liked",
    item: "Food App UI Design Request in review",
    time: "22 July",
    avatar: "https://randomuser.me/api/portraits/men/24.jpg",
  },

  {
    id: "11",
    name: "Tyler Fox",
    action: "liked",
    item: "Food App UI Design",
    time: "22 July",
    avatar: "https://randomuser.me/api/portraits/men/24.jpg",
  },
];

const Notification = () => {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.action}>
          {item.action} <Text style={styles.item}>{item.item}</Text>
        </Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(215,223,243)" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "rgb(0,20,77)",
    height: "15%",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    gap: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 13,
    color: "rgb(0,20,77)",
  },
  action: {
    fontSize: 12,
    color: "#333",
  },
  item: {
    fontWeight: "600",
  },
  time: {
    fontSize: 10,
    color: "grey",
  },
});
