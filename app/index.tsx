import { useAuth } from "@/lib/autht-context";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import bgImage from "../assets/images/newimage.jpg";

export default function Index() {
  const { signOut } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  return (
    <ImageBackground source={bgImage} style={{ flex: 1 }} resizeMode="cover">
      <View className="flex-1 w-full h-full items-center justify-center">
        <View className="w-full gap-4 h-[90%] text-center flex items-center justify-center">
          <Text className="text-3xl font-extrabold text-white">
            Welcome Back!
          </Text>

          <Text className="text-md leading-normal self-center w-[85%] text-center text-white">
            Enter your details for a seamless experience
          </Text>
        </View>
        <View className="w-full h-[10%] flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/auth",
                params: { mode: "signup" },
              })
            }
            className="bg-[rgb(0,10,44)] rounded-tr-[35px] flex-1 items-center justify-center h-full w-1/2"
          >
            <Text className="text-white text-center text-md font-bold">
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/auth",
                params: { mode: "login" },
              })
            }
            className="bg-white rounded-tl-[35px] flex-1 items-center justify-center h-full w-1/2"
          >
            <Text className="text-[rgb(0,10,44)] text-center  text-md font-bold">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
