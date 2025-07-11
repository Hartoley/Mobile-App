import YouTubeHeader from "@/app/header";
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

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [images, setImages] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

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
      allowsMultipleSelection: false,
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

    for (let key in form) {
      if (key !== "meta") {
        formData.append(key, form[key]);
      }
    }

    formData.append("meta", JSON.stringify(form.meta));

    if (thumbnail && thumbnail.uri) {
      formData.append("thumbnail", {
        uri: thumbnail.uri,
        type: "image/jpeg",
        name: "thumbnail.jpg",
      });
    }

    images.forEach((img, i) => {
      if (img.uri?.startsWith("http")) return; // skip already uploaded
      formData.append("images", {
        uri: img.uri,
        type: "image/jpeg",
        name: `img_${i}.jpg`,
      });
    });

    try {
      await axios.put(
        `https://qurioans.onrender.com/mobile/product/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      Alert.alert("Success", "Product updated successfully!");
      router.back();
    } catch (err) {
      console.log(err.response?.data || err);
      Alert.alert("Failed", "Could not update product.");
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
      <ScrollView style={styles.container}>
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
        <ScrollView horizontal style={{ marginBottom: 15 }}>
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
        <TouchableOpacity onPress={pickNewImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Add Image</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Meta Fields</Text>
        {metaFields.map((field) => (
          <View key={field} style={{ marginBottom: 10 }}>
            <Text style={styles.metaLabel}>{field}</Text>
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
          </View>
        ))}

        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 16 },
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
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#003366",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  saveText: { color: "#fff", marginLeft: 8, fontWeight: "600", fontSize: 15 },
});
