import { useState, useEffect } from 'react';
import { useCrypto } from '../context/CoinContext';
import { contextData } from '../context/AuthContext';
import { Asset } from '@/lib/utils';
import Alert from './UI/Alert';
import { sendRequest } from '@/lib/sendRequest';
import { useNavigate } from 'react-router-dom';

interface TradePanelProps {
  market: string;
  tradeType: string;
  validateTrader: any;
}

interface AssetWithPrice extends Asset {
  price: number;
}

const TradePanel: React.FC<TradePanelProps> = ({
  market,
  tradeType,
  validateTrader,
}) => {
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState<'limit' | 'market'>('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [marketPrice, setMarketPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [availableBalance, setAvailableBalance] = useState(0);
  const [balPercent, setBalPercent] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const { cryptoData } = useCrypto();
  const { user, refreshUser } = contextData();

  useEffect(() => {
    if (!user || !cryptoData) return;

    const asset = user.assets.find((a: AssetWithPrice) => a.symbol === market);

    if (tradeType === 'buy') {
      const usdtAsset = user.assets.find(
        (a: AssetWithPrice) => a.symbol === 'USDT',
      );
      setAvailableBalance(usdtAsset ? usdtAsset.spot : 0);
    } else {
      setAvailableBalance(asset ? asset.spot : 0);
    }
  }, [user, cryptoData, market, tradeType]);

  //update market price
  useEffect(() => {
    const coinInfo = Object.values(cryptoData).find(
      (coin) => coin.symbol === market,
    );
    const currentPrice = coinInfo ? Number(coinInfo.price) : 0;

    setMarketPrice(currentPrice.toFixed(2));
  }, [market, cryptoData]);

  useEffect(() => {
    setAmount('');
    setQuantity('');
  }, [market]);

  //Handle limit price change
  const handleLimitPriceChange = (value: string) => {
    setLimitPrice(value);
    if (quantity) {
      setAmount((Number(value) * Number(quantity)).toFixed(2));
    }
  };

  //Handle quantity change
  const handleQuantityChange = (value: string) => {
    setQuantity(value);
    if (orderType === 'limit' && limitPrice) {
      setAmount((Number(limitPrice) * Number(value)).toFixed(2));
    }
    if (orderType === 'market' && marketPrice) {
      setAmount((Number(marketPrice) * Number(value)).toFixed(2));
    }
    setBalPercent(0);
  };

  //handle amount change
  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (orderType === 'limit' && limitPrice) {
      setQuantity((Number(value) / Number(limitPrice)).toFixed(6));
    }
    if (orderType === 'market' && marketPrice) {
      setQuantity((Number(value) / Number(marketPrice)).toFixed(6));
    }
    setBalPercent(0);
  };

  const handlePercentageClick = (percent: number) => {
    if (!cryptoData[market] || cryptoData[market].price === 0) return;

    if (tradeType === 'buy') {
      const calculatedQuantity =
        (availableBalance * percent) / 100 / Number(cryptoData[market].price);
      setQuantity(calculatedQuantity.toFixed(6));
      setAmount(((availableBalance * percent) / 100).toFixed(2));
    } else {
      // For SELL: Use Asset balance → Amount is calculated based on price
      const calculatedAmount =
        availableBalance * (percent / 100) * Number(cryptoData[market].price);
      setQuantity(((availableBalance * percent) / 100).toFixed(6));
      setAmount(calculatedAmount.toFixed(2));
    }

    setBalPercent(percent);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const validateTraderStatus = await validateTrader();

    if (user.kycStatus !== 'approved') {
      setError('Complete kyc before trading');
      setIsSubmitting(false);
      setTimeout(() => {
        navigate('/dashboard/auth');
      }, 3000);
      return;
    }

    if (!validateTraderStatus) {
      setIsSubmitting(false);
      return;
    }

    if (!user) return navigate('/login');

    //Validate Limit price
    if (
      orderType === 'limit' &&
      (!limitPrice || isNaN(Number(limitPrice)) || Number(limitPrice) <= 0)
    ) {
      setError('Invalid price');
      setIsSubmitting(false);
      return;
    }

    //Validate Amount
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Invalid Amount');
      setIsSubmitting(false);
      return;
    }

    //Validate Trade Limit Amount
    if (user.tradingStatus === 'Trader') {
      if (user.tradingLimit === 'In Process' || user.tradingLimit === 'None') {
        if (Number(amount) < 2000) {
          setError('Min Trade Amount Muse Be Above $2000 ');
          setIsSubmitting(false);
          return;
        }
      }

      if (user.tradingLimit === 'Individual') {
        if (Number(amount) < 10000) {
          setError('Min Trade Amount Muse Be Above $10000 ');
          setIsSubmitting(false);
          return;
        }
      }

      if (user.tradingLimit === 'Institutional') {
        if (Number(amount) < 30000) {
          setError('Min Trade Amount Muse Be Above $30000 ');
          setIsSubmitting(false);
          return;
        }
      }
    }

    //Validate Quantity
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      setError('Invalid quantity');
      setIsSubmitting(false);
      return;
    }

    //Check if user has asset
    const isAsset = user.assets.find((asset: any) => asset.symbol === market);
    if (!isAsset) {
      setError('Please add asset first before trading');
      setIsSubmitting(false);
      return;
    }

    try {
      const { message } = await sendRequest('/transaction/trade', 'POST', {
        userId: user._id,
        symbol: market,
        action: tradeType,
        orderType,
        limitPrice: Number(limitPrice),
        amount: Number(amount),
        quantity: Number(quantity),
      });

      setSuccess(message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setAmount('');
        setQuantity('');
        setSuccess('');
        setError('');
        refreshUser();
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col bg-[#1a1b1c] p-4 rounded-sm w-full max-w-md text-[13px]">
      <div className="flex-1">
        {user && (
          <h4 className="flex justify-between font-semibold text-xs lg:text-base text-white/40 mb-4">
            <span>Available</span>{' '}
            <span>
              {availableBalance.toFixed(tradeType === 'buy' ? 2 : 6)}{' '}
              {tradeType === 'buy' ? 'USDT' : market}
            </span>
          </h4>
        )}

        <div className="flex text-xs pb-2">
          <button
            className={`px-4 py-1 border-[1.5px] rounded border-customGreen ${
              orderType === 'market' ? 'text-customGreen' : 'border-opacity-0'
            }`}
            onClick={() => setOrderType('market')}
          >
            Market
          </button>

          <button
            className={`px-4 py-1 border-[1.5px] rounded border-customGreen ${
              orderType === 'limit' ? 'text-customGreen' : 'border-opacity-0'
            }`}
            onClick={() => setOrderType('limit')}
          >
            Limit
          </button>
        </div>

        {orderType === 'limit' && (
          <div className="relative mt-6">
            <input
              type="number"
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
            type="number"
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
              <span
                className={`block px-4 py-1 rounded hover:bg-green-500 ${
                  balPercent >= percent ? 'bg-green-400' : 'bg-white/30'
                }`}
              ></span>
              <span className="text-center text-xs text-white/30">
                {percent}%
              </span>
            </button>
          ))}
        </div>

        <div className="relative mt-6">
          <input
            type="number"
            className="tradePanelInput peer"
            placeholder=" "
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
          />
          <label className="tradePanelLabel">Amount (USDT)</label>
        </div>

        {error && <Alert message={error} type="danger" />}
        {success && <Alert message={success} type="success" />}

        {/* Action Buttons */}
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
