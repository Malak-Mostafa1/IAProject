import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderApi } from '../api/order';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder(parseInt(id));
    }
  }, [id]);

  const fetchOrder = async (orderId) => {
    try {
      const res = await orderApi.getById(orderId);
      setOrder(res.data);
    } catch (err) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!order) return <div className="p-8 text-center">Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/" className="text-primary-600 hover:underline">← Back to Home</Link>
        <h1 className="text-2xl font-bold font-serif">Order Details #{order.id}</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-500">Status</p>
            <span className={`px-2 py-1 text-sm rounded-full ${
              order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {order.status}
            </span>
          </div>
          <div>
            <p className="text-gray-500">Date</p>
            <p className="font-semibold">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <h2 className="text-lg font-bold mb-4 border-t pt-4">Items</h2>
        <div className="space-y-4">
          {order.orderItems.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{item.productTitle}</p>
                <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
              </div>
              <p className="font-bold">EGP {(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="border-t mt-6 pt-4 flex justify-between items-center text-xl font-bold">
          <span>Total</span>
          <span>EGP {order.total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-gray-500">Thank you for shopping with StoreHub!</p>
      </div>
    </div>
  );
};

export default OrderDetail;