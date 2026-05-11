import api from '../lib/axios';

export const orderApi = {
  getMyOrders: () => api.get('/order'),
  checkout: (items) => api.post('/order/checkout', items),
  getById: (id) => api.get(`/order/${id}`),
  getVendorSalesHistory: () => api.get('/order/vendor/sales-history'),
  getVendorStatistics: () => api.get('/order/vendor/statistics'),
};