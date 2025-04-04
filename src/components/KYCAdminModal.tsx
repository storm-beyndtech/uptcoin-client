import { sendRequest } from '@/lib/sendRequest';
import { Dispatch, SetStateAction, useState } from 'react';
import Alert from './UI/Alert';
import { useNavigate } from 'react-router-dom';

interface KYCAdminModalProps {
  setKYCModal: Dispatch<SetStateAction<boolean>>;
  userId: string;
  documentFront: string;
  documentBack: string;
  documentNumber: string;
}

const KYCAdminModal = ({
  userId,
  documentFront,
  documentBack,
  documentNumber,
  setKYCModal,
}: KYCAdminModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (action: string) => {
    try {
      setIsLoading(true);
      setSuccess('');
      setError('');

      // This would be replaced with your actual API call
      const { message } = await sendRequest(
        `/auth/${action}-kyc/${userId}`,
        'PUT',
      );

      setSuccess(
        message ||
          `KYC submission ${
            action === 'approve' ? 'approved' : 'rejected'
          } successfully!`,
      );

      // Auto close after success
      setTimeout(() => {
        setKYCModal(false);
        navigate('/admin/manage-users');
      }, 3000);
    } catch (error: any) {
      console.error(`Failed to ${action} KYC submission:`, error);
      setError(
        error.message ||
          `Failed to ${action} KYC submission. Please try again.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000000] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black/30 bg-opacity-75 transition-opacity customBlur"
          onClick={() => setKYCModal(false)}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-black/90 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full w-full max-w-100">
          <div className=" px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-2xl leading-6 font-semibold text-gray-700 dark:text-gray-300 mb-6">
                  Verify Kyc
                </h3>

                {/* KYC Information */}

                <p className="text-gray-700 dark:text-white/60 font-normal mb-5">
                  Doc Number:{' '}
                  <span className="font-semibold">{documentNumber}</span>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                      Document Front
                    </h3>
                    <div className="border rounded-md overflow-hidden bg-gray-100 dark:bg-bodydark1/60 dark:border-gray-800 flex items-center justify-center h-64">
                      {documentFront ? (
                        <img
                          src={documentFront}
                          alt="Document Front"
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <p className="text-gray-400 text-sm">
                          No document <br />
                          front image
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                      Document Back
                    </h3>
                    <div className="border rounded-md overflow-hidden bg-gray-100 dark:bg-bodydark1/60 dark:border-gray-800 flex items-center justify-center h-64">
                      {documentBack ? (
                        <img
                          src={documentBack}
                          alt="Document Back"
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <p className="text-gray-400 text-sm">
                          No document <br />
                          back image
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {error && <Alert message={error} type="danger" />}
          {success && <Alert message={success} type="success" />}

          {/* Action Buttons */}
          <div className="bg-gray-50 dark:bg-bodydark1/70 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => handleSubmit('approve')}
              disabled={isLoading}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Processing...' : 'Approve'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('reject')}
              disabled={isLoading}
              className={`mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Processing...' : 'Reject'}
            </button>
            <button
              type="button"
              onClick={() => setKYCModal(false)}
              disabled={isLoading}
              className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-bodydark1 dark:border-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Cancel
            </button>
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-10 customBlur flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCAdminModal;
