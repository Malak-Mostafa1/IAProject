import api from '../lib/axios';

export const productApi = {
  // جلب جميع المنتجات المعتمدة (للمستخدمين العاديين والزوار)
  getAll: (params) => api.get('/product', { params }),

  // جلب منتج واحد بالمعرف
  getById: (id) => api.get(`/product/${id}`),

  // إنشاء منتج جديد (البائع)
  create: (data) => api.post('/product', data),

  // تحديث منتج (البائع)
  update: (data) => api.put('/product', data),

  // حذف منتج (البائع)
  delete: (id) => api.delete(`/product/${id}`),

  // موافقة الأدمن على منتج
  approve: (id) => api.put(`/product/approve/${id}`),

  // رفض الأدمن لمنتج
  reject: (id) => api.put(`/product/reject/${id}`),

  // البحث في منتجات البائع (للبائع)
  searchVendor: (params) => api.get('/product/search', { params }),

  // دالة خاصة للأدمن - تجلب جميع المنتجات (بما فيها غير المعتمدة)
  getAllAdmin: () => api.get('/product/admin/all'),
};