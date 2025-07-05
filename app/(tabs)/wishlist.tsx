import { useAuth } from "@/lib/autht-context";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const streaks = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = () => {
    return fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        const shuffled = [...data.products].sort(() => 0.5 - Math.random());
        setProducts(shuffled);
      })
      .catch((error) => console.error("Error fetching products:", error));
  };

  useEffect(() => {
    fetchProducts().finally(() => setLoading(false));
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setProducts([]);
    fetchProducts().finally(() => setRefreshing(false));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${item.id}`)}
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
            color={i < Math.round(item.rating) ? "#facc15" : "#e5e7eb"}
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
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View
        style={{
          backgroundColor: "rgb(0,20,77)",
          height: "15%",
          alignContent: "center",
          justifyContent: "center",
          paddingVertical: 16,
          alignItems: "center",
          paddingTop: 40,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          overflow: "hidden",
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Ionicons name="heart" size={18} color="red" />

        <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
          My Wishlist
        </Text>
      </View>
      <View style={styles.container}>
        <FlatList
          data={loading || refreshing ? Array.from({ length: 6 }) : products}
          renderItem={loading || refreshing ? renderPlaceholder : renderItem}
          keyExtractor={(item, index) =>
            loading || refreshing ? index.toString() : item.id.toString()
          }
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </View>
    </View>
  );
};

export default streaks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(215,223,243)",
    paddingVertical: 15,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 80,
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
