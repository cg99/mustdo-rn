import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://mustdo-server.vercel.app/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
};

const addSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("mdtoken");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber((token) => {
            originalRequest.headers["x-auth-token"] = token;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      return new Promise((resolve, reject) => {
        axios
          .post(`${API_URL}/auth/refresh`, { token: refreshToken })
          .then(({ data }) => {
            if (data.token) {
              AsyncStorage.setItem("mdtoken", data.token);
              axiosInstance.defaults.headers.common["x-auth-token"] =
                data.token;
            }
            if (data.refreshToken) {
              AsyncStorage.setItem("refreshToken", data.refreshToken);
            }
            originalRequest.headers["x-auth-token"] = data.token;
            onRefreshed(data.token);
            resolve(axiosInstance(originalRequest));
          })
          .catch((err) => {
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
            refreshSubscribers = [];
          });
      });
    }

    return Promise.reject(error);
  }
);

export const getTasks = async () => {
  try {
    const response = await axiosInstance.get("/tasks");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching tasks: " + error.message);
  }
};

export const createTask = async (task) => {
  try {
    const response = await axiosInstance.post("/tasks", task);
    return response.data;
  } catch (error) {
    throw new Error("Error creating task: " + error.message);
  }
};

export const updateTask = async (task) => {
  try {
    const response = await axiosInstance.put(`/tasks/${task?._id}`, task);
    return response.data;
  } catch (error) {
    throw new Error("Error updating task: " + error.message);
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await axiosInstance.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Error deleting task: " + error.message);
  }
};

export const registerUser = async (user) => {
  try {
    const response = await axiosInstance.post("/auth/register", user);
    return response.data;
  } catch (error) {
    throw new Error("Error registering user: " + error.message);
  }
};

export const loginUser = async (user) => {
  try {
    const response = await axiosInstance.post("/auth/login", user);
    return response.data;
  } catch (error) {
    throw new Error("Error logging in user: " + error.message);
  }
};

export const getUser = async () => {
  try {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching user data: " + error.message);
  }
};

export const getQuote = async () => {
  try {
    const response = await axiosInstance.get("/quotes");
    return response.data.quote;
  } catch (error) {
    throw new Error("Error fetching quotes: " + error.message);
  }
};
