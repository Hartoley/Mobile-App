import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import YouTubeHeader from "../header";

export default function ManageProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://qurioans.onrender.com/mobile/products?page=1&limit=20"
      );
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/edit/${item._id}`)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>₦{item.price}</Text>
        <View style={styles.editRow}>
          <Ionicons name="create-outline" size={14} color="#003366" />
          <Text style={styles.editText}>Edit</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="h-full w-full bg-[rgb(215,223,243)]">
      <YouTubeHeader />
      <View style={styles.container}>
        <Text style={styles.header} className="text-center">
          Manage Your Products
        </Text>

        {loading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color="#003366" />
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <Ionicons name="cube-outline" size={50} color="#003366" />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(215,223,243)",
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#001a41",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    overflow: "hidden",
    gap: 5,
    paddingHorizontal: 5,
  },
  image: {
    width: 80,
    height: 80,
    alignSelf: "center",
    borderRadius: 5,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  price: {
    color: "#A52A2A",
    fontWeight: "500",
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  editText: {
    marginLeft: 5,
    color: "#003366",
    fontSize: 13,
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
});
