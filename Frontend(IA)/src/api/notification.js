import api from '../lib/axios';

export const notificationApi = {
  getMyNotifications: () => api.get('/notification'),
  send: (data) => api.post('/notification/send', data),
  markAsRead: (id) => api.post(`/notification/mark-as-read/${id}`),
};