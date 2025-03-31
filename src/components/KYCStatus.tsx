import { useState } from 'react';
import { sendRequest } from '@/lib/sendRequest';
import Alert from '@/components/UI/Alert';
import { User } from '@/types/types';
import { contextData } from '@/context/AuthContext';

export default function KYCStatus({ user }: { user: User }) {
  const { refreshUser } = contextData();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setError('');
    setSuccess('');
    setIsDeleting(true);

    try {
      const { message } = await sendRequest(
        `/auth/delete-kyc/${user._id}`,
        'DELETE',
      );
      setSuccess(message);
      setTimeout(() => refreshUser(), 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-lg w-full bg-white max-lg:bg-transparent p-5 max-lg:pt-10 rounded">
      <h2 className="text-xl font-semibold text-white lg:text-gray-800 mb-5">
        KYC Verification Status
      </h2>

      <Alert
        type={user.kycStatus === 'approved' ? 'success' : 'warning'}
        message={`Your KYC status: ${user.kycStatus}`}
      />

      <div className="space-y-5 mt-5">
        {[
          { label: 'Full Name', value: `${user.firstName} ${user.lastName}` },
          { label: 'Date of Birth', value: user.dateOfBirth },
          { label: 'Phone', value: user.phone },
          { label: 'Country', value: user.country },
          { label: 'Document Type', value: user.documentType },
          { label: 'Document Number', value: user.documentNumber },
        ].map((field, index) => (
          <div key={index} className="relative">
            <input
              type="text"
              className="tradePanelInput peer text-white lg:text-gray-800 border-white/20 lg:border-gray-300"
              placeholder=" "
              value={field.value}
              readOnly
            />
            <label className="tradePanelLabel bg-[#1a1b1c] lg:bg-white text-white/40 lg:text-gray-500">
              {field.label}
            </label>
          </div>
        ))}
      </div>

      {error && <Alert type="danger" message={error} />}
      {success && <Alert type="success" message={success} />}

      {(user.kycStatus === 'pending' || user.kycStatus === 'rejected') && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`mt-6 w-full text-sm font-medium py-2 rounded-md transition-all ${
            isDeleting
              ? 'bg-gray-500 text-gray-200 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {isDeleting ? 'Processing...' : 'Delete & Reapply'}
        </button>
      )}
    </div>
  );
}
