import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ChatScreen = () => {
  const router = useRouter();
  const { id, name, avatar } = useLocalSearchParams();

  const [messages, setMessages] = useState([
    { id: "1", text: "Hi there!", sender: "other" },
    { id: "2", text: "Hello, how can I help you?", sender: "me" },
    { id: "3", text: "I wanted to check in about the order.", sender: "other" },
  ]);
  const [input, setInput] = useState("");

  const flatListRef = useRef();

  const sendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: input,
        sender: "me",
      };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleAttach = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: "*/*",
      });

      if (res.type === "success") {
        const newMessage = {
          id: Date.now().toString(),
          text: `Sent a file: ${res.name}`,
          sender: "me",
        };
        setMessages((prev) => [...prev, newMessage]);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (err) {
      console.error("Document pick error:", err);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "me" ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          { color: item.sender === "me" ? "white" : "black" },
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Image source={{ uri: avatar }} style={styles.headerAvatar} />
            <Text style={styles.headerTitle}>{name}</Text>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, flexGrow: 1 }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TouchableOpacity
                onPress={handleAttach}
                style={styles.iconButton}
              >
                <Ionicons name="attach" size={20} color="#555" />
              </TouchableOpacity>
              <View>
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder="Type a message"
                  style={styles.input}
                  placeholderTextColor="#888"
                />
              </View>
            </View>

            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgb(215,223,243)" },
  header: {
    backgroundColor: "rgb(0,20,77)",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 10,
  },
  headerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  headerTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  myMessage: {
    backgroundColor: "rgb(116,98,255)",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#e5e7eb",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    width: "100%",

    marginBottom: 20,
  },
  iconButton: {
    marginRight: 8,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    height: 50,
    borderRadius: 30,
    paddingHorizontal: 12,
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  input: {
    color: "#333",
    // backgroundColor: "white",
    width: 250,
    borderRadius: 20,
  },
  sendButton: {
    backgroundColor: "rgb(116,98,255)",
    width: 35,
    height: 35,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
