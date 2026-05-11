import api from '../lib/axios';

export const reviewApi = {
  getForProduct: (productId) => api.get(`/review/product/${productId}`),
  addReview: (data) => api.post('/review', data),
};