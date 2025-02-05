import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';

const assets = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOGE'];

export default function ConvertAsset() {
  const [fromAsset, setFromAsset] = useState('BTC');
  const [toAsset, setToAsset] = useState('USDT');
  const [amount, setAmount] = useState('');

  // Function to swap the assets correctly
  const handleSwitch = () => {
    setFromAsset(toAsset);
    setToAsset(fromAsset);
  };

  // Clears the selected asset and amount
  const handleClear = () => {
    setFromAsset('');
    setAmount('');
  };

  return (
    <div className="max-w-md bg-white shadow-1 p-6 rounded-lg">
      {/* Conversion Mode & Switch Button */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-500 font-semibold">Conversion Mode</span>
        <button
          onClick={handleSwitch}
          className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Switch
        </button>
      </div>

      {/* From Asset Dropdown */}
      <label className="text-sm text-gray-600 font-medium">From</label>
      <select
        value={fromAsset}
        onChange={(e) => setFromAsset(e.target.value)}
        className="w-full border p-2 rounded-lg mb-3 bg-white"
      >
        <option value="">Choose Asset</option>
        {assets.map((asset) => (
          <option key={asset} value={asset}>
            {asset}
          </option>
        ))}
      </select>

      {/* To Asset (Always Disabled) */}
      <label className="text-sm text-gray-600 font-medium">To</label>
      <input
        type="text"
        value={toAsset}
        disabled
        className="w-full border p-2 rounded-lg mb-3 bg-gray-100"
      />

      {/* Amount Input */}
      <label className="text-sm text-gray-600 font-medium">Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border p-2 rounded-lg mb-4"
        placeholder="Enter Amount"
      />

      {/* Action Buttons */}
      <div className="flex gap-3">
        {/* Convert Button */}
        <button
          className="bg-customGreen text-white py-2 px-5 text-sm rounded hover:bg-green-600 transition"
          onClick={() =>
            alert(`Converting ${amount} ${fromAsset} to ${toAsset}`)
          }
        >
          Convert
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
