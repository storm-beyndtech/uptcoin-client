import { sendRequest } from '@/lib/sendRequest';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Alert from './UI/Alert';

interface Asset {
  name: string;
  symbol: string;
  network: string;
  // spot: number;
  funding: number;
}

interface AdminWithdrawalModalProps {
  showModal: any;
  asset: Asset;
}

export const AdminWithdrawalModal: React.FC<AdminWithdrawalModalProps> = ({
  showModal,
  asset,
}) => {
  const { id } = useParams<{ id: string }>();
  const [amount, setAmount] = useState<number>(0);
  const [address, setAddress] = useState<string>('');
  const [network, setNetwork] = useState<string>('');
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  // Reset form on close
  const handleClose = () => {
    setAmount(0);
    setAddress('');
    setNetwork('');
    showModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { message } = await sendRequest(
        `/transaction/admin/withdraw/`,
        'POST',
        {
          userId: id,
          amount,
          symbol: asset.symbol,
          address,
          network,
        },
      );
      setSuccess(message);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        handleClose();
      }, 3000);
    }
  };
  const maxAmount = asset.funding;

  return (
    <div className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black customBlur bg-opacity-50">
      <div className="bg-white dark:bg-bodydark1 rounded-lg max-w-md w-full mx-4 p-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Withdraw {asset.symbol}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="bg-gray-100 dark:bg-bodydark2/70 p-3 rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Asset:
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {asset.name} ({asset.symbol})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Available Balance:
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {asset.funding.toFixed(asset.symbol === 'USDT' ? 2 : 8)}
                </span>
              </div>
            </div>

            {/* Network Selection */}
            <div className="mb-4">
              <label
                htmlFor="network"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Network
              </label>
              <input
                id="network"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Withdrawal Address */}
            <div className="mb-4">
              <label
                htmlFor="withdrawal-address"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Withdrawal Address
              </label>
              <input
                type="text"
                id="withdrawal-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={`Enter valid ${network || 'blockchain'} address`}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                Please double-check this address. Transactions cannot be
                reversed.
              </p>
            </div>

            {/* Amount to Withdraw */}
            <div className="mb-4">
              <label
                htmlFor="withdrawal-amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Crypto Withdraw Amount
              </label>
              <div className="relative ">
                <input
                  type="number"
                  id="withdrawal-amount"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00000000"
                  required
                  min={0}
                  step="0.00000001"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setAmount(maxAmount)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-blue-500 hover:text-blue-700"
                >
                  MAX
                </button>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {error && <Alert message={error} type="danger" />}
          {success && <Alert message={success} type="success" />}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-bodydark1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                amount <= 0 || amount > maxAmount || !address || !network
              }
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Process Withdrawal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
