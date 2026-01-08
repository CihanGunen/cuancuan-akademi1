import axios from 'axios';

const api = axios.create({
  // Vercel'e eklediğin VITE_API_URL değişkenini kullanır, 
  // eğer bulamazsa yedek olarak Render linkini kullanır.
  baseURL: import.meta.env.VITE_API_URL || 'https://cuancuan-akademi1.onrender.com',
});

// Her istek gönderilmeden önce burası çalışır
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Eğer tarayıcıda kayıtlı bir token varsa, isteğin başına ekle
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
