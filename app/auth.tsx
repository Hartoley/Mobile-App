import { useAuth } from "@/lib/autht-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button, Checkbox, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const green100 = "#4CAF50";

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (isSignUp && !accepted) {
      setError("Accept the policy and terms");
      return;
    }

    setError(null);

    const err = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    if (err) {
      setError(err);
    } else if (!isSignUp) {
      router.replace("/");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={["#a8e6cf", "#56ab2f"]}
        style={{ flex: 1, alignItems: "center" }}
      >
        {/* Top image section */}
        <ImageBackground
          source={{
            uri: "https://i.pinimg.com/736x/73/d4/d8/73d4d85ffc5d24c1d4ad76db69a85241.jpg",
          }}
          style={{ width: "100%", height: 300 }}
          resizeMode="cover"
        />

        {/* White form card */}
        <View
          style={{
            backgroundColor: "white",
            width: "90%",
            marginTop: -50,
            borderRadius: 24,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 6,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: "600",
              color: "#2f855a",
              marginBottom: 12,
            }}
          >
            {isSignUp ? "Hello.\nCreate Your Account" : "Welcome Back"}
          </Text>

          <TextInput
            className="rounded-md outline-none h-16 px-6"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            style={{
              backgroundColor: "#f0fef4",
              borderRadius: 10,
              fontSize: 12,
              marginBottom: 10,
            }}
          />

          <TextInput
            className="rounded-md outline-none h-16 px-6"
            secureTextEntry
            placeholder="Your Password"
            value={password}
            onChangeText={setPassword}
            style={{
              backgroundColor: "#f0fef4",
              borderRadius: 10,
              fontSize: 12,
              marginBottom: 10,
            }}
          />

          {isSignUp && (
            <TextInput
              className="rounded-md outline-none h-16 px-6"
              secureTextEntry
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={{
                backgroundColor: "#f0fef4",
                borderRadius: 10,
                fontSize: 12,
                marginBottom: 10,
              }}
            />
          )}

          {isSignUp && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Checkbox
                status={accepted ? "checked" : "unchecked"}
                onPress={() => setAccepted(!accepted)}
                color="#4CAF50"
                uncheckedColor="#4CAF50"
              />
              <Text style={{ fontSize: 12, color: green100 }}>
                I accept the policy and terms
              </Text>
            </View>
          )}

          {error && (
            <Text
              style={{
                color: "red",
                textAlign: "center",
                fontSize: 13,
                marginBottom: 8,
              }}
            >
              {error}
            </Text>
          )}
          <Button
            mode="contained"
            onPress={handleAuth}
            style={{
              width: 150, // ✅ set fixed width
              height: 45,
              alignSelf: "center", // ✅ center the button
              borderRadius: 20,
              backgroundColor: "#55d84a",
              marginTop: 2,
              marginBottom: 10,
              padding: 0,
            }}
            labelStyle={{ fontSize: 12, color: "white" }}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 20,
              marginVertical: 8,
            }}
          >
            <Image
              source={{
                uri: "https://i.pinimg.com/736x/89/73/d4/8973d4473f428cb78cca39f82c15af3e.jpg",
              }}
              style={{ width: 20, height: 20 }}
            />
            <Image
              source={{
                uri: "https://i.pinimg.com/736x/4a/4c/22/4a4c224a0c6667178bebdfa3b6bdb92b.jpg",
              }}
              style={{ width: 20, height: 20 }}
            />
            <Image
              source={{
                uri: "https://i.pinimg.com/736x/ee/5e/5f/ee5e5f58afcfb20500d8f8f1489ea191.jpg",
              }}
              style={{ width: 20, height: 20 }}
            />
          </View>

          <Button
            mode="text"
            onPress={() => setIsSignUp(!isSignUp)}
            labelStyle={{
              fontSize: 11,
              color: "#4CAF50",
              flexWrap: "wrap", // ✅ allow text wrapping
              textAlign: "center", // ✅ center each line
            }}
            style={{
              marginTop: 8,
              alignSelf: "center", // optional: center button itself
            }}
          >
            {isSignUp
              ? "Already have an account? Login here"
              : "Don't have an account? Sign Up"}
          </Button>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
