import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // NestJS backend adresi
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