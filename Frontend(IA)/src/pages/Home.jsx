import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { productApi } from '../api/product';
import { categoryApi } from '../api/category';
import ProductCard from '../components/common/ProductCard';
import CategoryFilter from '../components/common/CategoryFilter';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    productApi.getAll().then(res => setFeaturedProducts(res.data.filter(p => p.isApproved).slice(0, 6)));
    categoryApi.getAll().then(res => setCategories(res.data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white mb-12">
        <h1 className="text-4xl font-bold mb-2 font-serif">Welcome to StoreHub</h1>
        <p className="text-lg opacity-90 mb-6">
          Discover premium electronics from trusted vendors. Quality products, exceptional prices.
        </p>
        <button 
          onClick={() => navigate("/products")}
          className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Shop Now →
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6 font-serif">Browse Categories</h2>
      <CategoryFilter 
        categories={categories} 
        selectedId={null} 
        onChange={(id) => navigate(`/products${id ? `?category=${id}` : ''}`)} 
      />

      <div className="flex justify-between items-center mt-12 mb-6">
        <h2 className="text-2xl font-bold font-serif">Featured Products</h2>
        <Link to="/products" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;