import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar, // <-- includes your wrapper logic
        tabBarIcon: ({ focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "help-circle-outline";

          switch (route.name) {
            case "home":
              iconName = "home";

              break;
            case "cart":
              iconName = "bag-outline";
              break;
            case "wishlist":
              iconName = "heart-outline";
              break;
            case "chat":
              iconName = "chatbubble-ellipses-outline";
              break;
            case "profile":
              iconName = "person-outline";
              break;
          }

          return (
            <View style={[styles.iconWrapper, focused && styles.activeWrapper]}>
              <Ionicons
                name={iconName}
                size={20}
                color={focused ? "rgb(116,98,255)" : "#ccc"}
              />
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="wishlist" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 35,
    marginLeft: 12,
    width: 330,
    height: 64,
    alignSelf: "center", // <- centers horizontally
    borderRadius: 40,
    backgroundColor: "rgb(0,20,77)",
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderTopWidth: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 100,
    paddingTop: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  activeWrapper: {
    backgroundColor: "white",
  },
});
