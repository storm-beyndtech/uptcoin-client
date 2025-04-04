import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Mail,
  Calendar,
  Key,
  AlertTriangle,
  RefreshCw,
  UserIcon,
} from 'lucide-react';
import { User } from '@/types/types';
import { sendRequest } from '@/lib/sendRequest';
import Alert from '@/components/UI/Alert';
import KYCAdminModal from '@/components/KycAdminModal';

const ManageSingleUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [KYCModal, setKYCModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleShowKycModal = (status: string) => {
    if (status === 'notSubmitted' || status === 'rejected') return;
    setKYCModal(true);
  };

  //Fetch single user
  const fetchUser = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const { user } = await sendRequest(`/auth/users/${id}`, 'GET');
      setUser(user);
      setFormData(user);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData({
      ...formData,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setSuccess('');
      setError('');

      // This would be replaced with an actual API call
      const { user, message } = await sendRequest(
        `/auth/update-user/${id}`,
        'PUT',
        formData,
      );
      setUser({ ...user, ...formData } as User);
      setSuccess(message);
    } catch (error: any) {
      console.error('Failed to update user:', error);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      // This would be replaced with an actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSuccess('Password reset email sent to user');
    } catch (error) {
      setError('Failed to send password reset email');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500 border border-green-400';
      case 'suspended':
        return 'text-yellow-500 border border-yellow-400';
      case 'deactivated':
        return 'text-red-500 border border-red-400';
      default:
        return 'text-gray-500 border border-gray-400';
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-500 border border-green-400';
      case 'pending':
        return 'text-yellow-500 border border-yellow-400';
      case 'rejected':
        return 'text-red-500 border border-red-400';
      default:
        return 'text-gray-500 border border-gray-400';
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-bodydark2/40 rounded-lg shadow-lg p-6 max-w-4xl mx-auto mt-10 flex justify-center items-center h-64">
        <RefreshCw size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  // Handle case where user is not found
  if (!user) {
    return (
      <div className="bg-white dark:bg-bodydark2/40 rounded-lg shadow-lg p-6 max-w-4xl mx-auto mt-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/users')}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              User Not Found
            </h2>
          </div>
        </div>
        <div className="text-center py-8">
          <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
          <p className="text-lg text-gray-600 dark:text-gray-300">
            The requested user could not be found.
          </p>
          <button
            onClick={() => navigate('/admin/users')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return to Users List
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-bodydark2/40 rounded-lg shadow-lg p-6 max-w-4xl mx-auto mt-10 relative">
        <div
          className="w-fit flex items-center mx-auto mb-10"
          onClick={() => handleShowKycModal(user.kycStatus)}
        >
          <span
            className={`inline-flex items-center px-3 py-1 cursor-pointer capitalize rounded-full text-sm font-medium ${getKycStatusColor(
              user.kycStatus,
            )} bg-opacity-10`}
          >
            Kyc: {user.kycStatus}
          </span>
        </div>

        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/manage-users')}
              className="mr-4 p-2 rounded-full dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              User Details
            </h2>
          </div>

          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                user.accountStatus,
              )} bg-opacity-10`}
            >
              {user.accountStatus}
            </span>
          </div>
        </div>

        {/* User form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info Section */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 border-b dark:border-gray-800 pb-2">
                Basic Information
              </h3>
            </div>

            {/* UID */}
            <div className="space-y-2 max-md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                User ID
              </label>
              <div className="flex items-center bg-gray-100 dark:bg-bodydark2/30 p-3 rounded-lg">
                <UserIcon size={18} className="text-gray-400 mr-2" />
                <span className="text-gray-400">{user.uid}</span>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2 max-md:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="pl-10 py-2 w-full bg-transparent border border-gray-300 dark:border-gray-700 dark:text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* First Name */}
            <div className="space-y-2 max-md:col-span-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleInputChange}
                className="py-2 px-3 w-full bg-transparent border border-gray-300 dark:border-gray-700 dark:text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2 max-md:col-span-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleInputChange}
                className="py-2 px-3 w-full bg-transparent border border-gray-300 dark:border-gray-700 dark:text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Phone */}
            {/* First Name */}
            <div className="space-y-2 max-md:col-span-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className="py-2 px-3 w-full bg-transparent border border-gray-300 dark:border-gray-700 dark:text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* country */}
            <div className="space-y-2 max-md:col-span-2">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country || ''}
                onChange={handleInputChange}
                className="py-2 px-3 w-full bg-transparent border border-gray-300 dark:border-gray-700 dark:text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Account Status Section */}
            <div className="col-span-2 mt-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 border-b dark:border-gray-800 pb-2">
                Account Status
              </h3>
            </div>

            {/* Status */}
            <div className="space-y-2 max-md:col-span-2">
              <label
                htmlFor="account-status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Account Status
              </label>
              <select
                id="status"
                name="account-status"
                value={formData.accountStatus || ''}
                onChange={handleInputChange}
                className="py-2 px-3 w-full bg-transparent border border-gray-300 dark:border-gray-700 dark:text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="deactivated">Deactivated</option>
              </select>
            </div>

            {/* Created Date */}
            <div className="space-y-2 max-md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Created Date
              </label>
              <div className="flex items-center bg-gray-100 dark:bg-bodydark2/30 p-3 rounded-lg">
                <Calendar size={18} className="text-gray-400 mr-2" />
                <span className="text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('en-US')}
                </span>
              </div>
            </div>

            {/* Email Verified */}
            <div className="space-y-2 max-md:col-span-2">
              <label
                htmlFor="isEmailVerified"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Verification
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isEmailVerified"
                  name="isEmailVerified"
                  checked={formData.isEmailVerified || false}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring focus:ring-blue-500"
                />
                <label
                  htmlFor="isEmailVerified"
                  className="ml-2 text-gray-700 dark:text-gray-300"
                >
                  Email Verified
                </label>
              </div>
            </div>

            {/* Trade Suspended */}
            <div className="space-y-2 max-md:col-span-2">
              <label
                htmlFor="isTradeSuspended"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                User Trade
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isTradeSuspended"
                  name="isTradeSuspended"
                  checked={formData.isTradeSuspended || false}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring focus:ring-blue-500"
                />
                <label
                  htmlFor="isTradeSuspended"
                  className="ml-2 text-gray-700 dark:text-gray-300"
                >
                  Suspend Trading
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {error && <Alert message={error} type="danger" />}
          {success && <Alert message={success} type="success" />}

          {/* Form Actions */}
          <div className="mt-8 flex gap-2">
            <button
              type="button"
              onClick={handleResetPassword}
              className="flex items-center px-3 py-1.5 whitespace-nowrap bg-gray-800/80 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Key size={16} className="mr-2" />
              Reset Password Mail
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center px-3 py-1.5 whitespace-nowrap bg-blue-600 text-white rounded-lg hover:bg-blue-400 transition-colors"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={16} className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {KYCModal && (
        <KYCAdminModal
          userId={id ? id : ''}
          documentFront={user.documentFront ? user.documentFront : ''}
          documentBack={user.documentBack ? user.documentBack : ''}
          documentNumber={user.documentNumber ? user.documentNumber : ''}
          setKYCModal={setKYCModal}
        />
      )}
    </>
  );
};

export default ManageSingleUser;
