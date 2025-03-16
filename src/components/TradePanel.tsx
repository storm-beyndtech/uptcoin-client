import { useState, useEffect } from 'react';
import { useCrypto } from '../context/CoinContext';
import { contextData } from '../context/AuthContext';
import { Asset } from '@/lib/utils';

interface TradePanelProps {
  market: string;
  tradeType: string;
}

interface AssetWithPrice extends Asset {
  price: number;
}

const TradePanel: React.FC<TradePanelProps> = ({ market, tradeType }) => {
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [availableBalance, setAvailableBalance] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { cryptoData } = useCrypto();
  const { user } = contextData();

  useEffect(() => {
    if (!user || !cryptoData) return;
    
    const asset = user.assets.find((asset: AssetWithPrice) => asset.symbol === market);
    const coinInfo = cryptoData.find((coin) => coin.symbol === market);
    const assetPrice = coinInfo ? Number(coinInfo.price) : 0;

    console.log(assetPrice)

    if (tradeType === 'buy') {
      const usdtAsset = user.assets.find((a: AssetWithPrice) => a.symbol === 'USDT');
      setAvailableBalance(usdtAsset ? usdtAsset.spot : 0);
    } else {
      setAvailableBalance(asset ? asset.spot : 0);
    }
  }, [user, cryptoData, market, tradeType]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    if (orderType === 'limit' && (!price || isNaN(Number(price)) || Number(price) <= 0)) {
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
      price: orderType === 'market' ? 'market_price' : price,
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

      alert(`Trade successful: ${data.message}`);
    } catch (err:any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#1a1b1c] p-4 rounded-sm w-full max-w-md text-[13px]">
      <div className='flex-1'>
        <h4 className="flex justify-between font-semibold text-xs lg:text-base text-white/40 mb-4">
          <span>Available</span> <span>{availableBalance} {tradeType === 'buy' ? 'USDT' : market}</span>
        </h4>
        
        <div className="flex text-xs pb-2">
          <button className={`px-4 py-1 border-[1.5px] rounded border-customGreen ${orderType === 'limit' ? 'text-customGreen' : 'border-opacity-0'}`} onClick={() => setOrderType('limit')}>Limit</button>
          <button className={`px-4 py-1 border-[1.5px] rounded border-customGreen ${orderType === 'market' ? 'text-customGreen' : 'border-opacity-0'}`} onClick={() => setOrderType('market')}>Market</button>
        </div>

        {orderType === 'limit' && (
          <div className="mt-4 relative">
            <label className="block text-white/40 text-xs mb-1 absolute left-3 top-[50%] translate-y-[-50%]">Price</label>
            <input type="text" className="tradePanelInput" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
        )}

        <div className="mt-4 relative">
          <label className="block text-white/40 text-xs mb-1 absolute left-3 top-[50%] translate-y-[-50%]">Quantity</label>
          <input type="text" className="tradePanelInput" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>

        <div className="mt-4 flex justify-between px-1">
          {[25, 50, 75, 100].map((percent) => (
            <button key={percent} className="flex flex-col items-center gap-1" onClick={() => setQuantity(((availableBalance * percent) / 100).toFixed(4))}>
              <span className="block bg-white/30 px-4 py-1 rounded hover:bg-green-500"></span>
              <span className="text-center text-xs text-white/30">{percent}%</span>
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        <div className="pt-4">
          <button className={`w-full py-2 rounded-md text-white ${tradeType === 'buy' ? 'bg-green-600' : 'bg-red-600'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : tradeType === 'buy' ? `Buy ${market}` : `Sell ${market}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradePanel;
