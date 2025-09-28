import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const SANCTUM_URL = process.env.NEXT_PUBLIC_SANCTUM_URL || "http://127.0.0.1:8000";

const apiBaseUrl = (() => {
  try {
    return new URL(API_BASE);
  } catch (error) {
    return new URL("http://127.0.0.1:8000/api");
  }
})();

const sanctumBaseUrl = (() => {
  try {
    return new URL(SANCTUM_URL);
  } catch (error) {
    return new URL("http://127.0.0.1:8000");
  }
})();

const api = axios.create({
  baseURL: apiBaseUrl.toString(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

let csrfPromise: Promise<void> | null = null;

export const ensureCsrfToken = async () => {
  if (typeof window === "undefined") return;

  if (!csrfPromise) {
    csrfPromise = axios
      .get(`${sanctumBaseUrl.origin}/sanctum/csrf-cookie`, {
        withCredentials: true,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
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
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  config.headers.Accept = "application/json";
  return config;
});

// CSRF token interceptor - only for state-changing requests
api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    // Only get CSRF token for state-changing requests
    const needsCsrf = ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '');

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