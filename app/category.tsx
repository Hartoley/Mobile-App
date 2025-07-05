import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const categories = [
  "All",
  "Electronics",
  "Books",
  "Clothing",
  "Food",
  "Hostel",
  "Transport",
  "Used",
  "Freelance",
  "Bags",
  "Shoes",
  "Watch",
  "New",
];

const Category = () => {
  const [active, setActive] = useState("All");

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.pill, active === item && styles.activePill]}
            onPress={() => setActive(item)}
          >
            <Text style={[styles.text, active === item && styles.activeText]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignSelf: "center",
    width: "95%",
    height: 40,
  },
  scroll: {
    alignItems: "center",
    paddingLeft: 4,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  activePill: {
    backgroundColor: "rgb(0,20,77)", // subtle green
    borderColor: "#a3b18a",
  },
  text: {
    fontSize: 13,
    color: "#333",
    fontFamily: "serif", // swap with custom font later
  },
  activeText: {
    color: "#fff",
    fontWeight: "500",
  },
});
