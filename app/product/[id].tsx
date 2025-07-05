import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

export default function ProductPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`https://dummyjson.com/products/${id}`)
        .then((res) => res.json())
        .then(setProduct);
    }
  }, [id]);

  if (!product) return <Text style={{ padding: 20 }}>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <AntDesign name="arrowleft" size={24} color="rgb(0,28,105)" />
        <Text style={styles.headerText}>STYLLA FASHION</Text>
        <AntDesign name="hearto" size={20} color="#f44" />
      </View>

      <Image source={{ uri: product.thumbnail }} style={styles.image} />

      {/* Dots */}
      <View style={styles.dots}>
        {[...Array(5)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === 2 && { backgroundColor: "rgb(0,28,105)" },
            ]}
          />
        ))}
      </View>

      {/* Title and Price */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>₦ {product.price}</Text>
      </View>

      {/* Stars */}
      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        {[...Array(4)].map((_, i) => (
          <AntDesign key={i} name="star" size={16} color="#FFC107" />
        ))}
        <AntDesign name="staro" size={16} color="#FFC107" />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <Text style={[styles.tabText, { color: "rgb(0,28,105)" }]}>
          Details
        </Text>
        <Text style={styles.tabText}>Review</Text>
      </View>

      <Text style={styles.description}>
        {product.description.slice(0, 150)}...
      </Text>

      <Text style={styles.label}>Product Size</Text>
      <View style={styles.sizeRow}>
        {["6", "6.5", "7", "7.5", "8", "8.5"].map((s) => (
          <View key={s} style={styles.sizeCircle}>
            <Text style={styles.sizeText}>{s}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.label}>Color Select</Text>
      <View style={styles.colorRow}>
        {["#9333ea", "#ea580c", "#d6c421", "#22d3ee", "#7c3aed"].map(
          (color) => (
            <View
              key={color}
              style={[styles.colorDot, { backgroundColor: color }]}
            />
          )
        )}
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(215,223,243)",
    padding: 16,
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontWeight: "600",
    color: "rgb(0,28,105)",
    fontSize: 14,
  },
  image: {
    width: "100%",
    height: 240,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 6,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgb(0,28,105)",
  },
  tabRow: {
    flexDirection: "row",
    gap: 24,
    marginVertical: 12,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgb(0,28,105)",
  },
  description: {
    fontSize: 12,
    color: "#555",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  sizeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  sizeCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderColor: "#ddd",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  sizeText: {
    fontSize: 12,
    color: "#000",
  },
  colorRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  button: {
    backgroundColor: "rgb(0,28,105)",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
