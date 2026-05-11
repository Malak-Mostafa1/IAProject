import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-serif mb-6">Terms of Service</h1>
      <p className="text-gray-500 mb-6">Last updated: January 2026</p>

      <div className="bg-white shadow rounded-lg p-6 space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using StoreHub, you agree to be bound by these Terms of Service. If you do not agree, please do not use our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Account Registration</h2>
          <p>
            You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Purchases and Payments</h2>
          <p>
            All purchases are subject to product availability. Prices are listed in Egyptian Pounds (EGP) and may change without notice. We reserve the right to refuse or cancel any order at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Vendor Terms</h2>
          <p>
            Vendors are responsible for the accuracy of product listings and must comply with our Vendor Agreement. StoreHub reserves the right to remove products that violate our policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Use the site for any illegal purpose.</li>
            <li>Upload false or misleading product information.</li>
            <li>Interfere with the security or operation of the site.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Intellectual Property</h2>
          <p>
            All content on StoreHub, including logos, graphics, and text, is the property of StoreHub or its licensors and is protected by copyright laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
          <p>
            StoreHub is not liable for any indirect, incidental, or consequential damages arising from your use of the website or products purchased through it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. Continued use of the site after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Contact Information</h2>
          <p>
            For questions about these Terms, please contact us at{' '}
            <Link to="/contact" className="text-primary-600 hover:underline">legal@storehub.com</Link>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;