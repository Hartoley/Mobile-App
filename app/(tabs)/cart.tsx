import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CartScreen = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storedUser, setStoredUser] = useState("");

  const userId = storedUser; // replace with your auth logic

  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    const init = async () => {
      const userId = await AsyncStorage.getItem("QurioUser");
      if (userId) {
        setStoredUser(userId);
        fetchCart(userId);
      } else {
        console.log("No stored user found.");
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchCart = async (userId) => {
    try {
      const response = await fetch(
        `https://qurioans.onrender.com/qurioans/getcart/${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Failed to parse JSON:", text);
        return;
      }

      if (data.cart && data.cart.items) {
        const formatted = data.cart.items.map((item) => ({
          id: item.product._id,
          name: item.product.title,
          price: item.product.price,
          image: item.product.thumbnail,
          qty: item.quantity,
          size: "Default",
          color: "Default",
        }));
        setCartItems(formatted);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateCartItemQty = async (productId, action) => {
    try {
      const response = await fetch(
        `https://qurioans.onrender.com/qurioans/update-cart/${storedUser}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, action }),
        }
      );

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Failed to parse JSON:", text);
        return;
      }
      fetchCart();
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = 0;
  const delivery = 0;
  const subTotal = total - discount + delivery;

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(215,223,243)" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "rgb(0,20,77)",
          height: "15%",
          justifyContent: "center",
          paddingVertical: 10,
          alignItems: "center",
          paddingTop: 40,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          flexDirection: "row",
          gap: 10,
        }}
      >
        <TouchableOpacity
          className=" w-[30%]"
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <View className="items-center gap-3 w-[50%] flex-row h-full">
          <Ionicons name="cart-sharp" size={20} color="white" />
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
            Cart
          </Text>
        </View>
      </View>

      {/* Loader or Empty Skeleton */}
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="rgb(0,20,77)" />
        </View>
      ) : cartItems.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Your cart is empty.</Text>
        </View>
      ) : (
        <ScrollView
          style={{ padding: 16, maxHeight: screenHeight * 0.85 }}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {cartItems.map((item) => (
            <View
              key={item.id}
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
                padding: 10,
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  marginRight: 10,
                }}
              />

              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    color: "rgb(116,98,255)",
                    fontWeight: "bold",
                    fontSize: 12,
                  }}
                >
                  ₦ {item.price}
                </Text>
                <Text style={{ fontSize: 12 }}>Size: {item.size}</Text>
                <Text style={{ fontSize: 12 }}>Color: {item.color}</Text>
              </View>

              <View style={{ alignItems: "center" }}>
                <TouchableOpacity>
                  <Feather name="trash-2" size={20} color="grey" />
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 20,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => updateCartItemQty(item.id, "minus")}
                  >
                    <Text style={{ fontSize: 18, color: "red" }}>-</Text>
                  </TouchableOpacity>

                  <Text style={{ marginHorizontal: 8 }}>{item.qty}</Text>

                  <TouchableOpacity
                    onPress={() => updateCartItemQty(item.id, "add")}
                  >
                    <Text style={{ fontSize: 18, color: "rgb(116,98,255)" }}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Summary and Continue */}
      <View
        style={{
          alignSelf: "center",
          width: "90%",
          backgroundColor: "white",
          marginTop: 10,
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          marginBottom: screenHeight * 0.15,
          borderRadius: 20,
        }}
      >
        <View style={{ gap: 3 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 13 }}>Total</Text>
            <Text style={{ fontSize: 13 }}>₦ {total}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 13 }}>Discount</Text>
            <Text>₦ {discount}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 13 }}>Delivery fee</Text>
            <Text style={{ fontSize: 13 }}>₦ {delivery}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 13 }}>Sub Total</Text>
            <Text style={{ fontWeight: "bold", fontSize: 13 }}>
              ₦ {subTotal}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "rgb(0,20,77)",
            borderRadius: 10,
            alignItems: "center",
            width: "60%",
            height: 50,
            justifyContent: "center",
            alignSelf: "flex-end",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "white", fontSize: 13 }}>
            Continue (₦ {subTotal})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;
