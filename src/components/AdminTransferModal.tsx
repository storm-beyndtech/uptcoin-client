import React, { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import Alert from './UI/Alert';
import { sendRequest } from '@/lib/sendRequest';
import { useParams } from 'react-router-dom';

interface Asset {
  name: string;
  symbol: string;
  spot: number;
  funding: number;
}

interface AdminTransferModalProps {
  showModal: (value: boolean) => void;
  asset: Asset;
}

export const AdminTransferModal: React.FC<AdminTransferModalProps> = ({
  asset,
  showModal,
}) => {
  const { id } = useParams<{ id: string }>();
  const [from, setFrom] = useState<'funding' | 'spot'>('funding');
  const [to, setTo] = useState<'funding' | 'spot'>('spot');
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSwitch = () => {
    setFrom(to);
    setTo(from);
  };

  const handleTransfer = async () => {
    setError(null);
    if (amount <= 0) return setError('Enter a valid amount');

    if (from === 'funding' && amount > asset.funding)
      return setError(`Insufficient ${asset.symbol} funding balance`);
    if (from === 'spot' && amount > asset.spot)
      return setError(`Insufficient ${asset.symbol} spot balance`);

    try {
      setLoading(true);
      const { message } = await sendRequest('/transaction/transfer/', 'POST', {
        userId: id,
        symbol: asset.symbol,
        from,
        to,
        amount,
      });
      setSuccess(message);
      setAmount(0);
      setTimeout(() => {
        setSuccess(null);
      }, 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black customBlur bg-opacity-50">
      <div className="bg-white dark:bg-bodydark1 p-5 rounded-lg max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Transfer {asset.symbol}
          </h2>

          <button
            onClick={handleSwitch}
            className="flex items-center gap-2 px-3 py-1.5 border dark:border-gray-700 rounded-lg text-gray-700 dark:text-white/70"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Switch
          </button>

          <button
            onClick={() => showModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Balance Info with Disabled Inputs */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-white/70">
            From
          </label>
          <input
            type="text"
            value={`${from.toUpperCase()} - Bal: ${(from === 'funding'
              ? asset.funding
              : asset.spot
            ).toFixed(6)} ${asset.symbol}`}
            className="w-full p-2 py-3 my-[2px] border rounded-lg bg-gray-100 dark:bg-bodydark2/50 text-sm text-gray-600 dark:text-white/70 dark:border-gray-700"
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-white/70">
            To
          </label>
          <input
            type="text"
            value={`${to.toUpperCase()} - Bal: ${(to === 'spot'
              ? asset.spot
              : asset.funding
            ).toFixed(6)} ${asset.symbol}`}
            className="w-full p-2 py-3 my-[2px] border rounded-lg bg-gray-100 dark:bg-bodydark2/50 text-sm text-gray-600 dark:text-white/70 dark:border-gray-700"
            disabled
          />
        </div>

        {/* Amount Input */}
        <label className="block text-sm font-medium text-gray-700 dark:text-white/70">
          Amount
        </label>
        <input
          type="number"
          value={amount > 0 ? amount : ''}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-2 py-3 my-[2px] border rounded-lg bg-gray-100 dark:bg-bodydark2/50 text-sm text-gray-600 dark:text-white/70 dark:border-gray-700"
        />

        {/* Alerts */}
        {error && <Alert message={error} type="danger" />}
        {success && <Alert message={success} type="success" />}

        {/* Transfer Button */}
        <button
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          onClick={handleTransfer}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Transfer'}
        </button>
      </div>
    </div>
  );
};
