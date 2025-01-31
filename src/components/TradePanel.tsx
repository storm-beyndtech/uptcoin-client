import { useState } from 'react';

interface TradePanelProps {
  market: string;
  tradeType: string;
}

const TradePanel: React.FC<TradePanelProps> = ({ market, tradeType }) => {
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const availableUSDT = 0;

  return (
    <div className="flex flex-col bg-[#1a1b1c] p-4 rounded-sm w-full max-w-md text-[13px]">
      <div className='flex-1'>
        <h4 className="flex justify-between font-semibold text-base text-white/40 mb-4">
          {tradeType === 'buy' && (
            <>
              <span>Available</span> <span>{0} USDT</span>
            </>
          )}
          {tradeType === 'sell' && (
            <>
              <span>Available</span>{' '}
              <span>
                {0} {market}
              </span>
            </>
          )}
        </h4>
        <div className="flex text-xs pb-2">
          <button
            className={`px-4 py-1 border-[1.5px] rounded border-green-500 bg-transparent ${
              orderType === 'limit' ? 'text-green-500' : 'border-opacity-0'
            }`}
            onClick={() => setOrderType('limit')}
          >
            Limit
          </button>
          <button
            className={`px-4 py-1 border-[1.5px] rounded border-green-500 bg-transparent ${
              orderType === 'market' ? 'text-green-500' : 'border-opacity-0'
            }`}
            onClick={() => setOrderType('market')}
          >
            Market
          </button>
        </div>
        {orderType === 'limit' && (
          <>
            <div className="mt-4 relative">
              <label className="block text-white/40 text-xs mb-1 absolute left-3 top-[50%] translate-y-[-50%]">
                Price
              </label>
              <input
                type="text"
                className="tradePanelInput"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mt-4 relative">
              <label className="block text-white/40 text-xs mb-1 absolute left-3 top-[50%] translate-y-[-50%]">
                Quantity
              </label>
              <input
                type="text"
                className="tradePanelInput"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </>
        )}
        <div className="mt-4 flex justify-between px-1">
          {[25, 50, 75, 100].map((percent) => (
            <button
              key={percent}
              className="flex flex-col items-center gap-1"
              onClick={() =>
                setQuantity(((availableUSDT * percent) / 100).toFixed(4))
              }
            >
              <span
                className={`block bg-white/30 px-4 py-1 rounded hover:bg-green-500`}
              ></span>
              <span className="text-center text-xs text-white/30">
                {percent}%
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 relative">
          <label className="block text-white/40 text-xs mb-1 absolute left-3 top-[50%] translate-y-[-50%]">
            Price
          </label>
          <input
            type="text"
            className="tradePanelInput"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={orderType === 'market'}
          />
        </div>
      </div>

      <div className="pt-4">
        {tradeType === 'buy' && (
          <button className="w-full bg-green-600 py-2 rounded-md text-white">
            Buy {market}
          </button>
        )}
        {tradeType === 'sell' && (
          <button className="w-full bg-red-600 py-2 rounded-md text-white">
            Sell {market}
          </button>
        )}
      </div>
    </div>
  );
};

export default TradePanel;
