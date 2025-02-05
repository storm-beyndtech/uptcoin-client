import { useState } from 'react';
import { Copy, OctagonAlert } from 'lucide-react';
import Alert from './UI/Alert';

interface Coin {
  symbol: string;
  name: string;
  network: string;
  address: string;
  minDeposit: number;
}

interface DepositProps {
  coins: Coin[];
}

export default function DepositComp({ coins }: DepositProps) {
  const [selectedCoin, setSelectedCoin] = useState<Coin>(coins[0]);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    selectedCoin.address,
  )}`;

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    alert('Address copied to clipboard!');
  };

  const handleCoinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = coins.find((coin) => coin.symbol === e.target.value);
    if (selected) {
      setSelectedCoin(selected);
    }
  };

  return (
    <div className="flex gap-5">
      <div className="p-6 max-w-lg bg-white dark:bg-gray-900 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Deposit
        </h2>

        {/* Select a coin */}
        <label className="block mb-2 text-sm font-medium">Select Coin</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={selectedCoin.symbol}
          onChange={handleCoinChange}
        >
          <option disabled>Choose A Coin</option>
          {coins.map((coin, i) => (
            <option key={i} value={coin.symbol}>
              {coin.name} ({coin.symbol})
            </option>
          ))}
        </select>

        {/* Choose a network */}
        <div className="mt-4">
          <label className="text-gray-700 dark:text-gray-300">
            Choose a network
          </label>
          <div className="mt-2 p-3 border rounded-lg dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            {selectedCoin.network}
          </div>
        </div>

        {/* Deposit Address */}
        <div className="mt-4">
          <label className="text-gray-700 dark:text-gray-300">
            Deposit address
          </label>
          <div className="mt-2 p-4 border rounded-lg dark:border-gray-700 flex items-center bg-gray-50 dark:bg-gray-800">
            <img src={qrCodeUrl} alt="QR Code" className="w-16 h-16 mr-4" />
            <div className="flex-1">
              <input
                type="text"
                readOnly
                value={selectedCoin.address}
                className="w-full bg-transparent text-gray-800 dark:text-white"
              />
            </div>
            <button
              onClick={() => handleCopy(selectedCoin.address)}
              className="text-gray-600 dark:text-gray-400"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>

        <Alert
          type="warning"
          message={`Minimum deposit amount: ${selectedCoin.minDeposit} ${selectedCoin.symbol}. Any deposits less than the
          minimum will not be credited or refunded.`}
        />
      </div>

      <div className="max-w-100 space-y-6 shadow-1 p-5 rounded-md bg-white text-sm ">
        <h2 className="text-xl text-yellow-700 flex gap-2">
          <OctagonAlert /> Notice{' '}
        </h2>
        <p>
          Minimum recharge quantity is{' '}
          {`${selectedCoin.minDeposit} ${selectedCoin.symbol}`}. Recharge less
          than the quantity will not be credited and no refund will be
          performed.
        </p>
        <p>
          The recharge address will not change frequently neither will it be
          static. There's no limit to your recharge but each recharge has to be
          confirmed by network confirmation; If there is any change, we will
          notify you through our announcement channel or via your email address
          with us.
        </p>
        <p>
          Please make sure that the computer and browser you are using is
          secured to prevent your information from being tampered or disclosed
        </p>
      </div>
    </div>
  );
}
