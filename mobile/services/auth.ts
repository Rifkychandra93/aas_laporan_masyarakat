import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";

export const loginUser = async (
  email: string,
  password: string
) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  const token = response.data.token;

  await AsyncStorage.setItem("token", token);

  return response.data;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
  });

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const updateProfile = async (name: string) => {
  const response = await api.put("/auth/me", { name });
  const token = response.data.token;
  if (token) {
    await AsyncStorage.setItem("token", token);
  }
  return response.data;
};