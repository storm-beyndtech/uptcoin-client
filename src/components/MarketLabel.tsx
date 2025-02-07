import React from 'react';

type marketData = {
  price: number;
  symbol: string;
  low: string;
  high: string;
  volume: string;
};

interface MarketLabelProps {
  market: marketData;
}

const MarketLabel: React.FC<MarketLabelProps> = ({ market }) => {
  const { symbol, low, high, volume, price } = market;

  return (
    <div className="market-label flex items-center justify-between bg-[#1a1b1c] px-4 py-3 rounded-sm w-full">
      <div className="flex flex-col">
        <span className="font-semibold mb-1">{symbol} / USDT</span>
        <span className="text-xs font text-green-500">
          Spot {price.toFixed(2)} USDT
        </span>
      </div>
      <div className="flex space-x-6 text-right text-white/50 font-semibold">
        <div>
          <span className="block text-xs mb-1">Low</span>
          <span className="text-sm">{low}</span>
        </div>
        <div>
          <span className="block text-xs mb-1">High</span>
          <span className="text-sm">{high}</span>
        </div>
        <div>
          <span className="block text-xs mb-1">24H Vol.</span>
          <span className="text-sm">{volume}</span>
        </div>
      </div>
    </div>
  );
};

export default MarketLabel;
