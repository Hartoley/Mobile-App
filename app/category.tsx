import React from "react";
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
  "Men",
  "Women",
  "Beauty",
  "Fashion",
  "Health",
  "Home",
  "Lifestyle",
  "Sports",
  "Kids",
  "Pets",
  "Others",
];

const Category = ({ selected, onChange }) => {
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
            style={[styles.pill, selected === item && styles.activePill]}
            onPress={() => onChange(item)}
          >
            <Text style={[styles.text, selected === item && styles.activeText]}>
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
    backgroundColor: "rgb(215,223,243)",
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
    backgroundColor: "rgb(0,20,77)",
    borderColor: "#a3b18a",
  },
  text: {
    fontSize: 13,
    color: "#333",
    fontFamily: "serif",
  },
  activeText: {
    color: "#fff",
    fontWeight: "500",
  },
});
