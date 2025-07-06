import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import UploadProductDesign from "../product/uploadproduct";

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
  Books: ["Author", "Publisher", "ISBN", "Edition", "Condition", "Language"],
  Clothing: ["Brand", "Size", "Color", "Material", "Condition", "Fit Type"],
  Food: [
    "Brand",
    "Ingredients",
    "Expiry Date",
    "Weight",
    "Packaging Type",
    "Dietary Info",
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
  Bags: ["Brand", "Material", "Type", "Color", "Condition", "Size"],
  Shoes: ["Brand", "Size", "Material", "Color", "Condition", "Style"],
  Watch: [
    "Brand",
    "Model",
    "Warranty",
    "Condition",
    "Features",
    "Water Resistance",
  ],
  New: ["Brand", "Model", "Warranty", "Features", "Color", "Availability"],
  Men: ["Category", "Brand", "Size", "Color", "Material", "Condition"],
  Women: ["Category", "Brand", "Size", "Color", "Material", "Condition"],
  Beauty: [
    "Brand",
    "Type",
    "Expiry Date",
    "Ingredients",
    "Skin Type",
    "Packaging",
  ],
  Fashion: ["Category", "Brand", "Size", "Color", "Material", "Style"],
  Health: [
    "Brand",
    "Type",
    "Expiry Date",
    "Ingredients",
    "Dosage",
    "Packaging",
  ],
  Home: ["Category", "Brand", "Material", "Color", "Dimensions", "Condition"],
  Lifestyle: ["Category", "Type", "Brand", "Material", "Features", "Condition"],
  Sports: ["Type", "Brand", "Size", "Condition", "Material", "Usage"],
  Kids: ["Category", "Brand", "Age Range", "Size", "Color", "Condition"],
  Pets: ["Type", "Brand", "Expiry Date", "Ingredients", "Weight", "Packaging"],
  Others: [
    "Category",
    "Brand",
    "Condition",
    "Details",
    "Availability",
    "Location",
  ],
};

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
      clearForm();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
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
