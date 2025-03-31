import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { contextData } from '@/context/AuthContext';
import { Asset } from '@/types/types';
import { useCrypto } from '@/context/CoinContext';
import Alert from './UI/Alert';
import { sendRequest } from '@/lib/sendRequest';

interface AssetWithPrice extends Asset {
  price: number;
}

export default function ConvertAsset() {
  const { cryptoData } = useCrypto();
  const { user, refreshUser } = contextData();

  // Get user's assets with real-time prices
  const assets = user.assets.map((asset: Asset) => {
    const coinInfo = Object.values(cryptoData).find(
      (coin) => coin.symbol === asset.symbol,
    );
    return { ...asset, price: coinInfo ? Number(coinInfo.price) : 1 };
  });

  const parsedAssets = assets.filter(
    (asset: AssetWithPrice) => asset.symbol !== 'USDT',
  );

  const usdtAsset = assets.filter(
    (asset: AssetWithPrice) => asset.symbol === 'USDT',
  );

  const [fromAsset, setFromAsset] = useState(parsedAssets[0]);
  const [fromAssets, setFromAssets] = useState(parsedAssets);
  const [toAsset, setToAsset] = useState(usdtAsset[0]);
  const [toAssets, setToAssets] = useState(usdtAsset);
  const [amountToConvert, setAmountToConvert] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const calculateConversion = (
    from: AssetWithPrice,
    to: AssetWithPrice,
    amount: number,
    reverse?: boolean,
  ) => {
    setError(null);

    if (!from || !to || isNaN(amount) || amount <= 0) {
      setConvertedAmount('');
      return;
    }

    if (!reverse) {
      if (from.symbol !== 'USDT') {
        setConvertedAmount((amount * from.price).toFixed(2));
      } else {
        setConvertedAmount((amount / to.price).toFixed(8));
      }
    } else {
      if (to.symbol !== 'USDT') {
        setAmountToConvert((amount * to.price).toFixed(2));
      } else {
        setAmountToConvert((amount / from.price).toString(8));
      }
    }
  };

  // Swap assets
  const handleSwitch = () => {
    setFromAsset(toAsset);
    setToAsset(fromAsset);
    setFromAssets(toAssets);
    setToAssets(fromAssets);
    setAmountToConvert(convertedAmount);
    setConvertedAmount(amountToConvert);
  };

  // Clear inputs
  const handleClear = () => {
    setFromAsset(parsedAssets[0]);
    setFromAssets(parsedAssets);
    setToAsset(usdtAsset[0]);
    setToAssets(usdtAsset);
    setAmountToConvert('');
    setConvertedAmount('');
    setError(null);
    setSuccess(null);
  };

  // Submit conversion request
  const handleSubmit = async () => {
    if (!fromAsset || !toAsset) return setError('Please select assets');

    const availableAssetInUsd =
      Number(fromAsset.spot) * Number(fromAsset.price);

    if (availableAssetInUsd < Number(amountToConvert) * fromAsset.price)
      return setError(`Insufficient ${fromAsset.symbol} Balance`);

    if (Number(convertedAmount) <= 0)
      return setError(`Please enter a valid amount`);

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { message } = await sendRequest('/transaction/convert', 'POST', {
        userId: user._id,
        amount: Number(amountToConvert),
        from: fromAsset.symbol,
        to: toAsset.symbol,
      });

      setSuccess(message);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
      refreshUser();
      setTimeout(() => {
        handleClear();
        setSuccess(null);
      }, 3000);
    }
  };

  return (
    <div className="max-w-md max-sm:w-[90%] max-lg:mx-auto bg-white max-lg:bg-bodydark2 p-6 rounded-lg">
      {/* Conversion Mode & Switch Button */}
      <div className="flex justify-between items-center mb-7">
        <span className="text-gray-500 max-lg:text-white font-semibold">
          Conversion Mode
        </span>
        <button
          onClick={handleSwitch}
          className="flex items-center gap-2 px-3 py-1.5 border max-lg:border-white/10 rounded-lg text-gray-700 max-lg:text-white hover:bg-bodydark2/5"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Switch
        </button>
      </div>

      {/* From Asset Selection */}
      <label className="label">
        <span>From</span>
        <span>
          Bal:{' '}
          {fromAsset?.spot.toFixed(fromAsset.symbol === 'USDT' ? 2 : 8) || 0}
        </span>
      </label>

      <div className="flex gap-4 mb-7">
        <select
          onChange={(e) => setFromAsset(JSON.parse(e.target.value))}
          className="input"
          value={JSON.stringify(fromAsset)}
        >
          {fromAssets.map((asset: Asset, i: number) => (
            <option key={i} value={JSON.stringify(asset)}>
              {`${asset.name} (${asset.symbol})`}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={amountToConvert}
          onChange={(e) => {
            setAmountToConvert(e.target.value);
            calculateConversion(fromAsset, toAsset, Number(e.target.value));
          }}
          className="input"
          step={fromAsset.symbol === 'USDT' ? '0.01' : '0.00000001'}
        />
      </div>

      {/* To Asset Selection */}
      <label className="label">
        <span>To</span>
        <span>
          Bal: {toAsset?.spot.toFixed(toAsset.symbol === 'USDT' ? 2 : 8) || 0}
        </span>
      </label>

      <div className="flex gap-4 mb-3">
        <select
          onChange={(e) => setToAsset(JSON.parse(e.target.value))}
          className="input"
          value={JSON.stringify(toAsset)}
        >
          {toAssets.map((asset: Asset, i: number) => (
            <option key={i} value={JSON.stringify(asset)}>
              {`${asset.name} (${asset.symbol})`}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={convertedAmount}
          onChange={(e) => {
            setConvertedAmount(e.target.value);
            calculateConversion(
              fromAsset,
              toAsset,
              Number(e.target.value),
              true,
            );
          }}
          className="input"
          step={toAsset.symbol === 'USDT' ? '0.01' : '0.00000001'}
        />
      </div>

      {/* Action Buttons */}
      {error && <Alert message={error} type="danger" />}
      {success && <Alert message={success} type="success" />}
      {!error && !success && (
        <Alert
          type="simple"
          message="Prices update rapidly; the displayed price may vary slightly upon submission and processing."
        />
      )}
      <div className="flex gap-3">
        <button
          className="bg-customGreen text-white py-2 px-5 text-sm rounded hover:bg-green-600 transition"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Converting...' : 'Convert'}
        </button>

        <button
          className="bg-gray-500 text-white py-2 px-5 text-sm rounded hover:bg-gray-600 transition"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
