import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Category from "../category";
import YouTubeHeader from "../header";

export default function Products() {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://qurioans.onrender.com/mobile/products?page=1&limit=100"
      );
      const data = await res.json();
      setAllProducts(data.products);
      filterProducts(data.products, category);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (data, selectedCategory) => {
    if (selectedCategory === "All") {
      setProducts(data);
    } else {
      const filtered = data.filter(
        (item) =>
          item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
      setProducts(filtered);
    }
  };

  const onCategoryChange = (cat) => {
    setCategory(cat);
    filterProducts(allProducts, cat);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts().finally(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${item._id}`)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <TouchableOpacity style={styles.heart}>
        <AntDesign name="hearto" size={16} color="#f55" />
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>
        {item.title}
      </Text>
      <View style={styles.row}>
        {[...Array(5)].map((_, i) => (
          <AntDesign
            key={i}
            name="star"
            size={12}
            color={i < Math.round(item.rating || 4) ? "#facc15" : "#e5e7eb"}
          />
        ))}
      </View>
      <Text style={styles.price}>₦ {item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="h-full w-full bg-[rgb(215,223,243)]">
      <YouTubeHeader />
      <Category selected={category} onChange={onCategoryChange} />
      <FlatList
        data={loading || refreshing ? [] : products}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          loading || refreshing ? index.toString() : item._id
        }
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginBottom: 16,
    width: "48%",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    resizeMode: "contain",
  },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  title: {
    fontWeight: "400",
    fontSize: 12,
    marginTop: 8,
    color: "rgb(0,20,77)",
    fontFamily: "serif",
  },
  row: {
    flexDirection: "row",
    marginVertical: 4,
  },
  price: {
    fontWeight: "700",
    color: "rgb(0,20,77)",
    fontSize: 12,
  },
});
