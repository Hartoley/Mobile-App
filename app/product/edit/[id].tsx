import Category from "@/app/category";
import YouTubeHeader from "@/app/header";
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

export default function ManageProducts() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://qurioans.onrender.com/mobile/products?page=${pageNum}&limit=10`
      );
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || pageNum);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts(1).finally(() => setRefreshing(false));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/products/edit/${item._id}`)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <TouchableOpacity style={styles.heart}>
        <AntDesign name="edit" size={16} color="#f55" />
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
        <AntDesign name="edit" size={16} color="#ccc" />
      </View>
      <View style={styles.placeholderBar} />
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
      <Category />

      <FlatList
        data={loading || refreshing ? Array.from({ length: 6 }) : products}
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

      <View style={styles.pagination}>
        <TouchableOpacity
          disabled={page <= 1}
          onPress={() => fetchProducts(page - 1)}
        >
          <Text style={[styles.pageButton, page <= 1 && styles.disabled]}>
            Previous
          </Text>
        </TouchableOpacity>

        <Text style={styles.pageInfo}>
          Page {page} of {totalPages}
        </Text>

        <TouchableOpacity
          disabled={page >= totalPages}
          onPress={() => fetchProducts(page + 1)}
        >
          <Text
            style={[styles.pageButton, page >= totalPages && styles.disabled]}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#001a41",
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
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
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
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
  placeholderBar: {
    height: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginTop: 8,
    width: "70%",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  pageButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003366",
  },
  disabled: {
    color: "#aaa",
  },
  pageInfo: {
    fontSize: 13,
    color: "#555",
  },
});
