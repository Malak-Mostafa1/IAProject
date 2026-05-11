import api from '../lib/axios';

export const userApi = {
  getAll: () => api.get('/user'),
  getById: (id) => api.get(`/user/${id}`),
  approve: (id) => api.put(`/user/approve/${id}`),
  disable: (id) => api.put(`/user/disable/${id}`),
  getVendorPermissions: (vendorId) =>
    api.get(`/user/permissions/${vendorId}`),
  updatePermissions: (vendorId, permissions) =>
    api.put(`/user/permissions/${vendorId}`, permissions),
};