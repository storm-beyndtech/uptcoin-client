import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import authBg from '../../assets/auth-bg.png';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      alert('All fields are required!');
      return;
    }
    alert('Login successful!');
  };

  return (
    <div className="pt-20">
      <Navbar />
      <div className="flex items-center justify-center  py-10 px-4">
        <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg">
          {/* Left Image Section */}
          <div className="hidden md:block w-1/2 bg-gray-100 p-6">
            <img src={authBg} alt="Login" className="w-full" />
          </div>

          {/* Right Form Section */}
          <div className="w-full md:w-1/2 p-8 text-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Sign In
            </h2>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Email Address</label>
              <input
                type="email"
                className="input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-6 relative">
              <label className="block text-gray-600 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="Enter your password"
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
              onClick={handleLogin}
            >
              Sign In
            </button>

            <p className="text-gray-600 mt-4 text-center">
              Don’t have an account?{' '}
              <Link to="/register" className="text-blue-600 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
