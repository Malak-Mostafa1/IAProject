import { Link } from 'react-router-dom';

const ReturnPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-serif mb-6">Return Policy</h1>
      <p className="text-gray-500 mb-6">Last updated: January 2026</p>

      <div className="bg-white shadow rounded-lg p-6 space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Return Window</h2>
          <p>
            We offer a 14-day return policy for most items. The return period begins on the date the order is delivered.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Eligibility for Returns</h2>
          <p>To be eligible for a return, items must be:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Unused and in the same condition as received.</li>
            <li>In the original packaging with all tags attached.</li>
            <li>Accompanied by the receipt or proof of purchase.</li>
          </ul>
          <p className="mt-2">
            <strong>Non-returnable items:</strong> Gift cards, downloadable software, and personalized products.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. How to Initiate a Return</h2>
          <p>
            To start a return, please contact our support team at{' '}
            <Link to="/contact" className="text-primary-600 hover:underline">returns@storehub.com</Link> with your order number and reason for return. 
            We will provide you with a return shipping label (if applicable) and further instructions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Refunds</h2>
          <p>
            Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. 
            Approved refunds will be processed to your original payment method within 5-7 business days.
          </p>
          <p className="mt-2">
            Shipping costs are non-refundable unless the return is due to our error (e.g., defective or wrong item).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Exchanges</h2>
          <p>
            If you need to exchange an item for a different size or color, please contact us. Exchanges are subject to stock availability.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Damaged or Defective Items</h2>
          <p>
            If you receive a damaged or defective item, please contact us within 48 hours of delivery. We will arrange a replacement or full refund at no additional cost.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
          <p>
            For any return-related questions, please reach out to our support team at{' '}
            <Link to="/contact" className="text-primary-600 hover:underline">support@storehub.com</Link>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ReturnPolicy;