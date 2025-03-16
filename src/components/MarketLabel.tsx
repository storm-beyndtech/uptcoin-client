import { formatNumber } from '@/lib/utils';
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
    <div className="flex items-center justify-between bg-[#1a1b1c] px-4 py-3 rounded-sm w-full">
      <div className="flex lg:items-start lg:flex-col">
        <span className="font-semibold mb-1 max-lg:hidden">
          {symbol} / USDT
        </span>
        <div className="flex justify-center max-lg:flex-col lg:gap-2">
          <span className="text-white max-lg:hidden">SPOT </span>

          <span className="font-semibold text-green-400 max-lg:text-2xl">
            {price.toFixed(2)}
          </span>

          <span className="lg:hidden text-xs">
            Last Traded: {price.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex max-lg:justify-between space-x-6 max-lg:space-x-3 text-xs text-right text-white/60 font-medium">
        <div>
          <span className="block lg:mb-1 mb-3">Low</span>
          <span className="lg:text-sm text-white">
            {Number(low).toFixed(2)}
          </span>
        </div>
        <div>
          <span className="block lg:mb-1 mb-3">High</span>
          <span className="lg:text-sm text-white">
            {Number(high).toFixed(2)}
          </span>
        </div>
        <div>
          <span className="block lg:mb-1 mb-3">24H Vol.</span>
          <span className="lg:text-sm text-white">
            {formatNumber(parseFloat(volume.replace(/,/g, '')))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarketLabel;
