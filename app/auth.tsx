import { useAuth } from "@/lib/autht-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import bgImage from "../assets/images/newimage.jpg";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mode } = useLocalSearchParams();
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (mode === "signup") setIsSignUp(true);
    else if (mode === "login") setIsSignUp(false);
  }, [mode]);

  const handleAuth = async () => {
    if (!email || !password) return setError("Please fill in all fields");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");
    if (isSignUp && password !== confirmPassword)
      return setError("Passwords do not match");
    if (isSignUp && !accepted) return setError("Accept the policy and terms");
    setError(null);
    const err = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);
    if (err) setError(err);
    else if (!isSignUp) router.replace("/");
  };

  return (
    <>
      <ImageBackground source={bgImage} style={{ flex: 1 }} resizeMode="cover">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className="w-full h-full flex-col items-center justify-end">
            <View
              style={{
                width: "100%",
                height: "20%",
                paddingTop: 70,
                paddingLeft: 30,
              }}
            >
              <Text style={{ fontSize: 12, color: "white" }}>
                <AntDesign name="back" size={12} style={{ color: "white" }} />
                {"   "}
                Back
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "white",
                width: "100%",
                height: "80%",
                borderRadius: 24,
                padding: 20,
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 6,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#2f855a",
                  marginBottom: 16,
                }}
              >
                {isSignUp ? "Hello.\nCreate Your Account" : "Welcome Back"}
              </Text>

              <TextInput
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  backgroundColor: "#f0fef4",
                  borderRadius: 10,
                  fontSize: 13,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginBottom: 10,
                }}
              />

              <TextInput
                placeholder="Your Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                  backgroundColor: "#f0fef4",
                  borderRadius: 10,
                  fontSize: 13,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginBottom: 10,
                }}
              />

              {isSignUp && (
                <TextInput
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  style={{
                    backgroundColor: "#f0fef4",
                    borderRadius: 10,
                    fontSize: 13,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    marginBottom: 10,
                  }}
                />
              )}

              {isSignUp && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Checkbox
                    status={accepted ? "checked" : "unchecked"}
                    onPress={() => setAccepted(!accepted)}
                    color="#4CAF50"
                  />
                  <Text style={{ fontSize: 12, color: "green" }}>
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
                    marginBottom: 10,
                  }}
                >
                  {error}
                </Text>
              )}

              <View
                style={{
                  marginVertical: 10,
                  alignSelf: "center",
                  width: "50%",
                }}
              >
                <Button
                  title={isSignUp ? "Sign Up" : "Sign In"}
                  onPress={handleAuth}
                  color="#55d84a"
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 16,
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

              <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text
                  style={{
                    fontSize: 11,
                    textAlign: "center",
                    color: "#4CAF50",
                    marginTop: 6,
                  }}
                >
                  {isSignUp
                    ? "Already have an account? Login here"
                    : "Don't have an account? Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  );
}
