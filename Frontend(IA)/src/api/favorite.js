import api from '../lib/axios';

export const favoriteApi = {
  getFavorites: () => api.get('/favorite'),
  addToFavorites: (productId) => api.post(`/favorite/${productId}`),
  removeFromFavorites: (productId) => api.delete(`/favorite/${productId}`),
};