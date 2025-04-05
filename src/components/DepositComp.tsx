import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Copy, OctagonAlert } from 'lucide-react';
import { sendRequest } from '@/lib/sendRequest'; // Assuming you have this function for API requests.
import Alert from './UI/Alert';
import { contextData } from '@/context/AuthContext';
import NavigateBack from './UI/NavigateBack';
import { useCrypto } from '@/context/CoinContext';

interface Coin {
  symbol: string;
  name: string;
  network: string;
  address: string;
  minDeposit: number;
}

interface PendingDeposit {
  _id: string;
  symbol: string;
  network: string;
  amount: number;
  address: string;
}

interface DepositProps {
  coins: Coin[];
}

export default function DepositComp({ coins }: DepositProps) {
  const { symbol } = useParams();
    const { cryptoData } = useCrypto();
  const { user } = contextData();

  const initialCoin = coins.find((coin) => coin.symbol === symbol) || coins[0];
  const [selectedCoin, setSelectedCoin] = useState<Coin>(initialCoin);
  const [amount, setAmount] = useState(0);
  const [pendingDeposits, setPendingDeposits] = useState<PendingDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [effectiveMin, setEffectiveMin] = useState(0);

  useEffect(() => {
    const coinData = cryptoData[initialCoin.symbol];

    if (!coinData?.price) return;

    const coinMin = coinData.minDeposit || 0;
    const userMinInUSD = user.minDeposit || 0;

    // Convert user USD min withdrawal to coin equivalent
    const userMinInCoin = (userMinInUSD / coinData.price).toFixed(6);

    // Get the effective minimum (stricter)
    setEffectiveMin(Math.max(coinMin, Number(userMinInCoin)));
  }, [cryptoData.length]);

  useEffect(() => {
    if (symbol) {
      const newCoin = coins.find((coin) => coin.symbol === symbol);
      if (newCoin) setSelectedCoin(newCoin);
    }
  }, [symbol, coins]);

  // Fetch pending deposits
  const fetchPendingDeposits = async () => {
    try {
      const data = await sendRequest(
        `/transaction/deposits?userId=${user._id}&status=pending&${selectedCoin.symbol}`,
        'GET',
      );
      setPendingDeposits(data[0].symbol === selectedCoin.symbol ? data : []);
      console.log(data);
    } catch (error) {
      console.error('Error fetching pending deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDeposits();
  }, []);

  //Handle copy address
  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    alert('Address copied to clipboard!');
  };

  //Handle select coin
  const handleCoinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = coins.find((coin) => coin.symbol === e.target.value);
    if (selected) setSelectedCoin(selected);
  };

  //Submit Deposit
  const handleDeposit = async () => {
    if (amount < selectedCoin.minDeposit) {
      setError(
        `Minimum deposit is ${selectedCoin.minDeposit} ${selectedCoin.symbol}.`,
      );
      return;
    }

    setError('');

    try {
      setIsSubmitting(true);
      const { message } = await sendRequest('/transaction/deposit', 'POST', {
        userId: user._id,
        address: selectedCoin.address,
        network: selectedCoin.network,
        symbol: selectedCoin.symbol,
        amount,
      });
      setSuccess(message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        fetchPendingDeposits();
        setAmount(0);
        setSuccess('');
      }, 3000);
    }
  };

  //Cancel Deposit
  const handleCancelDeposit = async (id: string) => {
    setIsSubmitting(true);
    try {
      const { message } = await sendRequest(
        `/transaction/deposit/${id}/cancel`,
        'DELETE',
      );
      setSuccess(message);
    } catch (error) {
      console.error('Error canceling deposit:', error);
      setError('Failed to cancel deposit.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        fetchPendingDeposits();
        setSuccess('');
      }, 3000);
    }
  };

  if (loading) return <p>Loading deposits...</p>;

  return (
    <div className="flex gap-5 max-lg:flex-col py-5 px-4">
      <div className="text-2xl lg:hidden text-white">
        <NavigateBack />
      </div>

      <div className="p-6 max-lg:px-0 max-w-lg bg-white max-lg:bg-bodydark1 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold max-lg:font-medium text-gray-800 max-lg:text-white/90 mb-4">
          {pendingDeposits.length > 0 ? 'Pending Deposit(s)' : 'Deposit'}
        </h2>

        {/* Select a coin */}
        <label className="block mb-2 text-sm font-medium max-lg:text-white/30">
          Select Coin
        </label>
        <select
          className="input"
          value={selectedCoin.symbol}
          onChange={handleCoinChange}
        >
          {symbol ? (
            <option value={symbol}>
              {initialCoin.name} ({initialCoin.symbol})
            </option>
          ) : (
            coins.map((coin, i) => (
              <option key={i} value={coin.symbol}>
                {coin.name} ({coin.symbol})
              </option>
            ))
          )}
        </select>

        {/* Choose a network */}
        <div className="mt-4">
          <label className="text-gray-700 dark:text-gray-300 max-lg:text-white/30">
            Choose a network
          </label>
          <div className="input">{selectedCoin.network}</div>
        </div>

        {/* Deposit Address */}
        <div className="mt-4">
          <label className="text-gray-700 dark:text-gray-300 max-lg:text-white/30">
            Deposit address
          </label>
          <div className="mt-2 p-4 max-lg:py-7.5 lg:border rounded-lg flex items-center max-lg:flex-col max-lg:gap-5 bg-gray-50 max-lg:bg-bodydark2">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                selectedCoin.address,
              )}`}
              alt="QR Code"
              className="w-26 h-26 lg:w-16 lg:h-16 mr-4"
            />
            <div className="flex-1 max-lg:w-full">
              <input
                type="text"
                readOnly
                value={selectedCoin.address}
                className="input max-lg:border-none max-lg:w-full"
              />
            </div>
            <button
              onClick={() => handleCopy(selectedCoin.address)}
              className="text-gray-600 max-lg:text-gray-400 ml-2"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>

        {/* Show pending deposit details if available */}
        {pendingDeposits.length > 0 ? (
          <>
            {pendingDeposits.map((deposit) => (
              <div key={deposit._id}>
                <div className="mt-4">
                  <label className="text-gray-700 dark:text-gray-300 max-lg:text-white/30">
                    Enter Amount
                  </label>
                  <input className="input" value={deposit.amount} disabled />
                </div>

                {/* Alert Message */}
                {error && <Alert message={error} type="danger" />}
                {success && <Alert message={success} type="success" />}

                {/* Pending Instruction */}
                {!error && !success && (
                  <Alert
                    type="simple"
                    message="Copy or scan the wallet address to complete deposit."
                  />
                )}

                {/* Cancel Deposit */}
                <button
                  onClick={() => handleCancelDeposit(deposit._id)}
                  className="mt-3 w-full max-w-50 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Cancelling...' : 'Cancel Deposit'}
                </button>
              </div>
            ))}
          </>
        ) : (
          <>
            {/* Enter Amount */}
            <div className="mt-4">
              <label className="text-gray-700 dark:text-gray-300 max-lg:text-white/30">
                Enter Amount
              </label>
              <input
                type="number"
                className="input"
                placeholder={`Min: ${selectedCoin.minDeposit} ${selectedCoin.symbol}`}
                value={amount === 0 ? '' : amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            {/* Alert Message */}
            {error && <Alert message={error} type="danger" />}
            {success && <Alert message={success} type="success" />}

            {/* Submit Button */}
            <button
              onClick={handleDeposit}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Deposit'}
            </button>
          </>
        )}
      </div>

      <div className="max-w-100 space-y-6 shadow-1 p-5 rounded-md max-lg:text-white/60 bg-white max-lg:bg-bodydark2 text-sm ">
        <h2 className="text-xl text-yellow-500 flex gap-2">
          <OctagonAlert /> Notice{' '}
        </h2>
        <p>
          Minimum deposit quantity is{' '}
          {`${effectiveMin} ${selectedCoin.symbol}`}. Recharge less
          than the quantity will not be credited and no refund will be
          performed.
        </p>
        <p>
          The deposit address will not change frequently neither will it be
          static. There's no limit to your deposit but each deposit has to be
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
