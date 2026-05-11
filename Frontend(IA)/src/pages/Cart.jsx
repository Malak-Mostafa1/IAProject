import { useEffect, useState } from 'react';
import { cartApi } from '../api/cart';
import { orderApi } from '../api/order';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await cartApi.getCart();
      setCartItems(res.data);
    } catch (err) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await cartApi.removeFromCart(productId);
      setCartItems(prev => prev.filter(item => item.productId !== productId));
      toast.success('Item removed');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to place this order?');
    if (!confirmed) return;

    setCheckingOut(true);
    try {
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const res = await orderApi.checkout(orderItems);
      
      setCartItems([]);
      toast.success('Order placed successfully!');
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      let errorMsg = 'Checkout failed';
      const responseData = err?.response?.data;
      if (typeof responseData === 'string') {
        errorMsg = responseData;
      } else if (responseData && typeof responseData === 'object' && responseData.message) {
        errorMsg = responseData.message;
      } else if (err?.message) {
        errorMsg = err.message;
      }
      toast.error(errorMsg);
    } finally {
      setCheckingOut(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 font-serif">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg divide-y">
            {cartItems.map(item => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                <img src={item.productImageUrl} alt={item.productTitle} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.productTitle}</h3>
                  <p className="text-gray-600">EGP {item.price} x {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">EGP {(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="text-red-600 text-sm hover:text-red-800 font-semibold transition-colors mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>EGP {total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="mt-4 w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-bold transition-all shadow-md hover:shadow-lg"
            >
              {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;