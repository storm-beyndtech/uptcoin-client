import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { contextData } from '@/context/AuthContext';
import Alert from './UI/Alert';
import { sendRequest } from '@/lib/sendRequest';
import { Asset } from '@/types/types';

export default function TransferAsset() {
  const { user } = contextData();
  const assets = user.assets.filter((asset: Asset) => Number(asset.spot) > 0);

  const [from, setFrom] = useState('Funding');
  const [to, setTo] = useState('Spot');
  const [coin, setCoin] = useState(assets[0]);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const handleSwitch = () => {
    setFrom(to);
    setTo(from);
  };

  const handleTransfer = async () => {
    if (from === to) return setError('Cannot transfer to the same balance');
    if (Number(amount) <= 0) return setError('Enter a valid amount');
    if (Number(coin.spot) < Number(amount))
      return setError('Insufficient balance');

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { message } = await sendRequest('/transaction/transfer', 'POST', {
        from,
        to,
        coin: coin.symbol,
        amount,
      });
      setSuccess(message);
      setAmount(0);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md p-6 bg-white rounded-lg">
      {/* Transfer Mode & Switch Button */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-500 font-semibold">Transfer Mode</span>
        <button
          onClick={handleSwitch}
          className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Switch
        </button>
      </div>

      {/* From & To Dropdowns */}
      <label className="label">
        <span>From</span>{' '}
        <span>{from === 'Funding' ? coin.funding : coin.spot}</span>
      </label>
      <input
        onChange={(e) => setFrom(e.target.value)}
        className="input mb-3"
        value={from}
        disabled
      />

      <label className="label">
        <span>To</span> <span>{to === 'Spot' ? coin.spot : coin.funding}</span>
      </label>
      <input
        onChange={(e) => setTo(e.target.value)}
        className="input mb-3"
        value={to}
        disabled
      />

      {/* Coin Selection */}
      <label className="label">Coin</label>
      <select
        onChange={(e) => setCoin(JSON.parse(e.target.value))}
        className="input mb-3"
      >
        {assets.map((asset: Asset, i: number) => (
          <option key={i} value={JSON.stringify(asset)}>
            {`${asset.name} (${asset.symbol})`}
          </option>
        ))}
      </select>

      {/* Amount Input */}
      <label className="label">Amount</label>
      <input
        type="number"
        value={amount > 0 ? amount : ''}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="input"
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
  );
}
