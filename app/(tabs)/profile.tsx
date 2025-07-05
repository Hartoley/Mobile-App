import React, { useState } from "react";
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

  const toggleSection = (key: keyof typeof sections) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(215,223,243)" }}>
      {/* Fixed Top Section */}
      <View style={styles.fixedTop}>
        <Image
          source={{
            uri: "https://i.pinimg.com/736x/23/2e/d9/232ed9ce4e9a2829dbd5f7b2b909d8bf.jpg",
          }}
          style={styles.coverImage}
        />
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: "https://i.pinimg.com/736x/ab/d5/bf/abd5bf400a1475b76d8614cf6e815b8b.jpg",
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
            <Text style={styles.name}>Sakeena Zayn</Text>
            <Text style={styles.email}>sakeena@example.com</Text>
          </View>

          <Section
            title="Account Info"
            expanded={sections.account}
            onToggle={() => toggleSection("account")}
            items={[
              { label: "Phone Number", value: "+123 456 7890" },
              { label: "Address", value: "123 Main Street, New York, USA" },
              { label: "Member Since", value: "March 2023" },
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
              { label: "Payment Methods", value: "Visa **** 5432" },
              { label: "Billing Address", value: "Same as delivery address" },
              { label: "Shipping Info", value: "Fast delivery, 3-5 days" },
            ]}
          />
          <Section
            title="App Preferences"
            expanded={sections.settings}
            onToggle={() => toggleSection("settings")}
            items={[
              { label: "Notifications", type: "toggle", value: true },
              { label: "Language", value: "English" },
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
              { label: "Log Out", value: "Log out from app" },
            ]}
          />
        </View>
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
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itemLabel}>{item.label}</Text>
            {item.type === "toggle" ? (
              <Switch value={!!item.value} disabled />
            ) : (
              <Text style={styles.itemValue}>{item.value}</Text>
            )}
          </View>
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
});
