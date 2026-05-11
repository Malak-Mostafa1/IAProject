import { useEffect, useState } from 'react';
import { orderApi } from '../../api/order';
import toast from 'react-hot-toast';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await orderApi.getVendorStatistics();
      const data = res.data;
      
      const safeStats = {
        totalProducts: data.totalProducts ?? 0,
        totalOrders: data.totalOrders ?? data.totalOrdersCount ?? 0,
        totalRevenue: data.totalRevenue ?? 0,
        averageRating: data.averageRating ?? 0,
        topSellingProducts: data.topSellingProducts || [],
      };
      setStats(safeStats);
    } catch (err) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!stats) return <div className="p-8 text-center">No data available</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 font-serif">Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold">EGP {stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500 text-sm">Average Rating</p>
          <p className="text-3xl font-bold">{stats.averageRating.toFixed(1)} ★</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
        {stats.topSellingProducts.length === 0 ? (
          <p className="text-gray-500">No sales yet</p>
        ) : (
          <ul className="divide-y">
            {stats.topSellingProducts.map((p) => (
              <li key={p.productId} className="py-2 flex justify-between">
                <span>{p.title}</span>
                <span className="font-medium">{p.soldQuantity} sold</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Statistics;