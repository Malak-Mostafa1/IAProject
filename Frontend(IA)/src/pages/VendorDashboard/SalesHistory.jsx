import { useEffect, useState } from 'react';
import { orderApi } from '../../api/order';
import toast from 'react-hot-toast';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await orderApi.getVendorSalesHistory();
      console.log('Sales data from API:', res.data);
      setSales(res.data);
    } catch (err) {
      toast.error('Failed to load sales history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const totalRevenue = sales.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 font-serif">Sales History</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <p className="text-lg">
          Total Revenue: <span className="font-bold">EGP {totalRevenue.toFixed(2)}</span>
        </p>
        <p className="text-gray-600">Total Items Sold: {sales.length}</p>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((item, index) => {
              const price = Number(item.price) || 0;
              const quantity = Number(item.quantity) || 0;
              const rowTotal = price * quantity;
              const dateValue = item.orderDate || item.createdAt;
              
              return (
                <tr key={`${item.orderId}-${item.productId}-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap">#{item.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(dateValue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.productTitle || 'Unknown Product'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">EGP {price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">EGP {rowTotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sales.length === 0 && (
          <p className="text-center py-8 text-gray-500">No sales recorded yet.</p>
        )}
      </div>
    </div>
  );
};

export default SalesHistory;