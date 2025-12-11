import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuthStore } from '../state/store';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let socket;
export const getSocket = () => {
  if (!socket) {
    const { user } = useAuthStore.getState();
    socket = io(API_BASE, {
      query: { role: user?.role, userId: user?.id },
    });
  }
  return socket;
};

export const fetchMenu = () => api.get('/menu').then((r) => r.data);
export const fetchMenuItem = (id) => api.get(`/menu/${id}`).then((r) => r.data);
export const login = (payload) => api.post('/auth/login', payload).then((r) => r.data);
export const register = (payload) => api.post('/auth/register', payload).then((r) => r.data);
export const checkout = (items) => api.post('/cart/checkout', { items }).then((r) => r.data);
export const getOrders = () => api.get('/orders').then((r) => r.data);
export const getAllOrders = () => api.get('/orders/all').then((r) => r.data);
export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status }).then((r) => r.data);

