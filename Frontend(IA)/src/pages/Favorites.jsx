import { useEffect, useState } from 'react';
import { favoriteApi } from '../api/favorite';
import { cartApi } from '../api/cart';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await favoriteApi.getFavorites();
      setFavorites(res.data);
    } catch (err) {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await favoriteApi.removeFromFavorites(productId);
    } catch (err) {
      console.warn('Remove favorite API error:', err.response?.status, err.response?.data);
    } finally {
      setFavorites(prev => prev.filter(p => p.id !== productId));
      toast.success('Removed from favorites');
    }
  };

  const handleAddToCart = async (product) => {
    if (product.stockQuantity <= 0) {
      toast.error('This product is out of stock');
      return;
    }

    try {
      await cartApi.addToCart(product.id, 1);
      toast.success('Added to cart');
      
      try {
        await favoriteApi.removeFromFavorites(product.id);
      } catch (err) {
        console.warn('Remove from favorites after add to cart failed:', err);
      }
      setFavorites(prev => prev.filter(p => p.id !== product.id));
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.response?.data || 'Failed to add to cart';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Failed to add to cart');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 font-serif">My Favorites</h1>
      
      {favorites.length === 0 ? (
        <p className="text-gray-500">You have no favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(product => (
            <div key={product.id} className="bg-white shadow rounded-lg overflow-hidden">
              <Link to={`/products/${product.id}`}>
                <img src={product.imageUrl} alt={product.title} className="w-full h-48 object-cover" />
              </Link>
              <div className="p-4">
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-semibold text-lg hover:text-primary-600">{product.title}</h3>
                </Link>
                <p className="text-primary-600 font-bold mt-1">EGP {product.price}</p>
                <p className={`text-sm ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stockQuantity > 0 ? `In Stock: ${product.stockQuantity}` : 'Out of Stock'}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stockQuantity <= 0}
                    className={`flex-1 py-2 rounded font-medium transition-colors ${
                      product.stockQuantity > 0
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;