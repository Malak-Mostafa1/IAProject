import { Link, Outlet } from 'react-router-dom';

const VendorDashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* الشريط الجانبي - يمنع انكماشه ويمتد مع المحتوى */}
      <aside className="w-64 bg-gray-900 text-white p-6 flex-shrink-0">
        <h2 className="text-xl font-bold mb-6">Vendor Panel</h2>
        <nav className="space-y-2">
          <Link to="/vendor/products" className="block hover:text-primary-400">My Products</Link>
          <Link to="/vendor/sales" className="block hover:text-primary-400">Sales History</Link>
          <Link to="/vendor/statistics" className="block hover:text-primary-400">Statistics</Link>
          <Link to="/vendor/notifications" className="block hover:text-primary-400">Notifications</Link>
        </nav>
      </aside>
      {/* المحتوى الرئيسي - يأخذ المساحة المتبقية */}
      <main className="flex-1 p-8 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default VendorDashboard;