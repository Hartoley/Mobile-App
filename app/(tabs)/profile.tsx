import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Profile = () => {
  const user = {
    name: "Sakeena Zayn",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    avatar:
      "https://i.pinimg.com/736x/ab/d5/bf/abd5bf400a1475b76d8614cf6e815b8b.jpg",
    cover:
      "https://i.pinimg.com/736x/23/2e/d9/232ed9ce4e9a2829dbd5f7b2b909d8bf.jpg",
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
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.phone}>{user.phone}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Delivery Address</Text>
          <Text style={styles.value}>{user.address}</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Edit Address</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Notifications</Text>
          <Text style={styles.value}>Enabled</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Manage Notifications</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
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
    position: "relative",
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
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgb(0,20,77)",
  },
  phone: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgb(0,20,77)",
    marginBottom: 4,
  },
  value: {
    fontSize: 13,
    color: "#333",
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: "rgb(116,98,255)",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  actionText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff5a5f",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 30,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});
