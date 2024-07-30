// src/hooks/useAuth.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser, loginUser, registerUser } from "../api";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = await AsyncStorage.getItem("mdtoken");
      if (!token) throw new Error("Not authenticated");
      return getUser();
    },
    enabled: !!AsyncStorage.getItem("mdtoken"), // Only fetch user if token exists
    retry: false, // Disable automatic retry
    gcTime: 1000 * 60 * 60 * 24 * 2, // 24 * 2 hours i.e 2 days
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials) => {
      const data = await loginUser(credentials);
      await AsyncStorage.setItem("mdtoken", data.token);
      return getUser();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
        type: "active",
        exact: true,
      });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userInfo) => {
      const data = await registerUser(userInfo);
      await AsyncStorage.setItem("mdtoken", data.token);
      return getUser();
    },
    onError: (err, userInfo, context) => {
      console.log("failed to register user", err, userInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
        type: "active",
        exact: true,
      });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await AsyncStorage.removeItem("mdtoken");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
        type: "active",
        exact: true,
      });
    },
  });
};
