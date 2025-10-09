import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

console.log('API Base URL:', API_BASE);

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making API request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`
    });
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Mendefinisikan detail error dengan nilai fallback
    const errorDetails = {
      message: error.message || 'Unknown Error',
      status: error.response?.status || 'N/A',
      data: error.response?.data || {}, // Penting: menggunakan {} sebagai fallback
      url: error.config?.url || 'N/A'
    };
    
    // Mencetak detail yang lebih lengkap
    console.error('API response error:', errorDetails); 
    
    // Mengembalikan Promise.reject(error) agar error diteruskan ke service
    return Promise.reject(error); 
  }
);
