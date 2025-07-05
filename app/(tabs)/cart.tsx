import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Velcro Ballerinas",
      price: 1999,
      size: "7.5",
      color: "Yellow",
      qty: 1,
      image:
        "https://i.pinimg.com/736x/fd/a9/c8/fda9c834c8d64a676b9c3d7b23b8924b.jpg",
    },
    {
      id: 2,
      name: "Green Hand Bag",
      price: 999,
      size: "Small",
      color: "Green",
      qty: 1,
      image:
        "https://i.pinimg.com/736x/be/f7/6c/bef76c87b16449b7e527700ffb14c0f4.jpg",
    },
    {
      id: 3,
      name: "Pink Sweater",
      price: 1669,
      size: "L",
      color: "Pink",
      qty: 1,
      image:
        "https://i.pinimg.com/736x/8d/73/10/8d73101ed63883ba2391c8a65f61b2c0.jpg",
    },
    {
      id: 4,
      name: "Fresh Bananas",
      price: 500,
      size: "1 Bunch",
      color: "Yellow",
      qty: 1,
      image:
        "https://i.pinimg.com/736x/35/78/b5/3578b5433d9d035e38fb64c5306aa919.jpg",
    },
    {
      id: 5,
      name: "Red Apples",
      price: 750,
      size: "1kg",
      color: "Red",
      qty: 1,
      image:
        "https://i.pinimg.com/736x/46/26/7d/46267d396aaa18c063d2e52b78d92e4b.jpg",
    },
    {
      id: 6,
      name: "Orange Juice",
      price: 1200,
      size: "1L",
      color: "Orange",
      qty: 1,
      image:
        "https://i.pinimg.com/736x/1d/85/66/1d856623b2d1ee0d53394b6cb0c84a54.jpg",
    },
    {
      id: 7,
      name: "Chicken Burger",
      price: 1500,
      size: "Regular",
      color: "Brown",
      qty: 1,
      image:
        "https://i.pinimg.com/736x/cf/e5/54/cfe554079b93ca2da42ab6d7a991188d.jpg",
    },
    {
      id: 8,
      name: "Pizza Slice",
      price: 1800,
      size: "Large",
      color: "Mixed",
      qty: 1,
      image:
        "https://i.pinimg.com/736x/3e/c9/fe/3ec9fe32c6217014789b5f42e2343f47.jpg",
    },
    {
      id: 9,
      name: "Yoghurt Cup",
      price: 600,
      size: "250ml",
      color: "White",
      qty: 1,
      image:
        "https://i.pinimg.com/736x/c4/6a/07/c46a07bf5948a3ed165f438a63fe6284.jpg",
    },
    {
      id: 10,
      name: "French Fries",
      price: 800,
      size: "Medium",
      color: "Yellow",
      qty: 1,
      image:
        "https://i.pinimg.com/736x/99/63/a9/9963a9c7f1ad8dafe064228394f0de54.jpg",
    },
  ]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = 399;
  const delivery = 0;
  const subTotal = total - discount + delivery;

  const screenHeight = Dimensions.get("window").height;

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(215,223,243)" }}>
      <View
        style={{
          backgroundColor: "rgb(0,20,77)",
          height: "15%",
          alignContent: "center",
          justifyContent: "center",
          paddingVertical: 10,
          alignItems: "center",
          paddingTop: 40,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          overflow: "hidden",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <Ionicons name="cart-sharp" size={20} color="white" />

        <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
          Cart
        </Text>
      </View>

      {/* Cart items + summary */}
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
                <TouchableOpacity>
                  <Text style={{ fontSize: 18, color: "grey" }}>-</Text>
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 8 }}>{item.qty}</Text>
                <TouchableOpacity>
                  <Text style={{ fontSize: 18, color: "rgb(116,98,255)" }}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Continue button moved up by ~15vh */}
      <View
        style={{
          alignSelf: "center",
          width: "90%",
          backgroundColor: "white",
          marginTop: 10,
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          marginBottom: screenHeight * 0.15, // pushes it up by ~15vh
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        {/* Summary */}

        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            paddingBlockStart: 10,
            paddingBlockEnd: 10,
            gap: 3,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: 13,
              }}
            >
              Total
            </Text>
            <Text
              style={{
                fontSize: 13,
              }}
            >
              ₦ {total}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: 13,
              }}
            >
              Discount
            </Text>
            <Text>₦ {discount}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: 13,
              }}
            >
              Delivery fee
            </Text>
            <Text
              style={{
                fontSize: 13,
              }}
            >
              ₦ {delivery}
            </Text>
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
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "normal",
            }}
          >
            Continue (₦ {subTotal})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;
