import axios from "axios";
import Cookies from "js-cookie";

// const API_BASE =
//   process.env.NEXT_PUBLIC_API_URL ||
//   "https://dimissory-unpervading-leonarda.ngrok-free.dev/api";
// const SANCTUM_URL =
//   process.env.NEXT_PUBLIC_SANCTUM_URL ||
//   "https://dimissory-unpervading-leonarda.ngrok-free.dev";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const SANCTUM_URL = process.env.NEXT_PUBLIC_SANCTUM_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

let csrfPromise: Promise<void> | null = null;

export const ensureCsrfToken = async () => {
  if (typeof window === "undefined") return;

  if (!csrfPromise) {
    csrfPromise = axios
      .get(`${SANCTUM_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then(() => {
        console.log("CSRF cookie obtained successfully");
        return undefined;
      })
      .catch((error) => {
        console.error("Failed to get CSRF cookie:", error);
        csrfPromise = null;
        throw error;
      });
  }
  return csrfPromise;
};

api.interceptors.request.use((config) => {
  // Only access localStorage on the client side
  if (typeof window !== "undefined") {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// CSRF token interceptor - only for state-changing requests
api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    // Only get CSRF token for state-changing requests
    const needsCsrf = ["post", "put", "patch", "delete"].includes(
      config.method?.toLowerCase() || "",
    );

    if (needsCsrf) {
      try {
        await ensureCsrfToken();
      } catch (error) {
        console.error("Failed to ensure CSRF token:", error);
        // Don't block the request if CSRF fails
      }
    }
  }

  return config;
});

export { api };
