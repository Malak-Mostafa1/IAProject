import api from '../lib/axios';

export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) =>
    api.post(`/cart?productId=${productId}&quantity=${quantity}`),
  removeFromCart: (productId) => api.delete(`/cart/${productId}`),
};