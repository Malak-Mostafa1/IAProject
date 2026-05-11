import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isInitialized, isAuthenticated } = useAuth();

  // ⏳ طالما لم تكتمل تهيئة المصادقة، نعرض مؤشر تحميل فقط
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // 🔴 بعد التهيئة، إذا لم يكن هناك مستخدم مسجل
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🟠 صلاحيات غير متطابقة
  if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
    if (user?.role === 'Admin') return <Navigate to="/admin/users" replace />;
    if (user?.role === 'Vendor') return <Navigate to="/vendor/products" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;