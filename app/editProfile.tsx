import { useAuth } from "@/lib/autht-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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
  const { signOut } = useAuth();
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [userId, setUserId] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [form, setForm] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    card: "",
    language: "",
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

  const toggleSection = (key) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fetchUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("QurioUser");
      if (!storedUser) throw new Error("User ID not found");
      setUserId(storedUser);

      const response = await fetch(
        `https://qurioans.onrender.com/qurioans/getuser/${storedUser}`
      );
      const data = await response.json();

      if (response.ok && data.data) {
        const user = data.data;
        setForm({
          userName: user.userName || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          address: user.address || "",
          card: user.card || "",
          language: user.language || "",
        });
        setSettings({
          notifications: user.notificationPreferences?.push || false,
        });
        if (user.avatarUrl) {
          setAvatar({ uri: user.avatarUrl });
        }
      } else {
        console.error("Fetch user error:", data);
        alert("Failed to load user data.");
      }
    } catch (error) {
      console.error("Fetch user failed:", error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const pickAvatar = async () => {
    console.log("pickAvatar clicked");
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("Permission status:", status);
    if (status !== "granted") {
      alert("Permission denied!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    console.log("Picker result:", result);

    if (!result.canceled) {
      const asset = result.assets[0];
      setAvatar({ uri: asset.uri });
      setAvatarFile(asset);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    setLoadingSave(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append(
        "notificationPreferences",
        JSON.stringify({ push: settings.notifications })
      );

      if (avatarFile) {
        formData.append("avatarUrl", {
          uri: avatarFile.uri,
          type: "image/jpeg",
          name: "avatar.jpg",
        });
      }

      const response = await fetch(
        `https://qurioans.onrender.com/qurioans/update-profile/${userId}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Profile updated successfully.");
        fetchUser();
      } else {
        console.error("Update failed:", data);
        alert("Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred.");
    } finally {
      setLoadingSave(false);
    }
  };

  if (loadingUser) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="rgb(0,20,77)" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(215,223,243)" }}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="settings" size={18} color="white" />
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Avatar */}
        <TouchableOpacity onPress={pickAvatar}>
          {avatar ? (
            <Image
              source={avatar}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                alignSelf: "center",
                marginBottom: 20,
              }}
            />
          ) : (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#ccc",
                alignSelf: "center",
                marginBottom: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Select Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* PERSONAL INFO */}
        <Section
          title="Personal Info"
          expanded={sections.personal}
          onToggle={() => toggleSection("personal")}
        >
          <Label text="Username" />
          <TextInput
            style={styles.input}
            value={form.userName}
            onChangeText={(text) => handleChange("userName", text)}
          />
          <Label text="First Name" />
          <TextInput
            style={styles.input}
            value={form.firstName}
            onChangeText={(text) => handleChange("firstName", text)}
          />
          <Label text="Last Name" />
          <TextInput
            style={styles.input}
            value={form.lastName}
            onChangeText={(text) => handleChange("lastName", text)}
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
            value={form.phoneNumber}
            onChangeText={(text) => handleChange("phoneNumber", text)}
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

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loadingSave}
        >
          <Text style={styles.saveText}>
            {loadingSave ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const Label = ({ text }) => <Text style={styles.label}>{text}</Text>;

const Section = ({ title, expanded, onToggle, children }) => (
  <View style={{ marginBottom: 20 }}>
    <TouchableOpacity onPress={onToggle} style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={{ fontSize: 16 }}>{expanded ? "−" : "+"}</Text>
    </TouchableOpacity>
    {expanded && <View style={{ paddingTop: 10 }}>{children}</View>}
  </View>
);

export default EditProfile;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "rgb(215,223,243)",
    paddingBottom: 10,
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
    paddingVertical: 10,
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
    backgroundColor: "rgb(0,20,77)",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f44",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 50,
  },
  logoutText: {
    color: "#f44",
    fontWeight: "600",
    fontSize: 14,
  },
});
