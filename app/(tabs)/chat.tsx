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
    id: "1",
    name: "Jane Doe",
    lastMessage: "Hey, how are you?",
    time: "10:45 AM",
    avatar:
      "https://i.pinimg.com/736x/bf/9c/5c/bf9c5c76fd2e3aa8b0ca595d4a1a278e.jpg",
  },
  {
    id: "2",
    name: "John Smith",
    lastMessage: "Let's catch up later.",
    time: "9:30 AM",
    avatar:
      "https://i.pinimg.com/736x/8b/8a/0e/8b8a0ee0481f7f86c4aaedb087b78bca.jpg",
  },
  // Add more dummy chats as needed
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
