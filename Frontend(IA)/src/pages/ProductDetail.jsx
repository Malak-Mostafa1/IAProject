import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productApi } from '../api/product';
import { reviewApi } from '../api/review';
import { cartApi } from '../api/cart';
import { favoriteApi } from '../api/favorite';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  const [isInCart, setIsInCart] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id));
      fetchReviews(parseInt(id));
      if (isAuthenticated && user?.role === 'Customer') {
        checkCartAndFavorites(parseInt(id));
      }
    }
  }, [id, isAuthenticated, user]);

  const fetchProduct = async (productId) => {
    try {
      const res = await productApi.getById(productId);
      setProduct(res.data);
    } catch (err) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId) => {
    try {
      const res = await reviewApi.getForProduct(productId);
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to load reviews');
    }
  };

  const checkCartAndFavorites = async (productId) => {
    try {
      const [cartRes, favRes] = await Promise.all([
        cartApi.getCart(),
        favoriteApi.getFavorites()
      ]);
      
      const cartItems = cartRes.data;
      const favProducts = favRes.data;
      
      setIsInCart(cartItems.some(item => item.productId === productId));
      setIsInFavorites(favProducts.some(p => p.id === productId));
    } catch (err) {
      console.error('Failed to check cart/favorites status');
    }
  };

  const handleCartAction = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first');
      return;
    }
    if (user?.role !== 'Customer') {
      toast.error('Customer can only add to cart.');
      return;
    }
    if (!product) return;

    setCartLoading(true);
    try {
      if (isInCart) {
        await cartApi.removeFromCart(product.id);
        toast.success('Removed from cart');
        setIsInCart(false);
      } else {
        await cartApi.addToCart(product.id, quantity);
        toast.success('Added to cart');
        setIsInCart(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setCartLoading(false);
    }
  };

  const handleFavoriteAction = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first');
      return;
    }
    if (user?.role !== 'Customer') {
      toast.error('Customer can only add to favorites.');
      return;
    }
    if (!product) return;

    setFavLoading(true);
    try {
      if (isInFavorites) {
        await favoriteApi.removeFromFavorites(product.id);
        toast.success('Removed from favorites');
        setIsInFavorites(false);
      } else {
        await favoriteApi.addToFavorites(product.id);
        toast.success('Added to favorites');
        setIsInFavorites(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setFavLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login first');
      return;
    }
    if (user?.role !== 'Customer') {
      toast.error('Only customers can review products.');
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewApi.addReview({
        productId: product.id,
        rating: newReview.rating,
        comment: newReview.comment,
      });
      toast.success('Review submitted');
      setNewReview({ rating: 5, comment: '' });
      fetchReviews(product.id);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit review';
      toast.error(errorMsg);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-8 text-center">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.imageUrl} alt={product.title} className="w-full rounded-lg shadow" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-serif">{product.title}</h1>
          <p className="text-2xl text-primary-600 font-bold mt-2">EGP {product.price}</p>
          <p className="text-gray-600 mt-4">{product.description}</p>
          <p className="mt-2">Stock: {product.stockQuantity > 0 ? `${product.stockQuantity} available` : 'Out of stock'}</p>
          <p className="text-sm text-gray-500 mt-1">Vendor: {product.vendorName || 'Unknown Vendor'}</p>
          <p className="text-sm text-gray-500">Views: {product.viewsCount}</p>
          
          {product.stockQuantity > 0 && (
            <div className="mt-6 flex items-center gap-4">
              <input
                type="number"
                min="1"
                max={product.stockQuantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-20 border rounded px-3 py-2"
                disabled={cartLoading}
              />
              <button
                onClick={handleCartAction}
                disabled={cartLoading}
                className={`px-6 py-2 rounded text-white font-medium transition-colors ${
                  isInCart 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-primary-500 hover:bg-primary-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {cartLoading ? '...' : (isInCart ? 'Remove from Cart' : 'Add to Cart')}
              </button>
              <button
                onClick={handleFavoriteAction}
                disabled={favLoading}
                className={`border px-4 py-2 rounded transition-colors ${
                  isInFavorites
                    ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
                    : 'border-gray-300 hover:bg-gray-100'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {favLoading ? '...' : (isInFavorites ? '❤️' : '♡')}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 font-serif">Customer Reviews</h2>
        
        {user?.role === 'Customer' && (
          <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <div className="mb-4">
              <label className="block mb-1">Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                className="border rounded px-3 py-2"
              >
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r>1?'s':''}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Comment</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full border rounded px-3 py-2"
                rows={3}
                required
              />
            </div>
            <button
              type="submit"
              disabled={submittingReview}
              className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 disabled:opacity-50"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{review.userName}</span>
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span>
                  <span className="text-gray-400 text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;