import YouTubeHeader from "@/app/header";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

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

const deliveryOptions = [
  "Home Delivery",
  "Pick-up Station",
  "Doorstep Delivery",
  "Express Delivery",
  "All",
];

export default function EditProductScreen() {
  const route = useRoute();
  const { id } = route.params;
  const router = useRouter();
  const [showScrollRight, setShowScrollRight] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [images, setImages] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProduct().finally(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `https://qurioans.onrender.com/mobile/product/${id}`
      );
      const p = res.data.product;
      setForm({
        title: p.title,
        description: p.description,
        price: p.price?.toString(),
        stock: p.stock?.toString(),
        sku: p.sku,
        availabilityStatus: p.availabilityStatus || "In stock",
        minimumOrderQuantity: p.minimumOrderQuantity?.toString() || "1",
        category: p.category || "Others",
        meta: p.meta || {},
      });

      setThumbnail({ uri: p.thumbnail });
      setImages(p.images.map((url) => ({ uri: url })));
    } catch (err) {
      Alert.alert("Failed", "Could not load product.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleMetaChange = (key, value) => {
    setForm({ ...form, meta: { ...form.meta, [key]: value } });
  };
  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const pickNewImage = async () => {
    if (images.length >= 5) return Alert.alert("Limit", "Max 5 images allowed");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setImages([...images, asset]);
    }
  };

  const pickThumbnail = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setThumbnail(result.assets[0]);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    setLoadingForm(true);

    // 👇 Exclude 'meta', 'sku', and 'createdBy'
    for (let key in form) {
      if (
        key !== "meta" &&
        key !== "sku" &&
        key !== "createdBy" &&
        form[key] !== undefined &&
        form[key] !== "undefined"
      ) {
        formData.append(key, form[key]);
      }
    }

    // Meta
    formData.append("meta", JSON.stringify(form.meta));

    // Thumbnail (only if changed)
    if (thumbnail?.uri && !thumbnail.uri.startsWith("http")) {
      formData.append("thumbnail", {
        uri: thumbnail.uri,
        type: "image/jpeg",
        name: "thumbnail.jpg",
      });
    }

    // Gallery images (only local ones)
    images.forEach((img, i) => {
      if (!img.uri.startsWith("http")) {
        formData.append("images", {
          uri: img.uri,
          type: "image/jpeg",
          name: `img_${i}.jpg`,
        });
      }
    });

    try {
      await axios.put(
        `https://qurioans.onrender.com/mobile/editproduct/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Alert.alert("Success", "Product updated successfully!");
      router.back();
    } catch (err) {
      console.log("Full Axios Error:", err.response?.data || err);
      Alert.alert("Failed", "Could not update product.");
    } finally {
      setLoadingForm(false);
    }
  };

  const metaFields = categoryMetaFields[form.category] || [];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#d7dff3" }}>
      <YouTubeHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Edit Product</Text>

        {[
          "title",
          "description",
          "price",
          "stock",
          "sku",
          "availabilityStatus",
          "minimumOrderQuantity",
        ].map((field) => (
          <View key={field}>
            <Text style={styles.label}>{field.replace(/([A-Z])/g, " $1")}</Text>
            <TextInput
              style={[styles.input, field === "description" && { height: 80 }]}
              value={form[field]}
              onChangeText={(val) => handleInputChange(field, val)}
              multiline={field === "description"}
              keyboardType={
                ["price", "stock", "minimumOrderQuantity"].includes(field)
                  ? "numeric"
                  : "default"
              }
            />
          </View>
        ))}

        <Text style={styles.label}>Thumbnail</Text>
        {thumbnail?.uri && (
          <Image source={{ uri: thumbnail.uri }} style={styles.thumbnail} />
        )}
        <TouchableOpacity onPress={pickThumbnail} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Pick New Thumbnail</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Gallery Images</Text>
        <View style={{ height: 110, marginBottom: 10, position: "relative" }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={{
              paddingHorizontal: 10,
              alignItems: "center",
            }}
            onScroll={(e) => {
              const { contentOffset, layoutMeasurement, contentSize } =
                e.nativeEvent;
              const isScrolledToEnd =
                contentOffset.x + layoutMeasurement.width >=
                contentSize.width - 10;
              setShowScrollRight(!isScrolledToEnd);
            }}
            scrollEventThrottle={16}
          >
            {images.map((img, index) => (
              <View key={index} style={styles.imageWrap}>
                <Image source={{ uri: img.uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close" size={14} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {showScrollRight && (
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#003366"
              style={styles.scrollIcon}
              pointerEvents="none"
            />
          )}
        </View>

        <TouchableOpacity onPress={pickNewImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Add Image</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Meta Fields</Text>
        {metaFields.map((field) => (
          <View key={field} style={{ marginBottom: 10 }}>
            <Text style={styles.metaLabel}>{field}</Text>
            {field === "Delivery Options" ? (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.meta?.[field] || deliveryOptions[0]}
                  onValueChange={(value) => handleMetaChange(field, value)}
                  style={{ height: 45 }}
                >
                  {deliveryOptions.map((opt) => (
                    <Picker.Item key={opt} label={opt} value={opt} />
                  ))}
                </Picker>
              </View>
            ) : (
              <TextInput
                style={styles.input}
                value={
                  Array.isArray(form.meta?.[field])
                    ? form.meta[field].join(", ")
                    : form.meta?.[field] || ""
                }
                onChangeText={(text) =>
                  handleMetaChange(
                    field,
                    text.includes(",")
                      ? text.split(",").map((s) => s.trim())
                      : text.trim()
                  )
                }
              />
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.saveButton}>
          {loadingForm ? (
            <ActivityIndicator color="white" />
          ) : (
            <TouchableOpacity
              onPress={handleSave}
              className="w-full h-full flex-row justify-center items-center "
            >
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#001a41",
    marginBottom: 16,
    textAlign: "center",
  },
  label: { fontSize: 14, color: "#003366", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 12,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  thumbnail: { width: "100%", height: 200, borderRadius: 8, marginBottom: 10 },
  imageWrap: { position: "relative", marginRight: 10 },
  image: { width: 100, height: 100, borderRadius: 8 },
  removeBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  imageButton: {
    backgroundColor: "#003366",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  imageButtonText: { color: "#fff", fontWeight: "bold" },
  metaLabel: { fontSize: 13, color: "#555", marginBottom: 4 },
  pickerContainer: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#003366",
    height: 50,

    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  scrollHint: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 30,
    backgroundColor: "transparent",
    zIndex: 1,
    // iOS-only fade effect
    backgroundImage:
      "linear-gradient(to left, rgba(215, 223, 243, 1), rgba(215, 223, 243, 0))",
  },

  saveText: { color: "#fff", marginLeft: 8, fontWeight: "600", fontSize: 15 },
  scrollIcon: {
    position: "absolute",
    right: 6,
    top: 40,
    zIndex: 10,
    backgroundColor: "#d7dff3",
    borderRadius: 12,
    padding: 2,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
});
