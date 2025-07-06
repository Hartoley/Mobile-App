import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Category-specific meta field templates
const categoryMetaFields = {
  Electronics: ["Brand", "Model", "Warranty"],
  Books: ["Author", "Publisher", "ISBN"],
  Clothing: ["Size", "Color", "Material"],
  Food: ["Ingredients", "Expiry Date"],
  Others: [],
};

const categories = Object.keys(categoryMetaFields);

export default function UploadProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [meta, setMeta] = useState(
    categoryMetaFields[category].map((field) => ({ key: field, value: "" }))
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const pickImage = async (isThumbnail = false) => {
    if (!isThumbnail && images.length >= 5) {
      return alert("Max 5 images allowed");
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: !isThumbnail,
      quality: 1,
    });

    if (!result.canceled) {
      if (isThumbnail) {
        setThumbnail(result.assets[0]);
      } else {
        setImages([...images, ...result.assets.slice(0, 5 - images.length)]);
      }
    }
  };

  const handleCategoryChange = (text) => {
    setCategory(text);
    const fields = categoryMetaFields[text] || [];
    const defaultMeta = fields.map((field) => ({ key: field, value: "" }));
    setMeta(defaultMeta);
  };

  const validate = () => {
    const errs = {};
    if (!title) errs.title = "Title is required";
    if (!description) errs.description = "Description is required";
    if (!price) errs.price = "Price is required";
    else if (isNaN(price)) errs.price = "Price must be a number";
    if (!thumbnail) errs.thumbnail = "Thumbnail is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpload = async () => {
    if (!validate()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("createdBy", "YOUR_ADMIN_ID"); // Replace accordingly

    formData.append("thumbnail", {
      uri: thumbnail.uri,
      type: "image/jpeg",
      name: "thumbnail.jpg",
    });

    images.forEach((img, index) => {
      formData.append("images", {
        uri: img.uri,
        type: "image/jpeg",
        name: `image${index + 1}.jpg`,
      });
    });

    const metaObj = meta.reduce((acc, curr) => {
      if (curr.key && curr.value) acc[curr.key] = curr.value;
      return acc;
    }, {});
    formData.append("meta", JSON.stringify(metaObj));

    try {
      await axios.post("https://yourapi.com/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product uploaded!");
      // Clear form if needed here
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text style={styles.label}>Title *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />
        {errors.title && <Text style={styles.error}>{errors.title}</Text>}

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={description}
          onChangeText={setDescription}
        />
        {errors.description && (
          <Text style={styles.error}>{errors.description}</Text>
        )}

        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        {errors.price && <Text style={styles.error}>{errors.price}</Text>}

        <Text style={styles.label}>Category *</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={handleCategoryChange}
            style={styles.picker}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Thumbnail *</Text>
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => pickImage(true)}
        >
          <Text style={styles.uploadText}>Choose Thumbnail</Text>
        </TouchableOpacity>
        {thumbnail && (
          <Image source={{ uri: thumbnail.uri }} style={styles.imagePreview} />
        )}
        {errors.thumbnail && (
          <Text style={styles.error}>{errors.thumbnail}</Text>
        )}

        <Text style={styles.label}>Gallery Images ({images.length}/5)</Text>
        <TouchableOpacity
          style={[
            styles.uploadBtn,
            images.length >= 5 && { backgroundColor: "#999" },
          ]}
          onPress={() => images.length < 5 && pickImage(false)}
          disabled={images.length >= 5}
        >
          <Text style={styles.uploadText}>Add Images</Text>
        </TouchableOpacity>
        <ScrollView horizontal>
          {images.map((img, i) => (
            <View key={i} style={{ position: "relative" }}>
              <Image source={{ uri: img.uri }} style={styles.galleryPreview} />
              <TouchableOpacity
                onPress={() => removeImage(i)}
                style={styles.removeBtn}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.label}>Meta (Category Specific)</Text>
        {meta.length === 0 && (
          <Text style={{ fontSize: 12, color: "#666" }}>
            No additional fields for this category.
          </Text>
        )}
        {meta.map((item, index) => (
          <View key={index} style={styles.metaRow}>
            <TextInput
              placeholder="Key"
              value={item.key}
              editable={false}
              style={[
                styles.input,
                { flex: 1, marginRight: 4, backgroundColor: "#eee" },
              ]}
            />
            <TextInput
              placeholder="Value"
              value={item.value}
              onChangeText={(text) => {
                const updated = [...meta];
                updated[index].value = text;
                setMeta(updated);
              }}
              style={[styles.input, { flex: 1 }]}
            />
          </View>
        ))}

        <TouchableOpacity
          onPress={handleUpload}
          disabled={loading}
          style={[
            styles.uploadBtn,
            { backgroundColor: "rgb(0,20,77)", marginTop: 20 },
          ]}
        >
          <Text style={styles.uploadText}>
            {loading ? "Uploading..." : "Submit Product"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "#fff", marginTop: 10 }}>Uploading...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  label: {
    marginBottom: 6,
    fontWeight: "600",
    fontSize: 13,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    fontSize: 13,
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
  },
  picker: {
    height: 40,
    width: "100%",
  },
  uploadBtn: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  uploadText: {
    color: "#000",
    fontWeight: "600",
  },
  imagePreview: {
    width: 120,
    height: 120,
    marginTop: 10,
    borderRadius: 10,
  },
  galleryPreview: {
    width: 80,
    height: 80,
    marginRight: 8,
    marginTop: 10,
    borderRadius: 8,
  },
  removeBtn: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 4,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
});
