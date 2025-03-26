import { useState, useEffect } from 'react';
import { useCrypto } from '../context/CoinContext';
import { contextData } from '../context/AuthContext';
import { Asset } from '@/lib/utils';
import Alert from './UI/Alert';

interface TradePanelProps {
  market: string;
  tradeType: string;
}

interface AssetWithPrice extends Asset {
  price: number;
}

const TradePanel: React.FC<TradePanelProps> = ({ market, tradeType }) => {
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [limitPrice, setLimitPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [availableBalance, setAvailableBalance] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { cryptoData } = useCrypto();
  const { user } = contextData();

  useEffect(() => {
    if (!user || !cryptoData) return;

    const asset = user.assets.find((a: AssetWithPrice) => a.symbol === market);
    const coinInfo = Object.values(cryptoData).find(
      (coin) => coin.symbol === market,
    );
    const currentPrice = coinInfo ? Number(coinInfo.price) : 0;

    setLimitPrice((prev) => (prev ? prev : currentPrice.toString()));

    if (tradeType === 'buy') {
      const usdtAsset = user.assets.find(
        (a: AssetWithPrice) => a.symbol === 'USDT',
      );
      setAvailableBalance(usdtAsset ? usdtAsset.spot : 0);
    } else {
      setAvailableBalance(asset ? asset.spot : 0);
    }
  }, [user, cryptoData, market, tradeType]);

  const handleLimitPriceChange = (value: string) => {
    setLimitPrice(value);
    if (quantity) {
      setAmount((Number(value) * Number(quantity)).toFixed(4));
    }
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(value);
    if (limitPrice) {
      setAmount((Number(limitPrice) * Number(value)).toFixed(4));
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (limitPrice) {
      setQuantity((Number(value) / Number(limitPrice)).toFixed(4));
    }
  };

  const handlePercentageClick = (percent: number) => {
    if (orderType === 'limit' && limitPrice) {
      if (tradeType === 'buy') {
        const calculatedQuantity =
          (availableBalance * percent) / 100 / Number(limitPrice);
        setQuantity(calculatedQuantity.toFixed(4));
        setAmount(((availableBalance * percent) / 100).toFixed(4));
      } else {
        // For SELL: Use Asset balance → Amount is calculated based on price
        const calculatedAmount =
          availableBalance * (percent / 100) * Number(limitPrice);
        setQuantity(((availableBalance * percent) / 100).toFixed(4));
        setAmount(calculatedAmount.toFixed(4));
      }
    } else {
      if (tradeType === 'buy') {
        setQuantity(((availableBalance * percent) / 100).toFixed(4));
      } else {
        setQuantity(((availableBalance * percent) / 100).toFixed(4));
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    if (
      orderType === 'limit' &&
      (!limitPrice || isNaN(Number(limitPrice)) || Number(limitPrice) <= 0)
    ) {
      setError('Invalid price');
      setIsSubmitting(false);
      return;
    }
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      setError('Invalid quantity');
      setIsSubmitting(false);
      return;
    }

    const orderData = {
      market,
      tradeType,
      orderType,
      price: orderType === 'market' ? 'market_price' : limitPrice,
      quantity,
    };

    try {
      const response = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Trade failed');

      setSuccess(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#1a1b1c] p-4 rounded-sm w-full max-w-md text-[13px]">
      <div className="flex-1">
        <h4 className="flex justify-between font-semibold text-xs lg:text-base text-white/40 mb-4">
          <span>Available</span>{' '}
          <span>
            {availableBalance} {tradeType === 'buy' ? 'USDT' : market}
          </span>
        </h4>

        <div className="flex text-xs pb-2">
          <button
            className={`px-4 py-1 border-[1.5px] rounded border-customGreen ${
              orderType === 'limit' ? 'text-customGreen' : 'border-opacity-0'
            }`}
            onClick={() => setOrderType('limit')}
          >
            Limit
          </button>
          <button
            className={`px-4 py-1 border-[1.5px] rounded border-customGreen ${
              orderType === 'market' ? 'text-customGreen' : 'border-opacity-0'
            }`}
            onClick={() => setOrderType('market')}
          >
            Market
          </button>
        </div>

        {orderType === 'limit' && (
          <div className="relative mt-6">
            <input
              type="text"
              className="tradePanelInput peer"
              placeholder=" "
              value={limitPrice}
              onChange={(e) => handleLimitPriceChange(e.target.value)}
            />
            <label className="tradePanelLabel">Limit Price</label>
          </div>
        )}

        <div className="relative mt-6">
          <input
            type="text"
            className="tradePanelInput peer"
            placeholder=" "
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
          />
          <label className="tradePanelLabel">Quantity</label>
        </div>

        <div className="mt-6 flex justify-between px-1">
          {[25, 50, 75, 100].map((percent) => (
            <button
              key={percent}
              className="flex flex-col items-center gap-1"
              onClick={() => handlePercentageClick(percent)}
            >
              <span className="block bg-white/30 px-4 py-1 rounded hover:bg-green-500"></span>
              <span className="text-center text-xs text-white/30">
                {percent}%
              </span>
            </button>
          ))}
        </div>

        <div className="relative mt-6">
          <input
            type="text"
            className="tradePanelInput peer"
            placeholder=" "
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
          />
          <label className="tradePanelLabel">Amount (USDT)</label>
        </div>

        {/* Action Buttons */}
        {error && <Alert message={error} type="danger" />}
        {success && <Alert message={success} type="success" />}

        <div className="pt-4">
          <button
            className={`w-full py-2 rounded-md text-white ${
              tradeType === 'buy' ? 'bg-green-600' : 'bg-red-600'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Processing...'
              : tradeType === 'buy'
                ? `Buy ${market}`
                : `Sell ${market}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradePanel;
