import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-primary-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-3xl font-extrabold text-primary-500 tracking-tight font-serif">
          Store<span className="text-gray-900">Hub</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">Home</Link>
          <Link to="/products" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">Products</Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              {user?.role === 'Customer' && (
                <>
                  <Link to="/cart" className="text-gray-700 hover:text-primary-500 font-medium transition-colors flex items-center gap-1">
                    Cart
                  </Link>
                  <Link to="/favorites" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">
                    Favorites
                  </Link>
                  <Link to="/my-orders" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">
                    My Orders
                  </Link>
                </>
              )}
              {user?.role === 'Vendor' && (
                <div className="flex items-center gap-4">
                  <Link to="/vendor/products" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">Products</Link>
                  <Link to="/vendor/sales" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">Sales</Link>
                  <Link to="/vendor/statistics" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">Stats</Link>
                  <Link to="/vendor/notifications" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">Notifications</Link>
                </div>
              )}
              {user?.role === 'Admin' && (
                <div className="flex items-center gap-4">
                  <Link to="/admin/users" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">Users</Link>
                  <Link to="/admin/categories" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">Categories</Link>
                  <Link to="/admin/approvals" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">Approvals</Link>
                </div>
              )}
              
              <div className="h-6 w-px bg-gray-200 mx-2"></div>
              
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-semibold bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                  Hi, {user?.fullName}
                </span>
                <button 
                  onClick={logout} 
                  className="text-red-500 hover:text-red-700 font-bold transition-colors text-sm uppercase tracking-wider"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-700 hover:text-primary-500 font-bold transition-colors">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-primary-500 text-white px-6 py-2.5 rounded-full font-bold hover:bg-primary-600 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;