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
  const { user } = contextData();

  //user Assets
  const assets = user.assets.map((asset: Asset) => {
    const coinInfo = Object.values(cryptoData).find((coin) => coin.symbol === asset.symbol);
    return { ...asset, price: coinInfo ? Number(coinInfo.price) : 0 };
  });

  // Get user's coins with realtime prices
  const parsedAssets = assets.filter(
    (asset: AssetWithPrice) =>
      asset.symbol !== 'USDT' && Number(asset.spot) !== 0,
  );

  //filtered assets to get only USDT
  const usdtAsset = assets.filter(
    (asset: AssetWithPrice) => asset.symbol === 'USDT',
  );

  const [fromAsset, setFromAsset] = useState(parsedAssets[0]);
  const [fromAssets, setFromAssets] = useState(parsedAssets);
  const [toAsset, setToAsset] = useState(usdtAsset[0]);
  const [toAssets, setToAssets] = useState(usdtAsset);
  const [amountToConvert, setAmountToConvert] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  //calculate conversion amount
  const calAmount = (
    asset: AssetWithPrice,
    amount: number,
    reverse?: boolean,
  ) => {
    const availableAssetInUsd = Number(asset.spot) * Number(asset.price);
    if (availableAssetInUsd < amount)
      setError(`Insufficient ${asset.symbol} Balance`);

    if (!reverse) {
      setConvertedAmount((amount * Number(asset.price)) / toAsset.price);
      setAmountToConvert(amount);
    } else {
      setAmountToConvert(amount / fromAsset.price);
      setConvertedAmount(amount);
    }
  };

  // Function to swap the assets correctly
  const handleSwitch = () => {
    setFromAssets(toAssets);
    setFromAsset(toAsset);
    setToAssets(fromAssets);
    setToAsset(fromAsset);
  };

  // Clears the selected asset and amount
  const handleClear = () => {
    setFromAsset(parsedAssets[0]);
    toAsset(usdtAsset[0]);
    setAmountToConvert(0);
  };

  // Submit conversion request
  const handleSubmit = async () => {
    const availableAssetInUsd =
      Number(fromAsset.spot) * Number(fromAsset.price);

    if (availableAssetInUsd < amountToConvert)
      return setError(`Insufficient ${fromAsset.symbol} Balance`);

    if (convertedAmount <= 0) return setError(`Please enter amount`);

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { message } = await sendRequest('/transaction/convert', 'POST', {
        amountToConvert,
        convertedAmount,
        fromAsset: fromAsset.symbol,
        toAsset: toAsset.symbol,
      });

      setSuccess(message);
      handleClear();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
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

      {/* From Asset Dropdown */}
      <label className="label">
        <span>From</span>
        <span>Bal: {fromAsset.spot}</span>
      </label>

      <div className="flex gap-4 mb-7">
        <select
          onChange={(e) => setFromAsset(JSON.parse(e.target.value))}
          className="input"
        >
          {fromAssets.map((asset: any, i: number) => (
            <option key={i} value={JSON.stringify(asset)}>
              {`${asset.name} (${asset.symbol})`}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={amountToConvert > 0 ? amountToConvert : ''}
          onChange={(e) => calAmount(fromAsset, Number(e.target.value))}
          className="input"
        />
      </div>

      {/* To Asset Dropdown */}
      <label className="label">
        <span>To</span>
        <span>Bal: {toAsset.spot}</span>
      </label>

      <div className="flex gap-4 mb-3">
        <select
          onChange={(e) => setToAsset(JSON.parse(e.target.value))}
          className="input"
        >
          {toAssets.map((asset: any, i: number) => (
            <option key={i} value={JSON.stringify(asset)}>
              {`${asset.name} (${asset.symbol})`}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={convertedAmount > 0 ? convertedAmount : ''}
          onChange={(e) => calAmount(fromAsset, Number(e.target.value), true)}
          className="input"
        />
      </div>

      {/* Action Buttons */}
      {error && <Alert message={error} type="danger" />}
      {success && <Alert message={success} type="success" />}
      <div className="flex gap-3">
        {/* Convert Button */}
        <button
          className="bg-customGreen text-white py-2 px-5 text-sm rounded hover:bg-green-600 transition"
          onClick={() =>
            handleSubmit()
          }
        >
          {loading ? "Converting..." : "Convert"}
        </button>

        {/* Clear Button */}
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
