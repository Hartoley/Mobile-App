import { useAuth } from "@/lib/autht-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  Dimensions,
  Image,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Profile = () => {
  const [sections, setSections] = useState({
    account: true,
    orders: false,
    payments: false,
    settings: false,
    support: false,
  });
  const { signOut } = useAuth();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [storedUser, setStoredUser] = useState<string | null>(null);

  useEffect(() => {
    const getStoredUser = async () => {
      const id = await AsyncStorage.getItem("QurioUser");
      setStoredUser(id);
    };
    getStoredUser();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!storedUser) return;
      setLoading(true);
      try {
        const res = await fetch(
          `https://qurioans.onrender.com/qurioans/getuser/${storedUser}`
        );
        const data = await res.json();
        if (data.status) {
          setUser(data.data);
        }
      } catch (error) {
        console.error("Fetch user failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [storedUser]);

  const toggleSection = (key: keyof typeof sections) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const edit = () => {
    router.push("/editProfile");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* 🦴 Skeleton loader while fetching */}
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No user data found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(215,223,243)" }}>
      {/* Fixed Top Section */}
      <View style={styles.fixedTop}>
        <Image
          source={{
            uri:
              user.coverPhoto ||
              "https://i.pinimg.com/736x/23/2e/d9/232ed9ce4e9a2829dbd5f7b2b909d8bf.jpg",
          }}
          style={styles.coverImage}
        />
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                user.avatarUrl ||
                "https://i.pinimg.com/736x/ab/d5/bf/abd5bf400a1475b76d8614cf6e815b8b.jpg",
            }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Scrollable Profile Info */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: 200 }}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.userName || "Unnamed"}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>

          <Section
            title="Account Info"
            expanded={sections.account}
            onToggle={() => toggleSection("account")}
            items={[
              { label: "Phone Number", value: user.phoneNumber || "N/A" },
              { label: "Address", value: user.address || "N/A" },
              {
                label: "Member Since",
                value: user.createdAt
                  ? new Date(user.createdAt).toDateString()
                  : "N/A",
              },
            ]}
          />
          <Section
            title="Orders & Wishlist"
            expanded={sections.orders}
            onToggle={() => toggleSection("orders")}
            items={[
              { label: "My Orders", value: "View your orders" },
              { label: "Wishlist", value: "Saved items" },
              { label: "Recently Viewed", value: "Continue shopping" },
            ]}
          />
          <Section
            title="Payments & Shipping"
            expanded={sections.payments}
            onToggle={() => toggleSection("payments")}
            items={[
              { label: "Payment Methods", value: user.card || "N/A" },
              {
                label: "Billing Address",
                value: user.address || "Same as delivery address",
              },
              { label: "Shipping Info", value: "Fast delivery, 3-5 days" },
            ]}
          />
          <Section
            title="App Preferences"
            expanded={sections.settings}
            onToggle={() => toggleSection("settings")}
            items={[
              {
                label: "Notifications",
                type: "toggle",
                value: user.notificationPreferences?.push || false,
              },
              { label: "Language", value: user.language || "English" },
            ]}
          />
          <Section
            title="Support & Settings"
            expanded={sections.support}
            onToggle={() => toggleSection("support")}
            items={[
              { label: "Help Center", value: "FAQs and Contact" },
              { label: "Return Policy", value: "30-day return" },
              { label: "Privacy Settings", value: "Manage your data" },
              {
                label: "Log Out",
                value: "Log out from app",
                onPress: signOut,
              },
            ]}
          />
        </View>

        <TouchableOpacity onPress={edit} style={styles.editButton}>
          <Text style={styles.editText}>Edit profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// ======= SECTION COMPONENT =========
const Section = ({
  title,
  expanded,
  onToggle,
  items,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  items: {
    label: string;
    value?: string | boolean;
    type?: "toggle";
    onPress?: () => void;
  }[];
}) => {
  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity
        onPress={onToggle}
        style={styles.sectionHeader}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={{ fontSize: 16 }}>{expanded ? "−" : "+"}</Text>
      </TouchableOpacity>

      {expanded &&
        items.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.itemRow}
            onPress={item.onPress}
            disabled={!item.onPress}
          >
            <Text style={styles.itemLabel}>{item.label}</Text>
            {item.type === "toggle" ? (
              <Switch value={!!item.value} disabled />
            ) : (
              <Text style={styles.itemValue}>{item.value}</Text>
            )}
          </TouchableOpacity>
        ))}
    </View>
  );
};

export default Profile;

// ========== STYLES ==========

const styles = StyleSheet.create({
  fixedTop: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1,
    backgroundColor: "rgb(0,20,77)",
    height: 160,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  avatarContainer: {
    position: "absolute",
    bottom: -40,
    left: "50%",
    transform: [{ translateX: -50 }],
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 50,
    overflow: "hidden",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "rgb(215,223,243)",
  },
  nameContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    fontWeight: "700",
    fontSize: 16,
    color: "rgb(0,20,77)",
  },
  email: {
    fontSize: 12,
    color: "#666",
  },
  sectionContainer: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgb(0,20,77)",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  itemLabel: {
    fontSize: 12,
    color: "#444",
  },
  itemValue: {
    fontSize: 12,
    color: "#000",
    maxWidth: "60%",
    textAlign: "right",
  },
  editButton: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f5f3ff",
    borderWidth: 1,
    borderColor: "#c4b5fd",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  editText: {
    color: "#4c1d95",
    fontWeight: "600",
    fontSize: 13,
  },
});
