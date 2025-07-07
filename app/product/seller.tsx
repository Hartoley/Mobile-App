import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SellerDashboard() {
  const router = useRouter();
  const navigation = useNavigation();

  const upload = () => {
    router.push("/product/uploadproduct");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="red" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="white"
          />
          <View style={styles.headerIcons}>
            <Ionicons name="notifications-outline" size={22} color="white" />
            <Ionicons name="menu" size={24} color="white" />
          </View>
        </View>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Qurio Market</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        {/* Profile */}
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: "https://i.pinimg.com/736x/26/e5/95/26e5952ed3b0708f9b98246f4d4899ac.jpg",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>Keen's Bakery</Text>
          <Text style={styles.subText}>Verified Seller</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: "#FFE6E6" }]}>
            <Text style={[styles.statValue, { color: "#A52A2A" }]}>120</Text>
            <Text style={styles.statTitle}>Sold</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#FFF5E6" }]}>
            <Text style={[styles.statValue, { color: "#DAA520" }]}>$2,400</Text>
            <Text style={styles.statTitle}>Earnings</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#E6F0FF" }]}>
            <Text style={[styles.statValue, { color: "#003366" }]}>15</Text>
            <Text style={styles.statTitle}>Listings</Text>
          </View>
        </View>

        {/* Action Grid */}
        <View style={styles.grid}>
          {[
            {
              icon: "cloud-upload-outline",
              label: "Upload Product",
              onPress: upload,
            },
            { icon: "create-outline", label: "Manage Products" },
            { icon: "cube-outline", label: "Inventory" },
            { icon: "stats-chart-outline", label: "Sales Analytics" },
            { icon: "notifications-outline", label: "Notifications" },
            { icon: "settings-outline", label: "Store Settings" },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gridItem}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon} size={24} color="#A52A2A" />
              <Text style={styles.gridText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgb(0,20,77)", // fills top area behind status bar
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "rgb(215,223,243)",
  },
  header: {
    height: 150,
    backgroundColor: "rgb(0,20,77)",
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "space-evenly",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 20,
  },
  headerTitleContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  headerTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgb(0,20,77)",
  },
  subText: {
    fontSize: 14,
    color: "#666",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  statCard: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    width: "30%",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statTitle: {
    fontSize: 12,
    color: "#333",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  gridItem: {
    width: "45%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
  },
  gridText: {
    fontSize: 13,
    marginTop: 8,
    color: "#333",
    textAlign: "center",
  },
});
