import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import authBg from '../../assets/auth-bg.png';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);

  const handleRequestCode = () => {
    if (email) {
      setCodeRequested(true);
      alert('Confirmation code requested!');
    } else {
      alert('Please enter your email address.');
    }
  };

  const handleRegister = () => {
    if (!email || !confirmationCode || !password || !confirmPassword) {
      alert('All fields are required except referral code!');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Registration successful!');
  };

  return (
    <div className="pt-20">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-10">
        <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg">
          <div className="hidden md:block w-1/2 bg-gray-100 p-6">
            <img src={authBg} alt="Register" className="w-full" />
          </div>

          <div className="w-full md:w-1/2 p-8 text-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Register
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

            <div className="mb-4 flex items-center">
              <input
                type="text"
                className="input"
                placeholder="Enter confirmation code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
              />
              <button
                className="ml-2 px-4 py-3 text-xs whitespace-nowrap bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleRequestCode}
              >
                {codeRequested ? 'Code Sent' : 'Request Code'}
              </button>
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-600 mb-2">Password</label>
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
              <label className="block text-gray-600 mb-2">
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
              <label className="block text-gray-600 mb-2">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                className="input"
                placeholder="Enter referral code (if any)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
              />
            </div>

            <button
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={handleRegister}
            >
              Register
            </button>

            <p className="text-gray-600 mt-4 text-center">
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
