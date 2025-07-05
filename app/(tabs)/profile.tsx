import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Profile = () => {
  const [user, setUser] = useState({
    name: "Sakeena Zayn",
    phone: "+123 456 7890",
    address: "123 Main Street, New York, USA",
    email: "sakeena@example.com",
    avatar:
      "https://i.pinimg.com/736x/ab/d5/bf/abd5bf400a1475b76d8614cf6e815b8b.jpg",
    cover:
      "https://i.pinimg.com/736x/23/2e/d9/232ed9ce4e9a2829dbd5f7b2b909d8bf.jpg",
    notifications: true,
  });

  const handleChange = (key, value) => {
    setUser({ ...user, [key]: value });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.coverContainer}>
        <Image source={{ uri: user.cover }} style={styles.coverImage} />
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={user.name}
          onChangeText={(text) => handleChange("name", text)}
          style={styles.input}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          value={user.phone}
          onChangeText={(text) => handleChange("phone", text)}
          style={styles.input}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          value={user.address}
          onChangeText={(text) => handleChange("address", text)}
          style={styles.input}
          multiline
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={user.email}
          onChangeText={(text) => handleChange("email", text)}
          style={styles.input}
          keyboardType="email-address"
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Notifications</Text>
          <Switch
            value={user.notifications}
            onValueChange={(val) => handleChange("notifications", val)}
          />
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(215,223,243)",
  },
  coverContainer: {
    height: 180,
    backgroundColor: "rgb(0,20,77)",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  avatarContainer: {
    position: "absolute",
    bottom: -50,
    left: "50%",
    transform: [{ translateX: -50 }],
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 60,
    overflow: "hidden",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    marginTop: 60,
    paddingHorizontal: 20,
    gap: 10,
  },
  label: {
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    fontSize: 14,
    color: "#000",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "rgb(116,98,255)",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
