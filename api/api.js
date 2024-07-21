import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://mustdo-server.vercel.app/api';

// Set up Axios instance with base URL and interceptors
const axiosInstance = axios.create({
  baseURL: API_URL,
});


let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
  refreshSubscribers.map(callback => callback(token));
};

const addSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

axiosInstance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('mdtoken');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber((token) => {
            originalRequest.headers['x-auth-token'] = token;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/auth/refresh`, { token: refreshToken })
          .then(({ data }) => {
            if (data.token) {
              AsyncStorage.setItem('mdtoken', data.token);
            }
            if (data.refreshToken) {
              AsyncStorage.setItem('refreshToken', data.refreshToken);
            }
            axiosInstance.defaults.headers.common['x-auth-token'] = data.token;
            originalRequest.headers['x-auth-token'] = data.token;
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
  const response = await axiosInstance.get('/tasks');
  return response.data;
};

export const createTask = async (task) => {
  const response = await axiosInstance.post('/tasks', task);
  return response.data;
};

export const updateTask = async (id, task) => {
  const response = await axiosInstance.put(`/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axiosInstance.delete(`/tasks/${id}`);
  return response.data;
};

export const registerUser = async (user) => {
  const response = await axiosInstance.post('/auth/register', user);
  return response.data;
};

export const loginUser = async (user) => {
  const response = await axiosInstance.post('/auth/login', user);
  return response.data;
};

export const getUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

export const getQuote = async () => {
  try {
    const response = await axiosInstance.get('/quotes');
    return response.data.quote;
  } catch (error) {
    throw new Error('Error fetching quotes: ' + error.message);
  }
};
