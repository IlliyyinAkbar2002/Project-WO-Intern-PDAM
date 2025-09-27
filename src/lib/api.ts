import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  // baseURL: `http://127.0.0.1:8000/api`,
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Enable cookies for authentication
});

api.interceptors.request.use((config) => {
  // Only access localStorage on the client side
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  config.headers.Accept = "application/json";
  return config;
});

export { api };