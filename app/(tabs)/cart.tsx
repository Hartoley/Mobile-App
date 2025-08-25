import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Constants from "expo-constants";
import { WebView } from "react-native-webview";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Alert,
  Modal,
} from "react-native";

const CartScreen = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storedUser, setStoredUser] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const isExpoGo = Constants.appOwnership === "expo";
  const [showWebView, setShowWebView] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");

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

  const fetchCart = async (userId: string) => {
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

  const updateCartItemQty = async (productId: string, action: string) => {
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
      if (storedUser) fetchCart(storedUser);
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const deleteCartItem = async (productId: string) => {
    try {
      const response = await fetch(
        `https://qurioans.onrender.com/qurioans/remove-from-cart/${storedUser}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
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

      if (storedUser) fetchCart(storedUser);
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = 0;
  const delivery = 0;
  const subTotal = total - discount + delivery;

  const onRefresh = () => {
    if (storedUser) fetchCart(storedUser);
  };

  const handlePayment = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("QurioUser");
      const storedUserEmail = await AsyncStorage.getItem("QurioUserEmail");
      const storedUserName = await AsyncStorage.getItem("QurioUserName");

      if (!storedUserId || !storedUserEmail || !storedUserName) {
        Alert.alert("User info missing", "Please login again.");
        return;
      }

      const txRef = `qurio_${Date.now()}`;
      const logoUrl = "https://qurioans.onrender.com/images/flipzy.png";

      const flutterwaveUrl = `https://checkout.flutterwave.com/v3/hosted/pay?public_key=FLWPUBK_TEST-45d26f9315fd37752c266b29ba8e67fe-X&tx_ref=${txRef}&amount=${subTotal}&currency=NGN&payment_options=card,ussd,banktransfer,qr,mobilemoney&customer[email]=${encodeURIComponent(
        storedUserEmail
      )}&customer[name]=${encodeURIComponent(
        storedUserName
      )}&customizations[title]=Qurioans Payment&customizations[description]=Payment for your order&customizations[logo]=${encodeURIComponent(
        logoUrl
      )}&redirect_url=${encodeURIComponent(
        `https://qurioans.onrender.com/qurioans/payment/callback?userId=${storedUserId}&tx_ref=${txRef}`
      )}`;

      setCheckoutUrl(flutterwaveUrl);
      setShowWebView(true);
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert(
        "Payment failed",
        "Unable to initiate payment. Please try again."
      );
    }
  };

  const handleWebViewNavigationStateChange = async (navState) => {
    const { url } = navState;

    if (url.includes("/payment/callback")) {
      setShowWebView(false);

      try {
        const urlObj = new URL(url);
        const tx_ref = urlObj.searchParams.get("tx_ref");
        const userId = urlObj.searchParams.get("userId");

        if (!tx_ref || !userId) {
          console.warn("Missing tx_ref or userId in callback URL");
          return;
        }

        const response = await fetch(
          `https://qurioans.onrender.com/qurioans/payment/callback?tx_ref=${tx_ref}&userId=${userId}`,
          { method: "GET" }
        );
        const data = await response.json();

        if (data.error) {
          Alert.alert("Payment verification failed", data.error);
        } else {
          navigation.navigate("OrderSuccess", { orderId: data.orderId });
        }
      } catch (backendError) {
        console.error("Backend verification error:", backendError);
        Alert.alert(
          "Verification Error",
          "Error verifying payment. Please try again."
        );
      }
    }
  };

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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["rgb(0,20,77)"]}
              tintColor="rgb(0,20,77)"
            />
          }
        >
          <View>
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
                  <TouchableOpacity onPress={() => deleteCartItem(item.id)}>
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
          </View>
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
            <Text style={{ fontSize: 13 }}>₦ {discount}</Text>
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
        {/* Modal for Flutterwave Payment */}
        <Modal visible={showWebView} animationType="slide">
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 60,
                backgroundColor: "rgb(0,20,77)",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
              >
                Payment
              </Text>
              <TouchableOpacity onPress={() => setShowWebView(false)}>
                <Text style={{ color: "white", fontSize: 16 }}>Close</Text>
              </TouchableOpacity>
            </View>

            <WebView
              source={{ uri: checkoutUrl }}
              startInLoadingState
              javaScriptEnabled={true}
              domStorageEnabled={true}
              originWhitelist={["*"]}
              renderLoading={() => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator size="large" color="#000" />
                  <Text>Loading payment page...</Text>
                </View>
              )}
              onNavigationStateChange={handleWebViewNavigationStateChange}
            />
          </View>
        </Modal>

        <TouchableOpacity
          onPress={handlePayment}
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
