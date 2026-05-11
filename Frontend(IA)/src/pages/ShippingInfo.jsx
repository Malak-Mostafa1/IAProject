import { Link } from 'react-router-dom';

const ShippingInfo = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-serif mb-6">Shipping Information</h1>
      
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">Delivery Options</h2>
          <p className="text-gray-600 mb-2">
            We offer several shipping methods to meet your needs:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li><strong>Standard Shipping:</strong> 3-5 business days – EGP 30</li>
            <li><strong>Express Shipping:</strong> 1-2 business days – EGP 60</li>
            <li><strong>Free Shipping:</strong> On orders over EGP 500 (Standard only)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Order Processing</h2>
          <p className="text-gray-600">
            Orders are processed within 24 hours (excluding weekends and holidays). You will receive a confirmation email once your order has been shipped.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Tracking Your Order</h2>
          <p className="text-gray-600">
            A tracking number will be provided via email once your package is dispatched. You can also track your order status from your account dashboard.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Shipping Restrictions</h2>
          <p className="text-gray-600">
            Currently we only deliver within Egypt. We do not ship to P.O. boxes or military addresses.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">International Shipping</h2>
          <p className="text-gray-600">
            International shipping is not available at this time. We plan to expand to other countries in the near future.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Need Help?</h2>
          <p className="text-gray-600">
            If you have any questions about shipping, please{' '}
            <Link to="/contact" className="text-primary-600 hover:underline">
              contact our support team
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ShippingInfo;