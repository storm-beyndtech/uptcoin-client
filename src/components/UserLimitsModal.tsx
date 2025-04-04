import React, { useState, useEffect } from 'react';
import { X, Save, Loader } from 'lucide-react';
import { sendRequest } from '@/lib/sendRequest';
import Alert from './UI/Alert';

// TypeScript interface for user limits
interface IUserLimit {
  _id: string;
  uid: string;
  email: string;
  minDeposit: number;
  maxDeposit: number;
  minWithdrawal: number;
  maxWithdrawal: number;
}

// Props for the modal component
interface UserLimitsModalProps {
  user: IUserLimit;
  setIsModalOpen: any;
}

const UserLimitsModal = ({ user, setIsModalOpen }: UserLimitsModalProps) => {
  // Form state
  const [formData, setFormData] = useState({
    minDeposit: 0,
    maxDeposit: 0,
    minWithdrawal: 0,
    maxWithdrawal: 0,
  });

  // Form handling state
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  // Set initial form data from user prop
  useEffect(() => {
    if (user) {
      setFormData({
        minDeposit: user.minDeposit,
        maxDeposit: user.maxDeposit,
        minWithdrawal: user.minWithdrawal,
        maxWithdrawal: user.maxWithdrawal,
      });
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value),
    });
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Validate form data
    if (
      formData.minDeposit < 0 ||
      formData.maxDeposit < 0 ||
      formData.minWithdrawal < 0 ||
      formData.maxWithdrawal < 0
    ) {
      setError('All values must be positive numbers');
      setLoading(false);
      return;
    }

    if (formData.minDeposit > formData.maxDeposit) {
      setError('Minimum deposit cannot be greater than maximum deposit');
      setLoading(false);
      return;
    }

    if (formData.minWithdrawal > formData.maxWithdrawal) {
      setError('Minimum withdrawal cannot be greater than maximum withdrawal');
      setLoading(false);
      return;
    }

    try {
      // Send request to update user limits
      const { message } = await sendRequest(
        `/auth/update-user/${user._id}`,
        'PUT',
        formData,
      );

      // Show success message
      setSuccess(message as string);

      // Close modal after 3 seconds
      setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000000] bg-black bg-opacity-50 customBlur flex items-center justify-center">
      <div className="bg-white dark:bg-bodydark1 rounded-lg shadow-xl w-full max-w-md p-6 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Update Limit
          </h3>
          <button
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => setIsModalOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* User information */}
        <div className="mb-6 p-3 bg-gray-50 dark:bg-bodydark2/50 rounded-md">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>User ID:</strong> {user.uid.substring(0, 6)}...
            {user.uid.substring(user.uid.length - 4)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Deposit
              </label>
              <input
                type="number"
                name="minDeposit"
                value={formData.minDeposit}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-bodydark2/50 text-gray-700 dark:text-white"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Deposit
              </label>
              <input
                type="number"
                name="maxDeposit"
                value={formData.maxDeposit}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-bodydark2/50 text-gray-700 dark:text-white"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          {/* Withdrawal Limits */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Withdrawal
              </label>
              <input
                type="number"
                name="minWithdrawal"
                value={formData.minWithdrawal}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-bodydark2/50 text-gray-700 dark:text-white"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Withdrawal
              </label>
              <input
                type="number"
                name="maxWithdrawal"
                value={formData.maxWithdrawal}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-bodydark2/50 text-gray-700 dark:text-white"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          {error && <Alert message={error} type="danger" />}
          {success && <Alert message={success} type="success" />}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={12} />
                  Processing...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-1" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLimitsModal;
