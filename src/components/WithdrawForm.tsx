import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Edit2, OctagonAlert } from 'lucide-react';
import { sendRequest } from '@/lib/sendRequest';
import Alert from './UI/Alert';
import { contextData } from '@/context/AuthContext';
import CompleteTransactionModal from './CompleteTransactionModal';
import Btn from './UI/Btn';

interface WithdrawAsset {
  symbol: string;
  name: string;
  network: string;
  address: string;
  minWithdraw: number;
  funding: number;
}

interface PendingWithdrawal {
  _id: string;
  symbol: string;
  network: string;
  amount: number;
  address: string;
}

interface WithdrawFormProps {
  withdrawAssets: WithdrawAsset[];
  setIsAddressModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function WithdrawForm({
  withdrawAssets,
  setIsAddressModalOpen,
}: WithdrawFormProps) {
  const { symbol } = useParams();
  const { user } = contextData();

  const initialAsset =
    withdrawAssets.find((asset) => asset.symbol === symbol) ||
    withdrawAssets[0];
  const [selectedAsset, setSelectedAsset] =
    useState<WithdrawAsset>(initialAsset);
  const [amount, setAmount] = useState('');
  const [pendingWithdrawals, setPendingWithdrawals] = useState<
    PendingWithdrawal[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [submitModalOpen, setIsSubmitModalOpen] = useState(false);

  useEffect(() => {
    if (symbol) {
      const asset = withdrawAssets.find((asset) => asset.symbol === symbol);
      if (asset) setSelectedAsset(asset);
    }
  }, [symbol, withdrawAssets]);

  // Fetch pending withdrawals
  const fetchPendingWithdrawals = async () => {
    try {
      const data = await sendRequest(
        `/transaction/withdrawals?userId=${user._id}&status=pending&symbol=${selectedAsset.symbol}`,
        'GET',
      );
      setPendingWithdrawals(
        data[0]?.symbol === selectedAsset.symbol ? data : [],
      );
    } catch (error) {
      console.error('Error fetching pending withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingWithdrawals();
  }, []);

  // Handle asset change
  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = withdrawAssets.find(
      (asset) => asset.symbol === e.target.value,
    );
    if (selected) setSelectedAsset(selected);
  };

  // Handle submit withdrawal
  const handleSubmit = async (password: string) => {
    setError('');
    if (Number(amount) < selectedAsset.minWithdraw) {
      setError(
        `Minimum withdrawal is ${selectedAsset.minWithdraw} ${selectedAsset.symbol}.`,
      );
      return;
    }

    if (!password) return setError('Please enter withdrawal passowrd');
    if (!selectedAsset.address)
      return setError('Please setup your wallet address');

    try {
      setIsSubmitting(true);
      const { message } = await sendRequest('/transaction/withdraw', 'POST', {
        userId: user._id,
        address: selectedAsset.address,
        network: selectedAsset.network,
        symbol: selectedAsset.symbol,
        amount: Number(amount),
        withdrawalPassword: password,
      });
      setSuccess(message);
      setIsSubmitModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        fetchPendingWithdrawals();
        setAmount('');
        setSuccess('');
      }, 3000);
    }
  };

  // Handle cancel withdrawal
  const handleCancelWithdrawal = async (id: string) => {
    setError('');
    setIsSubmitting(true);
    try {
      const { message } = await sendRequest(
        `/transaction/cancel/withdrawal/${id}`,
        'DELETE',
      );
      setSuccess(message);
    } catch (error) {
      console.error('Error canceling withdrawal:', error);
      setError('Failed to cancel withdrawal.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        fetchPendingWithdrawals();
        setSuccess('');
      }, 3000);
    }
  };

  if (loading) return <p>Loading withdrawals...</p>;

  return pendingWithdrawals.length > 0 ? (
    <div className="mt-6 p-4 bg-yellow-100/20 max-lg:bg-bodydark2 border-l-4 border-yellow-500 text-yellow-700 rounded-lg">
      <div className="flex items-center gap-2">
        <OctagonAlert size={18} />
        <h3 className="text-md font-semibold">Pending Withdrawals</h3>
      </div>
      {pendingWithdrawals.map((withdrawal) => (
        <div
          key={withdrawal._id}
          className="mt-3 p-2 bg-white/20 max-lg:bg-bodydark1 rounded-md shadow-sm flex justify-between"
        >
          <span>
            {withdrawal.amount} {withdrawal.symbol} - {withdrawal.network}
          </span>
          <button
            className="px-3 py-[2px] text-xs bg-red-500 text-white rounded-xl"
            onClick={() => handleCancelWithdrawal(withdrawal._id)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cancelling...' : 'Cancel'}
          </button>
        </div>
      ))}
    </div>
  ) : (
    <>
      <div className="max-w-md p-6 px-4 bg-white max-lg:bg-bodydark1 rounded-lg space-y-7">
        <h2 className="text-xl font-medium max-lg:text-white/90">
          Withdraw Funds
        </h2>

        <div>
          <label className="text-sm font-medium mb-2.5 text-gray-500 max-lg:text-white/30">
            Select Asset
          </label>
          <select
            className="input !text-sm"
            value={selectedAsset.symbol}
            onChange={handleAssetChange}
          >
            {symbol ? (
              <option value={symbol}>
                {selectedAsset.name} ({selectedAsset.symbol})
              </option>
            ) : (
              withdrawAssets.map((coin, i) => (
                <option key={i} value={coin.symbol}>
                  {coin.name} ({coin.symbol})
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2.5 text-gray-500 max-lg:text-white/30">
            Network
          </label>
          <input
            type="text"
            value={selectedAsset.network}
            disabled
            className="input !text-sm"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm font-medium mb-2 text-gray-500 max-lg:text-white/30">
            <label>Address</label>
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="text-blue-500 flex items-center gap-1"
            >
              <Edit2 size={10} /> Change Address
            </button>
          </div>
          <input
            type="text"
            value={selectedAsset.address}
            disabled
            className="input !text-sm"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm font-medium mb-2 text-gray-500 max-lg:text-white/30">
            <label>Amount ({selectedAsset.symbol})</label>
            <p className="text-blue-500">
              Balance: {selectedAsset.funding} {selectedAsset.symbol}
            </p>
          </div>
          <input
            type="number"
            min={selectedAsset.minWithdraw}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`${selectedAsset.minWithdraw}`}
            className="input !text-sm"
          />
        </div>

        {error && <Alert type="danger" message={error} />}
        {success && <Alert type="success" message={success} />}

        {!error && !success && (
          <Alert
            type="warning"
            message={`Minimum withdrawal amount is ${selectedAsset.minWithdraw} ${selectedAsset.symbol}.`}
          />
        )}

        <Btn
          label={isSubmitting ? 'Processing...' : 'Submit'}
          type="primary"
          className="w-full"
          onClick={() => setIsSubmitModalOpen(true)}
        />
      </div>

      {submitModalOpen && (
        <CompleteTransactionModal
          setIsModalOpen={setIsSubmitModalOpen}
          onSubmit={handleSubmit}
          title="Withdrawal"
          isSubmitting={isSubmitting}
          error={error && error}
          success={success && success}
        />
      )}
    </>
  );
}
