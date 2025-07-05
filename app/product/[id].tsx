import { AntDesign } from "@expo/vector-icons";
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

export default function ProductDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const [product, setProduct] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then(setProduct)
      .catch(console.error);
  }, [id]);

  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  if (!product) return <Text style={{ padding: 20 }}>Loading...</Text>;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="rgb(0,28,105)" />
        </TouchableOpacity>
        <Text style={styles.headerText}>STYLLA FASHION</Text>
        <AntDesign name="hearto" size={20} color="#f44" />
      </View>

      {/* Image Carousel */}
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

      {/* Dot Indicators */}
      <View style={styles.dots}>
        {product.images.map((_, index) => (
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

      {/* Details Scroll */}
      <ScrollView style={styles.content}>
        {/* Title & Price */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>₦ {product.price}</Text>
        </View>

        {/* Rating */}
        <View style={{ flexDirection: "row", marginBottom: 6 }}>
          {[...Array(5)].map((_, i) => (
            <AntDesign
              key={i}
              name={i < Math.round(product.rating) ? "star" : "staro"}
              size={14}
              color="#FFC107"
            />
          ))}
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

        {/* Description & Expanded Details */}
        <Text style={styles.description}>
          {showMore
            ? `${product.description}\n\nBrand: ${product.brand}\nCategory: ${
                product.category
              }\nStock: ${product.stock}\nAvailability: ${
                product.availabilityStatus ?? "In stock"
              }\nSKU: ${product.sku ?? "N/A"}\nWeight: ${
                product.weight ?? "N/A"
              }kg\nWarranty: ${
                product.warrantyInformation ?? "N/A"
              }\nShipping: ${
                product.shippingInformation ?? "Ships fast"
              }\nReturn Policy: ${product.returnPolicy ?? "Standard"}`
            : `${product.description.slice(0, 120)}...`}
        </Text>

        {/* Show More Toggle */}
        <TouchableOpacity onPress={() => setShowMore(!showMore)}>
          <Text style={styles.seeMore}>
            {showMore ? "Show Less ▲" : "See More ▼"}
          </Text>
        </TouchableOpacity>

        {/* Add to Cart */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Review Modal */}
      <Modal visible={reviewModal} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.reviewTitle}>Customer Reviews</Text>
          {product.reviews?.map((rev, i) => (
            <View key={i} style={styles.reviewBox}>
              <Text style={styles.reviewer}>{rev.reviewerName}</Text>
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
  container: {
    flex: 1,
    backgroundColor: "rgb(215,223,243)",
    paddingTop: 40,
  },
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
  image: {
    width: width,
    height: 260,
    resizeMode: "contain",
    backgroundColor: "#fff",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
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
    marginBottom: 4,
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
    marginBottom: 12,
    lineHeight: 18,
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
