import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const categoryMetaFields = {
  All: [
    "Brand",
    "Condition",
    "Location",
    "Seller Type",
    "Warranty",
    "Delivery Options",
  ],
  Electronics: [
    "Brand",
    "Model",
    "Warranty",
    "Condition",
    "Features",
    "Delivery Options",
  ],
  Books: [
    "Author",
    "Publisher",
    "ISBN",
    "Edition",
    "Condition",
    "Language",
    "Delivery Options",
  ],
  Clothing: [
    "Brand",
    "Size",
    "Color",
    "Material",
    "Condition",
    "Fit Type",
    "Delivery Options",
  ],
  Food: [
    "Brand",
    "Ingredients",
    "Expiry Date",
    "Weight",
    "Packaging Type",
    "Dietary Info",
    "Delivery Options",
  ],
  Hostel: [
    "Name",
    "Type",
    "Number of Beds",
    "Facilities",
    "Location",
    "Availability",
  ],
  Transport: ["Type", "Brand", "Model", "Year", "Condition", "Mileage"],
  Used: [
    "Category",
    "Brand",
    "Condition",
    "Usage Duration",
    "Reason for Selling",
    "Warranty",
  ],
  Freelance: [
    "Service Type",
    "Experience",
    "Delivery Time",
    "Revision Policy",
    "Pricing Model",
    "Availability",
  ],
  Bags: [
    "Brand",
    "Material",
    "Type",
    "Color",
    "Condition",
    "Size",
    "Delivery Options",
  ],
  Shoes: [
    "Brand",
    "Size",
    "Material",
    "Color",
    "Condition",
    "Style",
    "Delivery Options",
  ],
  Watch: [
    "Brand",
    "Model",
    "Warranty",
    "Condition",
    "Features",
    "Water Resistance",
    "Delivery Options",
  ],
  New: ["Brand", "Model", "Warranty", "Features", "Color", "Availability"],
  Men: [
    "Category",
    "Brand",
    "Size",
    "Color",
    "Material",
    "Condition",
    "Delivery Options",
  ],
  Women: [
    "Category",
    "Brand",
    "Size",
    "Color",
    "Material",
    "Condition",
    "Delivery Options",
  ],
  Beauty: [
    "Brand",
    "Type",
    "Expiry Date",
    "Ingredients",
    "Skin Type",
    "Packaging",
    "Delivery Options",
  ],
  Fashion: [
    "Category",
    "Brand",
    "Size",
    "Color",
    "Material",
    "Style",
    "Delivery Options",
  ],
  Health: [
    "Brand",
    "Type",
    "Expiry Date",
    "Ingredients",
    "Dosage",
    "Packaging",
    "Delivery Options",
  ],
  Home: [
    "Category",
    "Brand",
    "Material",
    "Color",
    "Dimensions",
    "Condition",
    "Delivery Options",
  ],
  Lifestyle: [
    "Category",
    "Type",
    "Brand",
    "Material",
    "Features",
    "Condition",
    "Delivery Options",
  ],
  Sports: [
    "Type",
    "Brand",
    "Size",
    "Condition",
    "Material",
    "Usage",
    "Delivery Options",
  ],
  Kids: [
    "Category",
    "Brand",
    "Age Range",
    "Size",
    "Color",
    "Condition",
    "Delivery Options",
  ],
  Pets: [
    "Type",
    "Brand",
    "Expiry Date",
    "Ingredients",
    "Weight",
    "Packaging",
    "Delivery Options",
  ],
  Others: [
    "Category",
    "Brand",
    "Condition",
    "Details",
    "Availability",
    "Location",
    "Delivery Options",
  ],
};

export default function ProductDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    fetch(`https://qurioans.onrender.com/mobile/product/${id}`)
      .then((res) => res.json())
      .then((res) => setProduct(res.product))
      .catch(console.error);
  }, [id]);

  const [storedUser, setStoredUser] = useState("");

  useEffect(() => {
    const fetchStoredUser = async () => {
      const userId = await AsyncStorage.getItem("QurioUser");
      if (userId) {
        setStoredUser(userId);
      }
    };

    fetchStoredUser();
  }, []);

  useEffect(() => {
    if (product) {
      checkIfInCart();
      checkIfInWishlist();
    }
  }, [product]);

  const checkIfInWishlist = async () => {
    try {
      const userId = storedUser;

      const response = await fetch(
        `https://qurioans.onrender.com/qurioans/getwishlist/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        return;
      }

      if (!data.wishlist || !data.wishlist.products) {
        console.log("No wishlist found in response");
        setIsInWishlist(false);
        return;
      }

      const found = data.wishlist.products.find(
        (product) => product._id === id
      );

      setIsInWishlist(!!found);
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  const checkIfInCart = async () => {
    try {
      const userId = storedUser;

      const response = await fetch(
        `https://qurioans.onrender.com/qurioans/getcart/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        return;
      }

      if (!data.cart) {
        console.log("No cart found in response");
        setIsInCart(false);
        return;
      }

      const found = data.cart.items.find((item) => item.product._id === id);

      setIsInCart(!!found);

      setIsInCart(!!found);
    } catch (error) {
      console.error("Error checking cart:", error);
    }
  };

  const toggleWishlist = async () => {
    console.log("I'm clicked");

    try {
      const userId = storedUser;

      const response = await fetch(
        `https://qurioans.onrender.com/qurioans/togglewishlist/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: product._id }),
        }
      );

      const data = await response.json();
      // console.log(data.message);
      checkIfInWishlist();
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const addToCart = async () => {
    try {
      setAddingToCart(true);

      const userId = storedUser; // replace with your auth userId

      const response = await fetch(
        `https://qurioans.onrender.com/qurioans/update-cart/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: id,
            quantity: 1,
            action: "add",
          }),
        }
      );

      const data = await response.json();
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  const renderMeta = () => {
    if (!product.meta || !product.category) return null;

    const allowed =
      categoryMetaFields[product.category] || categoryMetaFields["All"];

    return (
      <>
        {Object.entries(product.meta).map(([key, value], idx) => {
          if (!allowed.includes(key)) return null;

          if (key.toLowerCase() === "color" && Array.isArray(value)) {
            return (
              <View key={idx} style={{ marginTop: 6 }}>
                <Text style={styles.description}>Color:</Text>
                <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
                  {value.map((clr, i) => (
                    <View
                      key={i}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: clr,
                        borderWidth: 1,
                        borderColor: "#ccc",
                      }}
                    />
                  ))}
                </View>
              </View>
            );
          }

          return (
            <Text key={idx} style={styles.description}>
              {key}: {Array.isArray(value) ? value.join(", ") : value}
            </Text>
          );
        })}
      </>
    );
  };

  if (!product) return <Text style={{ padding: 20 }}>Loading...</Text>;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>STYLLA FASHION</Text>
        <TouchableOpacity onPress={toggleWishlist}>
          <AntDesign
            name={isInWishlist ? "heart" : "hearto"}
            size={20}
            color="#f44"
          />
        </TouchableOpacity>
      </View>

      {/* Image Carousel */}
      <View style={styles.imageWrapper}>
        <FlatList
          data={product.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={flatListRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.image} />
          )}
        />
        <View style={styles.dots}>
          {product.images?.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index && {
                  backgroundColor: "rgb(0,28,105)",
                  width: 10,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>₦ {product.price}</Text>
        </View>

        {/* Rating */}
        <View style={{ flexDirection: "row", marginBottom: 6 }}>
          {[...Array(5)].map((_, i) => (
            <AntDesign
              key={i}
              name={i < Math.round(product.rating || 0) ? "star" : "staro"}
              size={14}
              color="#FFC107"
            />
          ))}
        </View>

        {/* Seller Info */}
        <View style={styles.sellerRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{
                uri: "https://i.pinimg.com/736x/e6/d8/00/e6d8009373c9625e7d80965dc8f842fa.jpg",
              }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                Jenny Doe
              </Text>
              <Text style={{ fontSize: 12, color: "grey" }}>Seller</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialIcons name="chat" size={20} color="rgb(0,20,77)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Feather name="phone" size={20} color="rgb(0,20,77)" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <Text style={[styles.tabText, { color: "rgb(0,28,105)" }]}>
            Details
          </Text>
          <TouchableOpacity onPress={() => setReviewModal(true)}>
            <Text style={styles.tabText}>Review</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{product.description}</Text>

        {showMore && (
          <>
            <Text style={styles.description}>Category: {product.category}</Text>
            <Text style={styles.description}>Brand: {product.brand}</Text>
            <Text style={styles.description}>Stock: {product.stock}</Text>
            <Text style={styles.description}>
              Availability: {product.availabilityStatus}
            </Text>
            <Text style={styles.description}>SKU: {product.sku}</Text>
            <Text style={styles.description}>Weight: {product.weight} kg</Text>
            {/* <Text style={styles.description}>
              Dimensions:{" "}
              {product.dimensions
                ? `${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth}`
                : "N/A"}
            </Text> */}
            <Text style={styles.description}>
              Warranty: {product.warrantyInformation}
            </Text>
            <Text style={styles.description}>
              Shipping: {product.shippingInformation}
            </Text>
            <Text style={styles.description}>
              Return Policy: {product.returnPolicy}
            </Text>
            <Text style={styles.description}>
              Min. Order: {product.minimumOrderQuantity}
            </Text>

            {renderMeta()}
          </>
        )}

        <TouchableOpacity onPress={() => setShowMore(!showMore)}>
          <Text style={styles.seeMore}>
            {showMore ? "Show Less ▲" : "See More ▼"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={addToCart}
          disabled={addingToCart}
        >
          {isInCart ? (
            <Text style={styles.buttonText}>Added to cart</Text>
          ) : (
            <Text style={styles.buttonText}>
              {addingToCart ? "Adding..." : "Add to Cart"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Review Modal */}
      <Modal visible={reviewModal} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.reviewTitle}>Customer Reviews</Text>
          {product.reviews?.map((rev, i) => (
            <View key={i} style={styles.reviewBox}>
              <Text style={styles.reviewer}>
                {rev.reviewerName || "Anonymous"}
              </Text>
              <Text style={styles.comment}>"{rev.comment}"</Text>
              <View style={styles.rating}>
                {[...Array(5)].map((_, j) => (
                  <AntDesign
                    key={j}
                    name={j < rev.rating ? "star" : "staro"}
                    size={12}
                    color="#FFC107"
                  />
                ))}
              </View>
            </View>
          ))}
          <TouchableOpacity
            onPress={() => setReviewModal(false)}
            style={styles.modalClose}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgb(215,223,243)", paddingTop: 40 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 8,
  },
  headerText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgb(0,28,105)",
  },
  imageWrapper: {
    alignItems: "center",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginHorizontal: 16,
  },
  image: {
    width: width - 32,
    height: 280,
    resizeMode: "cover",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 10,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: "#ccc",
    borderRadius: 4,
  },
  content: {
    paddingHorizontal: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgb(0,28,105)",
  },
  tabRow: {
    flexDirection: "row",
    gap: 24,
    marginVertical: 10,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },
  description: {
    fontSize: 12,
    color: "#444",
    lineHeight: 18,
    marginBottom: 4,
  },
  seeMore: {
    fontSize: 12,
    color: "#0055cc",
    marginBottom: 20,
    textAlign: "right",
  },
  button: {
    backgroundColor: "rgb(0,28,105)",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 60,
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  sellerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconBtn: {
    backgroundColor: "rgb(112,167,245)",
    padding: 8,
    borderRadius: 20,
  },
  modal: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    color: "rgb(0,28,105)",
  },
  reviewBox: {
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
  },
  reviewer: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  comment: {
    fontSize: 12,
    color: "#333",
    marginBottom: 6,
  },
  rating: {
    flexDirection: "row",
  },
  modalClose: {
    marginTop: 20,
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 13,
    color: "#0055cc",
  },
});
