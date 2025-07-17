import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const PaymentSection = () => {
  const [form, setForm] = useState({
    cardholder: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvv: "",
  });

  const [storedUserEmail, setStoredUserEmail] = useState("");
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");

  useEffect(() => {
    const fetchStoredUserEmail = async () => {
      const email = await AsyncStorage.getItem("QurioUserEmail");
      if (email) {
        setStoredUserEmail(email);
      }
    };
    fetchStoredUserEmail();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePayment = async () => {
    if (!storedUserEmail) {
      Alert.alert("Email not found", "Unable to get user email from storage.");
      return;
    }

    // You can also dynamically generate a transaction ref here
    const ref = `txn_${Date.now()}`;

    const url = `https://paystack.com/pay/ekn0y80klo?email=${storedUserEmail}&amount=1000&reference=${ref}`;
    setPaymentUrl(url);
    setShowWebView(true);
  };

  const handleWebViewNavigation = (event) => {
    const { url } = event;

    // Detect Paystack success
    if (url.includes("paystack.com/close")) {
      Alert.alert("Transaction closed.");
      setShowWebView(false);
    }

    if (url.includes("reference=")) {
      const refMatch = url.match(/reference=([\w-]+)/);
      const reference = refMatch?.[1];

      if (reference) {
        Alert.alert("Payment Successful", `Ref: ${reference}`);
        saveCardReference(reference);
        setShowWebView(false);
      }
    }
  };

  const saveCardReference = async (reference) => {
    try {
      const response = await fetch(
        "https://qurioans.onrender.com/qurioans/api/save-card",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: storedUserEmail,
            ref: reference,
          }),
        }
      );
      const data = await response.json();
      console.log("Saved to DB:", data);
    } catch (error) {
      console.error("Error saving to backend:", error);
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Payment & Shipping</Text>

      <Text style={styles.label}>Cardholder Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. John Doe"
        value={form.cardholder}
        onChangeText={(text) => handleChange("cardholder", text)}
      />

      <Text style={styles.label}>Card Number</Text>
      <TextInput
        style={styles.input}
        placeholder="1234 5678 9012 3456"
        keyboardType="numeric"
        maxLength={19}
        value={form.cardNumber}
        onChangeText={(text) => handleChange("cardNumber", text)}
      />

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Expiry MM</Text>
          <TextInput
            style={styles.input}
            placeholder="MM"
            keyboardType="numeric"
            maxLength={2}
            value={form.expMonth}
            onChangeText={(text) => handleChange("expMonth", text)}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Expiry YY</Text>
          <TextInput
            style={styles.input}
            placeholder="YY"
            keyboardType="numeric"
            maxLength={2}
            value={form.expYear}
            onChangeText={(text) => handleChange("expYear", text)}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            keyboardType="numeric"
            secureTextEntry
            maxLength={4}
            value={form.cvv}
            onChangeText={(text) => handleChange("cvv", text)}
          />
        </View>
      </View>

      <Text style={styles.label}>Shipping Info</Text>
      <TextInput
        style={styles.inputDisabled}
        value="Fast delivery, 3-5 days"
        editable={false}
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title="Verify with Paystack"
          onPress={handlePayment}
          color="rgb(0,20,77)" // customize button color
        />
      </View>

      {/* WebView Modal */}
      <Modal visible={showWebView}>
        <WebView
          source={{ uri: paymentUrl }}
          onNavigationStateChange={handleWebViewNavigation}
          startInLoadingState
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    backgroundColor: "#fafafa",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    color: "#666",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  column: {
    flex: 1,
  },
});

export default PaymentSection;
