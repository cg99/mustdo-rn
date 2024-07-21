import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser, loginUser, registerUser } from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem("mdtoken");
      if (token) {
        try {
          const userData = await getUser();
          setUser(userData);
        } catch (error) {
          console.error(error);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    await AsyncStorage.setItem("mdtoken", data.token);
    const userData = await getUser();
    setUser(userData);
  };

  const register = async (userInfo) => {
    const data = await registerUser(userInfo);
    await AsyncStorage.setItem("mdtoken", data.token);
    const userData = await getUser();
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("mdtoken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
