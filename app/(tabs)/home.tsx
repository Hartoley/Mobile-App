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
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ import storage
import Category from "../category";
import YouTubeHeader from "../header";

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://qurioans.onrender.com/mobile/products?page=1&limit=20"
      );
      const data = await res.json();

      if (data.products?.length) {
        setProducts(data.products);
        setFiltered(data.products);

        // ✅ Save products to storage
        await AsyncStorage.setItem(
          "cachedProducts",
          JSON.stringify(data.products)
        );
      }
    } catch (err) {
      console.error("Failed to fetch:", err);

      // ✅ Load fallback from cache
      const cached = await AsyncStorage.getItem("cachedProducts");
      if (cached) {
        const parsed = JSON.parse(cached);
        setProducts(parsed);
        setFiltered(parsed);
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts().finally(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (category === "All") {
      setFiltered(products);
    } else {
      const filteredData = products.filter(
        (item) => item.category?.toLowerCase() === category.toLowerCase()
      );
      setFiltered(filteredData);
    }
  }, [category, products]);

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

  const renderPlaceholder = (_, index) => (
    <View key={index} style={styles.card}>
      <View style={[styles.image, { backgroundColor: "#e5e7eb" }]} />
      <View style={styles.heart}>
        <AntDesign name="hearto" size={16} color="#ccc" />
      </View>
      <View
        style={{
          height: 12,
          backgroundColor: "#e5e7eb",
          borderRadius: 4,
          marginTop: 8,
          width: "70%",
        }}
      />
      <View style={[styles.row, { marginTop: 6 }]}>
        {[...Array(5)].map((_, i) => (
          <AntDesign key={i} name="star" size={12} color="#d1d5db" />
        ))}
      </View>
      <View
        style={{
          height: 14,
          backgroundColor: "#e5e7eb",
          borderRadius: 4,
          width: "40%",
          marginTop: 6,
        }}
      />
    </View>
  );

  return (
    <View className="h-full w-full bg-[rgb(215,223,243)]">
      <YouTubeHeader />
      <Category active={category} setActive={setCategory} />
      {filtered.length === 0 && !loading ? (
        <Text style={styles.noResultText}>
          No products available in "{category}" category.
        </Text>
      ) : (
        <FlatList
          data={loading || refreshing ? Array.from({ length: 6 }) : filtered}
          renderItem={loading || refreshing ? renderPlaceholder : renderItem}
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
      )}
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
  noResultText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    color: "#444",
    fontStyle: "italic",
  },
});
