import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import authBg from '../../assets/auth-bg.png';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);

  const handleRequestCode = () => {
    if (email) {
      setCodeRequested(true);
      alert('Reset code requested!');
    } else {
      alert('Please enter your email address.');
    }
  };

  const handleRetrieve = () => {
    if (!email || !resetCode || !password) {
      alert('All fields are required!');
      return;
    }
    alert('Account retrieved successfully!');
  };

  return (
    <div className="pt-20">
      <Navbar />
      <div className="flex items-center justify-center h-screen px-4">
        <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Left Image Section */}
          <div className="hidden md:block w-1/2 bg-gray-100 p-6">
            <img src={authBg} alt="Retrieve Account" className="w-full" />
          </div>

          {/* Right Form Section */}
          <div className="w-full md:w-1/2 p-8 text-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Retrieve Account
            </h2>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Email Address</label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a valid email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter reset code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
              />
              <button
                className="ml-2 px-4 py-3 text-xs whitespace-nowrap bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleRequestCode}
              >
                {codeRequested ? 'Code Sent' : 'Request Code'}
              </button>
            </div>

            <div className="mb-6 relative">
              <label className="block text-gray-600 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={handleRetrieve}
            >
              Retrieve
            </button>

            <p className="text-gray-600 mt-4 text-center">
              Do you remember your password?{' '}
              <Link to="/login" className="text-blue-600 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
