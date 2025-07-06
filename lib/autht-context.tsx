import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserType = {
  id: string;
  email: string;
  userName: string;
};

type AuthContextType = {
  user: UserType | null;
  isloadingUser: boolean;
  signUp: (
    userName: string,
    email: string,
    password: string
  ) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isloadingUser, setIsloadingUser] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("QurioUser");
        const storedUserEmail = await AsyncStorage.getItem("QurioUserEmail");
        const storedUserName = await AsyncStorage.getItem("QurioUserName");

        if (storedUserId && storedUserEmail && storedUserName) {
          setUser({
            id: storedUserId,
            email: storedUserEmail,
            userName: storedUserName,
          });
        }
      } catch (error) {
        console.log("Error loading user from AsyncStorage:", error);
      } finally {
        setIsloadingUser(false);
      }
    };

    loadUser();
  }, []);

  const signUp = async (userName: string, email: string, password: string) => {
    try {
      const res = await axios.post(
        "https://qurioans.onrender.com/qurioans/signup",
        { userName, email, password }
      );
      alert(res.data.message);

      const userId = res.data.userId;

      // Save to AsyncStorage
      await AsyncStorage.setItem("QurioUser", userId);
      await AsyncStorage.setItem("QurioUserEmail", email);
      await AsyncStorage.setItem("QurioUserName", userName);

      // Update state
      setUser({ id: userId, email, userName });

      return null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response?.data?.message || "Signup failed";
      }
      return "An error occurred during signup";
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await axios.post(
        "https://qurioans.onrender.com/qurioans/signin",
        { email, password }
      );
      alert(res.data.message);

      const userId = res.data.id;
      const userName = res.data.userName; // Assuming your API returns userName on login

      // Save to AsyncStorage
      await AsyncStorage.setItem("QurioUser", userId);
      await AsyncStorage.setItem("QurioUserEmail", email);
      if (userName) {
        await AsyncStorage.setItem("QurioUserName", userName);
      }

      // Update state
      setUser({ id: userId, email, userName: userName || "" });

      return null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response?.data?.message || "Login failed";
      }
      return "An error occurred during login";
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("QurioUser");
      await AsyncStorage.removeItem("QurioUserEmail");
      await AsyncStorage.removeItem("QurioUserName");
      setUser(null);
    } catch (error) {
      console.log("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isloadingUser, user, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
