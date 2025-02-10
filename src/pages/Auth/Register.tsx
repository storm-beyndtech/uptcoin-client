import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import authBg from '../../assets/auth-bg.png';
import Navbar from '@/components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { sendRequest } from '@/lib/sendRequest';
import Btn from '@/components/UI/Btn';
import Alert from '@/components/UI/Alert';
import { contextData } from '@/context/AuthContext';

export default function Register() {
  const { login } = contextData();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referral, setReferral] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Step 2: Request the verification code
  const requestCode = async () => {
    if (email.length < 6)
      return setError('Please enter your email to get the code.');
    setLoadingCode(true);
    setError(null);

    try {
      const res = await sendRequest('/auth/registration-code', 'POST', {
        email,
      });
      setSuccess(res.message);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoadingCode(false);
    }
  };

  // Step 3: Register the user after receiving the code
  const handleRegister = async () => {
    if (email.length < 8 || !email.includes('@'))
      return setError('Invalid Email');
    if (password.length < 6)
      return setError('Password must be atleast 6 characters');
    if (confirmPassword !== password) return setError('Password Must Match');

    setLoadingRegister(true);
    setError(null);
    setSuccess(null);

    try {
      const { user, token, message } = await sendRequest(
        '/auth/register',
        'POST',
        {
          email,
          password,
          code,
          referral,
        },
      );

      setSuccess(message);

      setTimeout(() => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        login(user);
        navigate('/dashboard');
      }, 3000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <div className="py-20 max-lg:bg-bodydark1">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-10">
        <div className="flex w-full max-w-4xl bg-white max-lg:bg-bodydark1 shadow-lg rounded-lg">
          <div className="hidden md:block w-1/2 bg-gray-100 p-6">
            <img src={authBg} alt="Register" className="w-full" />
          </div>

          <div className="w-full md:w-1/2 lg:p-8 text-sm">
            <h2 className="text-2xl font-semibold text-gray-800 max-lg:text-white/90 mb-6">
              Register
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

            <div className="mb-4 flex items-center relative">
              <input
                type="text"
                className="input pr-16"
                placeholder="Enter confirmation code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <div className="absolute right-[2.5px]">
                <Btn
                  onClick={requestCode}
                  label="Request"
                  disabled={loadingCode}
                  type="primary"
                />
              </div>
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-600 max-lg:text-white/30 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input"
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

            <div className="mb-4 relative">
              <label className="block text-gray-600 max-lg:text-white/30 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 max-lg:text-white/30 mb-2">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                className="input"
                placeholder="Enter referral code (if any)"
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
              />
            </div>

            {error && <Alert message={error} type="danger" />}
            {success && <Alert message={success} type="success" />}
            <Btn
              className="w-full"
              onClick={handleRegister}
              label="Register"
              disabled={loadingRegister}
              type="auth"
            />

            <p className="text-gray-600 max-lg:text-white/30 mt-4 text-center">
              Already have an account?{' '}
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
