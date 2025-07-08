import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

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

const deliveryOptions = [
  "Home Delivery",
  "Pick-up Station",
  "Doorstep Delivery",
  "Express Delivery",
  "All",
];

const ProductUploadScreen = ({}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [meta, setMeta] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const fields = categoryMetaFields[category] || [];
    const defaultMeta = fields.map((field) => ({
      key: field,
      value: [],
      temp: "",
    }));
    setMeta(defaultMeta);
  }, [category]);

  const pickThumbnail = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) setThumbnail(result.assets[0]);
  };

  const pickImages = async () => {
    if (images.length >= 5) {
      Alert.alert("Limit reached", "You can upload maximum 5 images");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      const newImgs = result.assets.slice(0, 5 - images.length);
      setImages([...images, ...newImgs]);
    }
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const addMetaOption = (index) => {
    const updated = [...meta];
    const option = updated[index].temp.trim();
    if (option && !updated[index].value.includes(option)) {
      updated[index].value.push(option);
      updated[index].temp = "";
      setMeta(updated);
    }
  };

  const removeMetaOption = (metaIndex, optionIndex) => {
    const updated = [...meta];
    updated[metaIndex].value.splice(optionIndex, 1);
    setMeta(updated);
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!description.trim()) errs.description = "Description is required";
    if (!price) errs.price = "Price is required";
    else if (isNaN(price)) errs.price = "Price must be a number";
    if (!thumbnail) errs.thumbnail = "Thumbnail is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("createdBy", "68460be2acf270418acdf715");

      if (thumbnail) {
        formData.append("thumbnail", {
          uri: thumbnail.uri,
          name: "thumbnail.jpg",
          type: "image/jpeg",
        });
      }

      images.forEach((image, index) => {
        formData.append("images", {
          uri: image.uri,
          name: `image_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      const metaData = {};
      meta.forEach((field) => {
        if (field.value.length > 0) metaData[field.key] = field.value;
      });
      formData.append("meta", JSON.stringify(metaData));

      const response = await axios.post(
        "https://qurioans.onrender.com/mobile/products",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      Alert.alert("Success", response.data.message || "Product uploaded!");
      clearForm();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.message ||
          "Failed to upload product"
      );
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setThumbnail(null);
    setImages([]);
    const fields = categoryMetaFields[category] || [];
    setMeta(fields.map((field) => ({ key: field, value: [], temp: "" })));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Product</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={title}
              onChangeText={setTitle}
              placeholder="Product Title"
              placeholderTextColor="#999"
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}

            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.description && styles.inputError,
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}

            <TextInput
              style={[styles.input, errors.price && styles.inputError]}
              value={price}
              onChangeText={setPrice}
              placeholder="Price"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            {errors.price && (
              <Text style={styles.errorText}>{errors.price}</Text>
            )}

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={setCategory}
                dropdownIconColor="#555"
                style={styles.picker}
              >
                {Object.keys(categoryMetaFields).map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Media</Text>

            <TouchableOpacity
              style={[
                styles.uploadButton,
                errors.thumbnail && styles.inputError,
              ]}
              onPress={pickThumbnail}
            >
              <Text style={styles.buttonText}>
                {thumbnail ? "Change Thumbnail" : "Select Thumbnail"}
              </Text>
            </TouchableOpacity>
            {thumbnail && (
              <Image
                source={{ uri: thumbnail.uri }}
                style={styles.thumbnailPreview}
              />
            )}
            {errors.thumbnail && (
              <Text style={styles.errorText}>{errors.thumbnail}</Text>
            )}

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickImages}
              disabled={images.length >= 5}
            >
              <Text style={styles.buttonText}>
                Add Images ({images.length}/5)
              </Text>
            </TouchableOpacity>

            {images.length > 0 && (
              <ScrollView horizontal style={styles.galleryContainer}>
                {images.map((img, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image
                      source={{ uri: img.uri }}
                      style={styles.galleryImage}
                    />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close" size={12} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          {meta.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Product Specifications</Text>
              {meta.map((item, index) => (
                <View key={index} style={styles.metaRow}>
                  <Text style={styles.metaLabel}>{item.key}</Text>

                  {item.key === "Delivery Options" ? (
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={item.value[0] || ""}
                        onValueChange={(value) => {
                          const updated = [...meta];
                          updated[index].value = [value];
                          setMeta(updated);
                        }}
                        dropdownIconColor="#555"
                        style={styles.picker}
                      >
                        <Picker.Item label="Select delivery option" value="" />
                        {deliveryOptions.map((opt, i) => (
                          <Picker.Item key={i} label={opt} value={opt} />
                        ))}
                      </Picker>
                    </View>
                  ) : (
                    <>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <TextInput
                          style={[styles.input, { flex: 1 }]}
                          value={item.temp}
                          onChangeText={(text) => {
                            const updated = [...meta];
                            updated[index].temp = text;
                            setMeta(updated);
                          }}
                          placeholder={`Add ${item.key.toLowerCase()} option`}
                          placeholderTextColor="#999"
                        />
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={() => addMetaOption(index)}
                        >
                          <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          marginTop: 5,
                        }}
                      >
                        {item.value.map((v, i) => (
                          <View key={i} style={styles.optionBadge}>
                            <Text>{v}</Text>
                            <TouchableOpacity
                              onPress={() => removeMetaOption(index, i)}
                            >
                              <Ionicons name="close" size={12} color="#555" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    </>
                  )}
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>List Product</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(215,223,243)",
    paddingBottom: 50,
  },
  flex: { flex: 1 },
  scrollContent: { paddingBottom: 30 },
  header: {
    backgroundColor: "#001a41",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: { marginRight: 15 },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600" },
  section: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    margin: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  label: { fontSize: 14, color: "#444", marginBottom: 8, fontWeight: "500" },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 15,
  },
  inputError: { borderColor: "#ff4444", backgroundColor: "#fff5f5" },
  textArea: { height: 100, textAlignVertical: "top" },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 15 },
  priceContainer: { flex: 1 },
  categoryContainer: { flex: 1 },
  pickerContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  picker: { height: 50 },
  uploadButton: {
    backgroundColor: "#f0f2f5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  buttonText: { color: "#333", fontWeight: "500" },
  thumbnailPreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  galleryContainer: { marginBottom: 15 },
  imageWrapper: { position: "relative", marginRight: 10 },
  galleryImage: { width: 100, height: 100, borderRadius: 8 },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  metaRow: { marginBottom: 15 },
  metaLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: { color: "white", fontWeight: "600" },
  optionBadge: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 5,
    marginBottom: 5,
  },
  submitButton: {
    backgroundColor: "#003366",
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});

export default ProductUploadScreen;
