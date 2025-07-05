import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const EditProfile = () => {
  const [form, setForm] = useState({
    name: "Sakeena Zayn",
    email: "sakeena@example.com",
    phone: "+123 456 7890",
    address: "123 Main Street, New York, USA",
    card: "Visa **** 5432",
    language: "English",
  });

  const [settings, setSettings] = useState({
    notifications: true,
  });

  const [sections, setSections] = useState({
    personal: true,
    payment: false,
    preferences: false,
    support: false,
  });

  const toggleSection = (key: keyof typeof sections) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log("Updated Profile:", form, settings);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="settings" size={18} color="white" />
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>

      {/* Sections */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* PERSONAL INFO */}
        <Section
          title="Personal Info"
          expanded={sections.personal}
          onToggle={() => toggleSection("personal")}
        >
          <Label text="Full Name" />
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(text) => handleChange("name", text)}
          />
          <Label text="Email" />
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
          />
          <Label text="Phone" />
          <TextInput
            style={styles.input}
            value={form.phone}
            onChangeText={(text) => handleChange("phone", text)}
            keyboardType="phone-pad"
          />
          <Label text="Address" />
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={form.address}
            multiline
            onChangeText={(text) => handleChange("address", text)}
          />
        </Section>

        {/* PAYMENT INFO */}
        <Section
          title="Payment & Shipping"
          expanded={sections.payment}
          onToggle={() => toggleSection("payment")}
        >
          <Label text="Payment Method" />
          <TextInput
            style={styles.input}
            value={form.card}
            onChangeText={(text) => handleChange("card", text)}
          />
          <Label text="Shipping Info" />
          <TextInput
            style={styles.inputDisabled}
            value="Fast delivery, 3-5 days"
            editable={false}
          />
        </Section>

        {/* PREFERENCES */}
        <Section
          title="Preferences"
          expanded={sections.preferences}
          onToggle={() => toggleSection("preferences")}
        >
          <View style={styles.switchRow}>
            <Text style={styles.label}>Notifications</Text>
            <Switch
              value={settings.notifications}
              onValueChange={(val) =>
                setSettings((prev) => ({ ...prev, notifications: val }))
              }
            />
          </View>
          <Label text="Language" />
          <TextInput
            style={styles.input}
            value={form.language}
            onChangeText={(text) => handleChange("language", text)}
          />
        </Section>

        {/* SUPPORT */}
        <Section
          title="Support & Info"
          expanded={sections.support}
          onToggle={() => toggleSection("support")}
        >
          <Text style={styles.staticOption}>Help Center</Text>
          <Text style={styles.staticOption}>Return Policy - 30 days</Text>
          <Text style={[styles.staticOption, { color: "#f44" }]}>Logout</Text>
        </Section>

        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Label Component
const Label = ({ text }: { text: string }) => (
  <Text style={styles.label}>{text}</Text>
);

// Expandable Section
const Section = ({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <TouchableOpacity onPress={onToggle} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={{ fontSize: 16 }}>{expanded ? "−" : "+"}</Text>
      </TouchableOpacity>
      {expanded && <View style={{ paddingTop: 10 }}>{children}</View>}
    </View>
  );
};

export default EditProfile;

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(215,223,243)",
  },
  header: {
    backgroundColor: "rgb(0,20,77)",
    height: "15%",
    paddingTop: 40,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 16,
    color: "#000",
  },
  inputDisabled: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 16,
    color: "#666",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgb(0,20,77)",
  },
  staticOption: {
    fontSize: 13,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    color: "#222",
  },
  saveButton: {
    backgroundColor: "rgb(116,98,255)",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
