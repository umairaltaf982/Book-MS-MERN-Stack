import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004/api';
const ORDER_SERVICE_URL = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:5006/api';

// Create axios instances
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const orderApi = axios.create({
  baseURL: ORDER_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
const addAuthToken = (config) => {
  const isAdminRequest = config.url.includes('/admin/');
  const token = isAdminRequest
    ? localStorage.getItem('adminToken')
    : localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

api.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
orderApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));

// API services
export const userService = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getCart: () => api.get('/users/get-cart'),
  getWishlist: () => api.get('/users/get-wishlist'),
  addToCart: (bookId) => api.put('/users/add-to-cart', { bookId }),
  removeFromCart: (bookId) => api.put('/users/remove-from-cart', { bookId }),
  addToWishlist: (bookId) => api.put('/users/add-to-wishlist', { bookId }),
  removeFromWishlist: (bookId) => api.put('/users/remove-from-wishlist', { bookId }),
  buyBook: (bookId) => api.put('/users/buy-book', { bookId }),
  forgotPassword: (email) => api.post('/users/forgot-password', { email }),
  resetPassword: (data) => api.post('/users/reset-password', data)
};

export const bookService = {
  getAllBooks: () => api.get('/books/get-all-books'),
  getBook: (id) => api.get(`/books/get-book/${id}`),
  searchBooks: (query) => api.get(`/books/search?q=${query}`)
};

export const adminService = {
  register: (adminData) => api.post('/admin/register', adminData),
  login: (credentials) => api.post('/admin/login', credentials),
  createBook: (bookData) => api.post('/admin/create-book', bookData),
  updateBook: (id, bookData) => api.put(`/admin/update-book/${id}`, bookData),
  deleteBook: (id) => api.delete(`/admin/delete-book/${id}`),
  getAllBooks: () => api.get('/admin/get-all-books'),
  getAllUsers: () => api.get('/admin/get-all-users'),
  deleteUser: (id) => api.delete(`/admin/delete-user/${id}`),
  updateUser: (id, userData) => api.put(`/admin/update-user/${id}`, userData),
  addContact: (contactData) => api.post('/admin/add-contact', contactData)
};

// New Order Service
export const orderService = {
  // Customer order operations
  createOrder: (orderData) => orderApi.post('/orders', orderData),
  getUserOrders: (userId) => orderApi.get(`/orders/user/${userId}`),
  getOrderById: (orderId) => orderApi.get(`/orders/${orderId}`),
  cancelOrder: (orderId) => orderApi.patch(`/orders/${orderId}/cancel`),
  
  // Admin order operations
  getAllOrders: () => orderApi.get('/orders'),
  updateOrderStatus: (orderId, status) => 
    orderApi.patch(`/orders/${orderId}/status`, { status }),
  updatePaymentStatus: (orderId, paymentStatus) => 
    orderApi.patch(`/orders/${orderId}/payment`, { paymentStatus })
};

export default api;
