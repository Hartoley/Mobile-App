import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import UploadProductDesign from "../product/uploadproduct";

export default function UploadProductFunction({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Others");
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [meta, setMeta] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fields = categoryMetaFields[category] || [];
    const defaultMeta = fields.map((field) => ({ key: field, value: "" }));
    setMeta(defaultMeta);
  }, [category]);

  const pickThumbnail = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setThumbnail(result.assets[0]);
  };

  const pickImages = async () => {
    if (images.length >= 5) return alert("Max 5 images allowed");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
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

  const updateMetaField = (index, value) => {
    const updated = [...meta];
    updated[index].value = value;
    setMeta(updated);
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

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("createdBy", "68460be2acf270418acdf715"); // Replace accordingly

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
      const response = await axios.post(
        "http://localhost:5003/mobile/products",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(response.data.message);
      clearForm();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to upload product";
      alert(errorMessage);
      console.error("Upload error:", error);
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
    const defaultMeta = (categoryMetaFields[category] || []).map((field) => ({
      key: field,
      value: "",
    }));
    setMeta(defaultMeta);
  };

  return (
    <UploadProductDesign
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      price={price}
      setPrice={setPrice}
      category={category}
      setCategory={setCategory}
      categories={Object.keys(categoryMetaFields)}
      thumbnail={thumbnail}
      pickThumbnail={pickThumbnail}
      images={images}
      pickImages={pickImages}
      removeImage={removeImage}
      meta={meta}
      updateMetaField={updateMetaField}
      handleSubmit={handleSubmit}
      loading={loading}
      errors={errors}
      navigation={navigation} // Pass navigation prop to the design component
    />
  );
}
