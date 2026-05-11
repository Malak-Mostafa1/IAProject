import { useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'How do I place an order?',
    answer: 'Simply browse our products, add items to your cart, and proceed to checkout. You\'ll need to be logged in as a customer to complete the purchase.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard), PayPal, and cash on delivery within Egypt.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order is shipped, you will receive a tracking number via email. You can also view your order status in the "My Orders" section of your account.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 14-day return policy for most items. Products must be unused and in original packaging. Please visit our Return Policy page for more details.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently we only ship within Egypt. We\'re working on expanding to other countries soon!',
  },
  {
    question: 'How can I become a vendor?',
    answer: 'You can register as a vendor directly from the registration page. Your account will be reviewed by our admin team, and once approved, you can start listing products.',
  },
  {
    question: 'I forgot my password. What should I do?',
    answer: 'Click on "Login" and then "Forgot Password". You\'ll receive an email with instructions to reset your password.',
  },
  {
    question: 'Are my personal details secure?',
    answer: 'Yes, we use industry-standard encryption to protect your data. We never share your information with third parties without your consent.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-serif mb-6 text-center">Frequently Asked Questions</h1>
      <p className="text-gray-600 text-center mb-10">
        Find answers to common questions about StoreHub.
      </p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white shadow rounded-lg border border-gray-200">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
            >
              <span className="font-semibold text-gray-800">{faq.question}</span>
              <span className="text-primary-600 text-xl">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-600 border-t border-gray-100 pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600">Still have questions?</p>
        <Link
          to="/contact"
          className="inline-block mt-3 text-primary-600 font-medium hover:underline"
        >
          Contact our support team →
        </Link>
      </div>
    </div>
  );
};

export default FAQ;