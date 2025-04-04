import { sendRequest } from '@/lib/sendRequest';
import { useState, FormEvent } from 'react';
import Alert from './UI/Alert';

interface UserData {
  email: string;
  invitationCode?: string;
  password: string;
}

export default function AddUserForm() {
  // Form state
  const [email, setEmail] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  // Form handling state
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  // Validate form inputs
  const validateForm = (): boolean => {
    if (!email) {
      setError('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!password) {
      setError('Password is required');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  // Clear form
  const handleClear = () => {
    setEmail('');
    setInvitationCode('');
    setPassword('');
    setPasswordConfirmation('');
  };

  // Submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const userData: UserData = {
        email,
        password,
      };

      // Only include invitation code if it exists
      if (invitationCode) {
        userData.invitationCode = invitationCode;
      }

      const { message } = await sendRequest('/auth/add-user', 'POST', userData);

      setSuccess(message || 'User added successfully');

      setTimeout(() => {
        handleClear();
        setSuccess(null);
      }, 3000);
    } catch (error: any) {
      setError(error.message || 'An error occurred while adding the user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-lg shadow-md bg-white dark:bg-bodydark2/50 transition-colors duration-200">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Add New User
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Email field */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-bodydark2/40 placeholder:opacity-40 dark:border-gray-800 dark:text-white"
            placeholder="user@example.com"
            required
          />
        </div>

        {/* Invitation code field */}
        <div className="mb-4">
          <label
            htmlFor="invitationCode"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Invitation Code{' '}
            <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            id="invitationCode"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-bodydark2/40 placeholder:opacity-40 dark:border-gray-800 dark:text-white"
            placeholder="Enter invitation code if available"
          />
        </div>

        {/* Password field */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-bodydark2/40 placeholder:opacity-40 dark:border-gray-800 dark:text-white"
            placeholder="Minimum 8 characters"
            required
            minLength={8}
          />
        </div>

        {/* Password confirmation field */}
        <div className="mb-6">
          <label
            htmlFor="passwordConfirmation"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="passwordConfirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-bodydark2/40 placeholder:opacity-40 dark:border-gray-800 dark:text-white"
            placeholder="Confirm your password"
            required
          />
        </div>

        {/* Action Buttons */}
        {error && <Alert message={error} type="danger" />}
        {success && <Alert message={success} type="success" />}

        {/* Form actions */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-bodydark2 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            disabled={loading}
          >
            Clear
          </button>

          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Adding User...' : 'Add User'}
          </button>
        </div>
      </form>
    </div>
  );
}
