import { useAuth } from "@/lib/autht-context";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
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

const Streaks = () => {
  const { signOut } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWishlist = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("QurioUser");
      if (!storedUser) {
        console.error("No user ID found in storage");
        return;
      }

      // fetch wishlist
      const wishlistRes = await fetch(
        `https://qurioans.onrender.com/qurioans/getwishlist/${storedUser}`
      );
      const wishlistData = await wishlistRes.json();

      // fetch cart
      const cartRes = await fetch(
        `https://qurioans.onrender.com/qurioans/getcart/${storedUser}`
      );
      const cartData = await cartRes.json();

      const cartIds =
        cartData?.cart?.items?.map((item) => item.product?._id) || [];

      if (wishlistData.wishlist && wishlistData.wishlist.products) {
        const formatted = wishlistData.wishlist.products
          // exclude items already in cart
          .filter((item) => !cartIds.includes(item._id))
          .map((item) => ({
            id: item._id,
            title: item.title,
            price: item.price,
            thumbnail: item.thumbnail,
            rating: item.rating || 0,
          }));

        setWishlistItems(formatted);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWishlist().finally(() => setRefreshing(false));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <TouchableOpacity style={styles.heart}>
        <AntDesign name="heart" size={20} color="#f55" />
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
        <AntDesign name="hearto" size={20} color="#ccc" />
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
      <View style={styles.header}>
        <TouchableOpacity
          style={{ width: "30%" }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="heart" size={18} color="red" />
          <Text style={styles.headerTitle}>My Wishlist</Text>
        </View>
      </View>

      <View style={styles.container}>
        <FlatList
          data={
            loading || refreshing ? Array.from({ length: 6 }) : wishlistItems
          }
          renderItem={loading || refreshing ? renderPlaceholder : renderItem}
          keyExtractor={(item, index) =>
            loading || refreshing ? index.toString() : item.id.toString()
          }
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            !loading && (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                Your wishlist is empty.
              </Text>
            )
          }
        />
      </View>
    </View>
  );
};

export default Streaks;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "rgb(0,20,77)",
    height: "15%",
    justifyContent: "center",
    paddingVertical: 16,
    alignItems: "center",
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    gap: 5,
  },
  headerTitleContainer: {
    alignItems: "center",
    gap: 3,
    width: "50%",
    flexDirection: "row",
    height: "100%",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
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
    padding: 14,
    marginBottom: 16,
    width: "47%",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    resizeMode: "cover",
  },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 4,
  },
  title: {
    fontWeight: "600",
    fontSize: 13,
    marginTop: 8,
    color: "rgb(0,20,77)",
    fontFamily: "sans-serif",
  },
  row: {
    flexDirection: "row",
    marginVertical: 4,
  },
  price: {
    fontWeight: "bold",
    color: "#0049b7",
    fontSize: 14,
  },
});
