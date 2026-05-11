import { useState } from 'react';
import toast from 'react-hot-toast';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // محاكاة إرسال البيانات (يمكن استبدالها بـ API حقيقية)
    setTimeout(() => {
      toast.success('Your message has been sent! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-serif mb-6">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Have questions or feedback? We'd love to hear from you. Fill out the form below and our team will respond as soon as possible.
      </p>

      

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-primary-600 text-2xl mb-2">📍</div>
          <h3 className="font-semibold mb-1">Address</h3>
          <p className="text-gray-600">123 StoreHub Street, Cairo, Egypt</p>
        </div>
        <div className="text-center">
          <div className="text-primary-600 text-2xl mb-2">📞</div>
          <h3 className="font-semibold mb-1">Phone</h3>
          <p className="text-gray-600">+20 106 794 4994</p>
        </div>
        <div className="text-center">
          <div className="text-primary-600 text-2xl mb-2">✉️</div>
          <h3 className="font-semibold mb-1">Email</h3>
          <p className="text-gray-600">support@storehub.com</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;