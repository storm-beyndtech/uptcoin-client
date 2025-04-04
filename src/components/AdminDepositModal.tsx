import React, { useState } from 'react';
import Alert from './UI/Alert';
import { sendRequest } from '@/lib/sendRequest';
import { useParams } from 'react-router-dom';
import { X } from 'lucide-react';

interface Asset {
  name: string;
  symbol: string;
  network: string;
  spot: number;
}

interface AdminDepositModalProps {
  showModal: any;
  asset: Asset;
}

export const AdminDepositModal: React.FC<AdminDepositModalProps> = ({
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
    setSuccess(null);
    setError(null);
    showModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { message } = await sendRequest(`/transaction/deposit/`, 'POST', {
        userId: id,
        amount,
        symbol: asset.symbol,
        address,
        network,
      });
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

  return (
    <div className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black customBlur bg-opacity-50">
      <div className="bg-white dark:bg-bodydark1 rounded-lg max-w-md w-full mx-4 p-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Deposit {asset.symbol}
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
                  Current Balance:
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {asset.spot.toFixed(asset.symbol === 'USDT' ? 2 : 8)}
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

            {/* Deposit Address */}
            <div className="mb-4">
              <label
                htmlFor="deposit-address"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Deposit Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="deposit-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Amount to Deposit */}
            <div className="mb-4">
              <label
                htmlFor="deposit-amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Deposit Crypto Amount
              </label>
              <input
                type="number"
                id="deposit-amount"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="0.00000000"
                min={0}
                step="0.00000001"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Alerts */}
          {error && <Alert message={error} type="danger" />}
          {success && <Alert message={success} type="success" />}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-bodydark1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-bodydark2/70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!network || !address}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Submit Deposit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
