import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 border-t-4 border-primary-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-extrabold mb-2 font-serif">
              Store<span className="text-primary-400">Hub</span>
            </h3>
            <p className="text-gray-300 text-sm">Premium shopping experience with luxury collection.</p>
          </div>
          <div>
            <h4 className="font-bold text-primary-400 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary-400 transition-colors">Products</Link></li>
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Categories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary-400 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-primary-400 transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-primary-400 transition-colors">Shipping Info</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary-400 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/returns" className="hover:text-primary-400 transition-colors">Return Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2026 StoreHub. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              {/* Social icons omitted for brevity */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;