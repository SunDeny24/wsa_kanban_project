import axios from 'axios';

/**
 * Axios 인스턴스
 * - baseURL: 환경변수 NEXT_PUBLIC_API_BASE_URL
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // 예시: config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
