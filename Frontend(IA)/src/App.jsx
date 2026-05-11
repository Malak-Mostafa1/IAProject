import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import OrderDetail from './pages/OrderDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/common/ProtectedRoute';

// صفحات العميل
import MyOrders from './pages/MyOrders';

// صفحات عامة
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import ShippingInfo from './pages/ShippingInfo';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ReturnPolicy from './pages/ReturnPolicy';

// Vendor
import VendorDashboard from './pages/VendorDashboard/Dashboard';
import VendorProducts from './pages/VendorDashboard/ProductsManager';
import VendorSales from './pages/VendorDashboard/SalesHistory';
import VendorStats from './pages/VendorDashboard/Statistics';
import VendorNotifications from './pages/VendorDashboard/Notifications';

// Admin
import AdminDashboard from './pages/AdminDashboard/Dashboard';
import UserManagement from './pages/AdminDashboard/UserManagement';
import CategoryManagement from './pages/AdminDashboard/CategoryManagement';
import ProductApproval from './pages/AdminDashboard/ProductApproval';
import VendorPermissions from './pages/AdminDashboard/VendorPermissions';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* صفحات عامة */}
            <Route path="contact" element={<ContactUs />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="shipping" element={<ShippingInfo />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="returns" element={<ReturnPolicy />} />

            <Route element={<ProtectedRoute allowedRoles={['Customer']} />}>
              <Route path="cart" element={<Cart />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="my-orders" element={<MyOrders />} />
              <Route path="orders/:id" element={<OrderDetail />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Vendor']} />}>
              <Route path="vendor" element={<VendorDashboard />}>
                <Route index element={<Navigate to="products" replace />} />
                <Route path="products" element={<VendorProducts />} />
                <Route path="sales" element={<VendorSales />} />
                <Route path="statistics" element={<VendorStats />} />
                <Route path="notifications" element={<VendorNotifications />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="admin" element={<AdminDashboard />}>
                <Route index element={<Navigate to="users" replace />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="approvals" element={<ProductApproval />} />
                <Route path="permissions/:vendorId" element={<VendorPermissions />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;