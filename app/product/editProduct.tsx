import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";

export default function ManageProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://qurioans.onrender.com/mobile/products?seller=68460be2acf270418acdf715"
      );
      setProducts(res.data);
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
      onPress={() => router.push(`/edit/${item._id}`)}
    >
      <Image source={{ uri: item.thumbnail?.url }} style={styles.image} />
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
    <View style={styles.container}>
      <Text style={styles.header}>Manage Your Products</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#003366" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
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
  },
  image: {
    width: 80,
    height: 80,
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
});
