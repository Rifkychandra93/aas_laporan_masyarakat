import axios from "axios";
import type { LoginPayload, RegisterPayload, AuthResponse } from "../types/auth.types";

const API_BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
};

export const registerUser = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", payload);
  return response.data;
};

export default api;
