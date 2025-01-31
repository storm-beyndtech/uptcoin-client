import React from 'react';

type Market = {
  symbol: string;
  price: number;
  change: number;
};

type MarketListProps = {
  markets: Market[];
  selectedMarket: string;
  setSelectedMarket: React.Dispatch<React.SetStateAction<string>>;
};

const MarketList: React.FC<MarketListProps> = ({
  markets,
  selectedMarket,
  setSelectedMarket,
}) => {
  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar">
      <h2 className="text-sm font-semibold text-white/60 mb-2">Market</h2>
      <div className="text-xs flex justify-between border-b border-white/10 pb-2 text-white/30">
        <span>Pair</span>
        <span>Price</span>
        <span>24h %</span>
      </div>
      <div className="mt-2">
        {markets.map((market) => (
          <div
            key={market.symbol}
            className={`grid grid-cols-3 gap-2 p-2.5 cursor-pointer rounded-sm ${
              selectedMarket === market.symbol
                ? 'bg-[#151617]'
                : 'hover:bg-[#151617]'
            }`}
            onClick={() => setSelectedMarket(market.symbol)}
          >
            <span className="col-span-1 text-xs text-gray-300">
              {market.symbol}
            </span>
            <span
              className={`col-span-1 text-xs ${
                market.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {market.price.toFixed(2)}
            </span>
            <span
              className={`col-span-1 text-right text-xs ${
                market.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {market.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketList;
