import { useAuth } from "@/lib/autht-context";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Checkbox,
  TextInput,
} from "react-native-paper";
import logo1 from "../assets/images/logo1.png";
import logo2 from "../assets/images/logo2.png";
import logo3 from "../assets/images/logo4.png";
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
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === "signup") setIsSignUp(true);
    else if (mode === "login") setIsSignUp(false);
  }, [mode]);

  const handleAuth = async () => {
    // Basic validations
    if (!email || !password) return setError("Please fill in all fields");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");
    if (isSignUp && password !== confirmPassword)
      return setError("Passwords do not match");
    if (isSignUp && !accepted) return setError("Accept the policy and terms");

    setError(null); // Clear previous errors

    setIsLoading(true); // <--- Set loading to true when auth process starts

    try {
      const err = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (err) {
        setError(err); // Show error returned from signUp/signIn
      } else {
        // If no error, authentication was successful
        // Clear input fields (optional, often done on success)
        setEmail("");
        setPassword("");
        if (setConfirmPassword) setConfirmPassword(""); // Only if signUp
        if (setAccepted) setAccepted(false); // Only if signUp

        if (!isSignUp) {
          // Navigate only if signing in successfully
          router.replace("/");
        } else {
          console.log("Sign up successful!");
        }
      }
    } catch (operationError) {
      console.error(
        "An unexpected error occurred during authentication:",
        operationError
      );
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
              <Text
                style={{ fontSize: 12, color: "white" }}
                onPress={() => navigation.goBack()}
              >
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
                className="mt-8"
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "600",
                  color: "rgb(54,128,255)",
                  marginBottom: 16,
                }}
              >
                {isSignUp ? "Get Started" : "Welcome Back"}
              </Text>

              <TextInput
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                mode="outlined"
                outlineColor="rgb(153,156,163)"
                activeOutlineColor="rgb(153,156,163)"
                style={{
                  backgroundColor: "white",
                  borderRadius: 10,
                  fontSize: 13,
                  height: 54,
                  paddingHorizontal: 12,
                  marginBottom: 10,
                }}
                contentStyle={{
                  paddingVertical: 10,
                }}
                textColor="rgb(51,51,51)"
              />

              <TextInput
                label="Password"
                placeholder="Your Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                mode="outlined"
                outlineColor="rgb(153,156,163)"
                activeOutlineColor="rgb(153,156,163)"
                style={{
                  backgroundColor: "white",
                  borderRadius: 10,
                  fontSize: 13,
                  height: 54,
                  paddingHorizontal: 12,
                  marginBottom: 10,
                }}
                contentStyle={{
                  paddingVertical: 10,
                }}
                textColor="rgb(51,51,51)"
                right={
                  <TextInput.Icon
                    icon={() => (
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color="grey"
                      />
                    )}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              {isSignUp && (
                <TextInput
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  mode="outlined"
                  outlineColor="rgb(153,156,163)"
                  activeOutlineColor="rgb(153,156,163)"
                  style={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    fontSize: 13,
                    height: 54,
                    paddingHorizontal: 12,
                    marginBottom: 10,
                  }}
                  contentStyle={{
                    paddingVertical: 10,
                  }}
                  textColor="rgb(51,51,51)"
                  right={
                    <TextInput.Icon
                      icon={() => (
                        <Ionicons
                          name={showConfirmPassword ? "eye-off" : "eye"}
                          size={20}
                          color="grey"
                        />
                      )}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  }
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
                    color="rgb(54,128,255)"
                    uncheckedColor="rgb(54,128,255)"
                  />
                  <Text style={{ fontSize: 12, color: "rgb(54,128,255)" }}>
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
                  width: "90%",
                  height: 55,
                }}
              >
                <Button
                  mode="contained"
                  onPress={handleAuth}
                  // Disable the button while loading
                  disabled={isLoading}
                  style={{
                    backgroundColor: "rgb(54,128,255)",
                    height: 50,
                    borderRadius: 10,
                    justifyContent: "center",
                    // You might add an opacity change or other styles when disabled
                  }}
                  contentStyle={{
                    height: "100%",
                  }}
                  labelStyle={{
                    color: "white",
                    fontSize: 14,
                  }}
                >
                  {isLoading ? (
                    // Show ActivityIndicator when loading
                    <ActivityIndicator animating={true} color="white" />
                  ) : // Show button text when not loading
                  isSignUp ? (
                    "Sign Up"
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </View>

              <View className="flex-row items-center my-5">
                <View className={`flex-1 h-px bg-gray-400`} />
                <Text className={`mx-2 text-sm font-medium text-gray-700`}>
                  {isSignUp ? "Sign Up with" : "Sign In with"}
                </Text>
                <View className={`flex-1 h-px bg-gray-400`} />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 16,
                  marginVertical: 8,
                }}
              >
                <Image source={logo1} style={{ width: 30, height: 30 }} />
                <Image source={logo3} style={{ width: 30, height: 30 }} />

                <Image source={logo2} style={{ width: 30, height: 30 }} />
              </View>

              <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: "center",
                    color: "rgb(54,128,255)",
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
