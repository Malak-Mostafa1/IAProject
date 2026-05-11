import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <Link to={`/products/${product.id}`}>
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-primary-100 hover:border-primary-300 cursor-pointer h-full flex flex-col">
      <div className="relative overflow-hidden bg-gray-100 h-56 flex items-center justify-center">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-primary-600 transition-colors">
          {product.title}
        </h3>
        <div className="mt-auto pt-3 border-t border-primary-100">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-primary-600">
              EGP {product.price}
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Price
            </span>
          </div>
        </div>
        <button className="mt-4 w-full bg-primary-500 text-white font-bold py-2.5 rounded-lg hover:bg-primary-600 transition-all active:scale-95 shadow-md hover:shadow-lg">
          View Details
        </button>
      </div>
    </div>
  </Link>
);

export default ProductCard;