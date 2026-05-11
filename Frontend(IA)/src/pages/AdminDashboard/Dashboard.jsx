import { Link, Outlet } from 'react-router-dom';

const AdminDashboard = () => (
  <div className="flex min-h-screen">
    <aside className="w-64 bg-gray-900 text-white p-6">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        <Link to="/admin/users" className="block hover:text-primary-400">User Management</Link>
        <Link to="/admin/categories" className="block hover:text-primary-400">Category Management</Link>
        <Link to="/admin/approvals" className="block hover:text-primary-400">Product Approval</Link>
      </nav>
    </aside>
    <main className="flex-1 p-8 bg-gray-100">
      <Outlet />
    </main>
  </div>
);

export default AdminDashboard;