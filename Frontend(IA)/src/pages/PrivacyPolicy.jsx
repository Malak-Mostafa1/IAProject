import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-serif mb-6">Privacy Policy</h1>
      <p className="text-gray-500 mb-6">Last updated: January 2026</p>

      <div className="bg-white shadow rounded-lg p-6 space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
          <p>
            Welcome to StoreHub. We respect your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Personal Data:</strong> Name, email address, phone number, and shipping address.</li>
            <li><strong>Account Data:</strong> Username, password, and purchase history.</li>
            <li><strong>Payment Data:</strong> Payment details are processed securely by our payment providers; we do not store full credit card numbers.</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent on the site, and other analytics.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Process and fulfill your orders.</li>
            <li>Communicate with you about your account or orders.</li>
            <li>Improve our website and services.</li>
            <li>Send promotional emails (you can opt out at any time).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Sharing Your Information</h2>
          <p>
            We do not sell or rent your personal information. We may share your data with third parties only to provide our services (e.g., shipping carriers, payment processors) or as required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data. However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal data. To exercise these rights, please contact us at privacy@storehub.com.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{' '}
            <Link to="/contact" className="text-primary-600 hover:underline">support@storehub.com</Link>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;