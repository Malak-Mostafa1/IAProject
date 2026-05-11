import api from '../lib/axios';

export const categoryApi = {
  getAll: () => api.get('/category'),
  getById: (id) => api.get(`/category/${id}`),
  create: (data) => api.post('/category', data),
  update: (data) => api.put('/category', data),
  delete: (id) => api.delete(`/category/${id}`),
};