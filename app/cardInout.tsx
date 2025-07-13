import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const PaymentSection = () => {
  const [form, setForm] = useState({
    cardholder: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvv: "",
  });

  const [cardValidation, setCardValidation] = useState({
    type: "",
    isValid: true,
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Format number as 1234 5678 9012 3456
  const formatCardNumber = (text) => {
    return text
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  // Card Type Detection
  const detectCardType = (number) => {
    const cleaned = number.replace(/\s/g, "");
    if (/^4[0-9]{0,}$/.test(cleaned)) return "Visa";
    if (
      /^5[1-5][0-9]{0,}$/.test(cleaned) ||
      /^2(2[2-9]|[3-6]|7[01])[0-9]{0,}$/.test(cleaned)
    )
      return "MasterCard";
    if (/^506[0-9]{0,}$/.test(cleaned) || /^65[0-9]{0,}$/.test(cleaned))
      return "Verve";
    return "Unknown";
  };

  // Luhn Check
  const luhnCheck = (number) => {
    const digits = number.replace(/\D/g, "").split("").reverse();
    const sum = digits.reduce((acc, val, idx) => {
      let n = parseInt(val);
      if (idx % 2 !== 0) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      return acc + n;
    }, 0);
    return sum % 10 === 0;
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Payment & Shipping</Text>

      {/* Cardholder Name */}
      <Text style={styles.label}>Cardholder Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. John Doe"
        keyboardType="default"
        value={form.cardholder}
        onChangeText={(text) => handleChange("cardholder", text)}
      />

      {/* Card Number */}
      <Text style={styles.label}>Card Number</Text>
      <TextInput
        style={[
          styles.input,
          !cardValidation.isValid &&
            form.cardNumber.length >= 16 &&
            styles.inputError,
        ]}
        placeholder="1234 5678 9012 3456"
        keyboardType="numeric"
        maxLength={19}
        value={form.cardNumber}
        onChangeText={(text) => {
          const formatted = formatCardNumber(text);
          const type = detectCardType(formatted);
          const valid = luhnCheck(formatted);
          handleChange("cardNumber", formatted);
          setCardValidation({ type, isValid: valid });
        }}
      />
      {cardValidation.type !== "" && (
        <Text style={styles.cardType}>Card Type: {cardValidation.type}</Text>
      )}
      {!cardValidation.isValid && form.cardNumber.length >= 16 && (
        <Text style={styles.error}>Invalid card number</Text>
      )}

      {/* Expiry + CVV */}
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

      {/* Shipping Info */}
      <Text style={styles.label}>Shipping Info</Text>
      <TextInput
        style={styles.inputDisabled}
        value="Fast delivery, 3-5 days"
        editable={false}
      />
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
    color: "#333",
    marginBottom: 6,
    marginTop: 12,
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
  inputError: {
    borderColor: "red",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 6,
  },
  cardType: {
    color: "#666",
    fontSize: 13,
    marginTop: 6,
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
