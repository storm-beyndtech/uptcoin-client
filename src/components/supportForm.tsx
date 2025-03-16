import React, { useState } from 'react';
import Alert from './UI/Alert';

const SupportForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.name || !formData.email || !formData.message) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Invalid email address.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setSuccess('Message sent successfully!');
      setLoading(false);
      setFormData({ name: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <div className="max-w-lg mx-auto p-6 my-10 bg-white max-lg:bg-transparent lg:shadow-lg rounded-2xl">
      <h2 className="max-lg:hidden text-3xl font-medium text-center text-white lg:text-gray-800 mb-4">
        Contact Us
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="name" className="label">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          className="input !mt-1 mb-5"
          required
        />

        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={handleChange}
          className="input !mt-1 mb-5"
          required
        />

        <label htmlFor="message" className="label">
          Message
        </label>
        <textarea
          name="message"
          rows={4}
          placeholder="Enter Your Message"
          value={formData.message}
          onChange={handleChange}
          className="input !mt-1 mb-5"
          required
        />

        {error && <Alert type="danger" message={error} />}
        {success && <Alert type="success" message={success} />}
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default SupportForm;
