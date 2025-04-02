import React, { Dispatch, SetStateAction, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import Alert from './UI/Alert';
import { sendRequest } from '@/lib/sendRequest';
import { contextData } from '@/context/AuthContext';

interface BecomeATraderModalProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const BecomeATraderModal: React.FC<BecomeATraderModalProps> = ({
  setIsModalOpen,
}) => {
  const { user, refreshUser } = contextData();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Handle become a trader
  const handleSubmit = async (e: 'yes' | 'no') => {
    let traderData;
    if (e === 'yes') {
      traderData = {
        userId: user._id,
        tradingStatus: 'Trader',
        isTradeSuspended: false,
      };
    } else {
      traderData = {
        userId: user._id,
        isTradeSuspended: true,
        tradingStatus: 'None',
      };
    }
    try {
      setIsSubmitting(true);
      const { message } = await sendRequest(
        `/transaction/trader`,
        'PUT',
        traderData,
      );
      setSuccess(message);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setError('');
        setSuccess('');
        refreshUser();
        setIsModalOpen(false);
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000000] flex items-center justify-center bg-black bg-opacity-50 customBlur px-4">
      <div className="bg-white max-lg:bg-bodydark2 p-6 max-lg:px-4 rounded-lg w-96">
        <div className="relative mb-4">
          <h2 className="text-lg font-semibold max-lg:text-white/90">
            Do You Want to <br /> Become a Trader?
          </h2>
          <CgClose
            className="absolute right-2 top-[50%] translate-y-[-50%] text-xl cursor-pointer max-lg:text-white/90"
            onClick={() => setIsModalOpen(false)}
          />
        </div>

        {/* Action Buttons */}
        {error && <Alert message={error} type="danger" />}
        {success && <Alert message={success} type="success" />}

        {/* Buttons */}
        <div className="flex space-x-5 text-sm">
          <button
            className="px-5 py-1.5 bg-bodydark1 text-white rounded-sm"
            onClick={() => handleSubmit('no')}
            disabled={isSubmitting}
          >
            No
          </button>
          <button
            className="px-5 py-1.5 bg-blue-600 text-white rounded-sm"
            disabled={isSubmitting}
            onClick={() => handleSubmit('yes')}
          >
            {isSubmitting ? 'Sending Request...' : 'Yes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BecomeATraderModal;
