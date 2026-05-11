import { useEffect, useState } from 'react';
import { productApi } from '../../api/product';
import toast from 'react-hot-toast';

const ProductApproval = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingProducts = async () => {
    setLoading(true);
    try {
      const res = await productApi.getAllAdmin();
      console.log('All products from API (admin):', res.data);
      
      const pending = res.data.filter(p => !p.isApproved);
      console.log('Filtered pending products:', pending);
      
      setProducts(pending);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const handleApprove = async (id) => {
    try {
      await productApi.approve(id);
      toast.success('Product approved');
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await productApi.reject(id);
      toast.success('Product rejected and removed');
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      toast.error('Rejection failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-serif">Pending Product Approvals</h1>
        <button
          onClick={fetchPendingProducts}
          className="text-primary-600 hover:text-primary-800 font-medium transition-colors"
        >
          Refresh
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No pending products to approve.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
                <p className="text-primary-600 font-bold text-xl mb-2">EGP {product.price}</p>
                <p className="text-gray-600 text-sm mb-1 line-clamp-2">{product.description}</p>
                <p className="text-sm text-gray-500">
                  Stock: {product.stockQuantity} | Category: {product.categoryName || product.categoryId}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Vendor: {product.vendorName || 'Unknown Vendor'}
                </p>
                
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleApprove(product.id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(product.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
                  >
                    Reject
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

export default ProductApproval;