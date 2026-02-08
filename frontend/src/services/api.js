import axios from 'axios';

// Production veya development API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🔗 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000, // 30 saniye timeout
});

// Request interceptor - Her istekte token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Hata yönetimi
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server yanıt verdi ama hata kodu var
      console.error('Response Error:', error.response.status, error.response.data);
      
      // 401 Unauthorized - Token geçersiz
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        window.location.href = '/admin/login';
      }
      
      // 403 Forbidden
      if (error.response.status === 403) {
        console.error('Yetkisiz erişim!');
      }
      
      // 500 Server Error
      if (error.response.status === 500) {
        console.error('Sunucu hatası!');
      }
    } else if (error.request) {
      // İstek gönderildi ama yanıt alınamadı
      console.error('Network Error:', error.request);
      console.error('Backend sunucuya erişilemiyor. Lütfen backend URL\'ini kontrol edin.');
    } else {
      // İstek oluşturulurken hata
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;