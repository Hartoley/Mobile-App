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

const chats = [
  {
    id: "11",
    name: "Liam Carter",
    lastMessage: "Just arrived!",
    time: "5:22 PM",
    avatar:
      "https://i.pinimg.com/736x/04/c6/9a/04c69ae5d3e4691a50dc5988a9f469a9.jpg",
  },
  {
    id: "12",
    name: "Noah Williams",
    lastMessage: "Okay 👍",
    time: "4:10 PM",
    avatar:
      "https://i.pinimg.com/736x/ce/68/f6/ce68f6a16a33b0b988c1d3518d2b8008.jpg",
  },
  {
    id: "13",
    name: "Olivia Martin",
    lastMessage: "Hahaha 😂",
    time: "3:47 PM",
    avatar:
      "https://i.pinimg.com/736x/77/72/0a/77720a33478bd39ca0ab45cfbdf36115.jpg",
  },
  {
    id: "14",
    name: "Emma Garcia",
    lastMessage: "Let’s do it!",
    time: "2:30 PM",
    avatar:
      "https://i.pinimg.com/736x/64/2f/8d/642f8d8c875c1ce1e0da9010e6b0ec9c.jpg",
  },
  {
    id: "15",
    name: "Ava Martinez",
    lastMessage: "See you tomorrow.",
    time: "1:05 PM",
    avatar:
      "https://i.pinimg.com/736x/64/2f/8d/642f8d8c875c1ce1e0da9010e6b0ec9c.jpg",
  },
  {
    id: "16",
    name: "Ethan Davis",
    lastMessage: "Still at work 😩",
    time: "12:40 PM",
    avatar:
      "https://i.pinimg.com/736x/ec/a8/bc/eca8bcd7fbcfd9f057a377db4b53d7f9.jpg",
  },
  {
    id: "17",
    name: "Mia Robinson",
    lastMessage: "Awesome, thanks!",
    time: "11:15 AM",
    avatar:
      "https://i.pinimg.com/736x/6d/2d/2a/6d2d2a88ee9fbafdc0927e57896f2451.jpg",
  },
  {
    id: "18",
    name: "Lucas Thompson",
    lastMessage: "Where are you?",
    time: "10:00 AM",
    avatar:
      "https://i.pinimg.com/736x/45/43/d4/4543d4be4a5dd6173b75903a2ac4aede.jpg",
  },
  {
    id: "19",
    name: "Amelia White",
    lastMessage: "Be right back.",
    time: "Yesterday",
    avatar:
      "https://i.pinimg.com/736x/1d/29/a7/1d29a72f408a97affd507d93bffab473.jpg",
  },
  {
    id: "20",
    name: "Benjamin Scott",
    lastMessage: "Got it!",
    time: "Monday",
    avatar:
      "https://i.pinimg.com/736x/e6/16/ed/e616ede4d23bba364f1d8acb53d92d0c.jpg",
  },
];

const AllChatsScreen = () => {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        router.push({
          pathname: `/chats/${item.id}`,
          params: { name: item.name, avatar: item.avatar },
        })
      }
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="chatbubbles" size={20} color="white" />
        <Text style={styles.headerTitle}>My Chats</Text>
      </View>

      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default AllChatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(215,223,243)",
    paddingBottom: "13%",
  },
  header: {
    backgroundColor: "rgb(0,20,77)",
    paddingVertical: 20,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  chatItem: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 10,
  },
  chatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontWeight: "bold",
    color: "rgb(0,20,77)",
  },
  time: {
    fontSize: 12,
    color: "grey",
  },
  lastMessage: {
    fontSize: 12,
    color: "grey",
    marginTop: 4,
  },
});
