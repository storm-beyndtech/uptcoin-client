import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import authBg from '../../assets/auth-bg.png';
import Navbar from '@/components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { sendRequest } from '@/lib/sendRequest';
import Btn from '@/components/UI/Btn';
import Alert from '@/components/UI/Alert';
import { contextData } from '@/context/AuthContext';

export default function Login() {
  const { login } = contextData();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async () => {
    if (email.length < 8 || !email.includes('@'))
      return setError('Invalid Email');
    if (password.length < 6)
      return setError('Password must be atleast 6 characters');

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { user, token, message } = await sendRequest(
        '/auth/login',
        'POST',
        {
          email,
          password,
        },
      );

      setSuccess(message);

      setTimeout(() => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        login(user);
        navigate('/dashboard');
      }, 1000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 max-lg:bg-bodydark1 max-lg:min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center  py-10 px-4">
        <div className="flex w-full max-w-4xl bg-white max-lg:bg-bodydark1 shadow-lg rounded-lg">
          {/* Left Image Section */}
          <div className="hidden md:block w-1/2 bg-gray-100 p-6">
            <img src={authBg} alt="Login" className="w-full" />
          </div>

          {/* Right Form Section */}
          <div className="w-full md:w-1/2 p-4 lg:p-8 text-sm">
            <h2 className="text-2xl font-semibold text-gray-800 max-lg:text-white/90 mb-6">
              Sign In
            </h2>

            <div className="mb-4">
              <label className="block text-gray-600 max-lg:text-white/30 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-6 relative">
              <label className="flex justify-between text-gray-600 max-lg:text-white/30 mb-2">
                <span>Password</span>
                <Link to="/password-reset">Forgot Password?</Link>
              </label>
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

            {error && <Alert message={error} type="danger" />}
            {success && <Alert message={success} type="success" />}
            <Btn
              className="w-full"
              onClick={handleLogin}
              label="Sign in"
              disabled={loading}
              type="auth"
            />

            <p className="text-gray-600 max-lg:text-white/30 mt-4 text-center">
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
