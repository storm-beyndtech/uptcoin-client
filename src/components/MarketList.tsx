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
    <div className="w-full h-full overflow-y-auto no-scrollbar ">
      <h2 className="text-sm font-semibold text-white/60 mb-2">Market</h2>
      <div className="text-xs grid grid-cols-3 gap-2 border-b border-white/10 pb-2 text-white/30">
        <span className="col-span-1">Pair</span>
        <span className="col-span-1">Price</span>
        <span className="col-span-1 ml-auto">24h Change</span>
      </div>
      <div className="mt-2">
        {markets.map((market) => (
          <div
            key={market.symbol}
            className={`grid grid-cols-3 gap-2 p-2.5 cursor-pointer rounded-sm ${
              selectedMarket === market.symbol
                ? 'bg-bodydark1'
                : 'hover:bg-bodydark1'
            }`}
            onClick={() => setSelectedMarket(market.symbol)}
          >
            <div className="grid gap-[2px] col-span-1">
              <span className=" text-xs text-gray-300">
                {market.symbol}{' '}
                <span className="lg:hidden font-inter font-thin text-white/50 ">
                  / USDT
                </span>
              </span>

              <span className=" text-[8px] lg:hidden font-inter font-thin text-white/50">
                {market.symbol} <span className="">/ USD</span>
              </span>
            </div>

            <div className="grid gap-[2px] col-span-1">
              <span
                className={`col-span-1 text-xs ${
                  market.change >= 0 ? 'lg:text-green-400' : 'lg:text-red-400'
                }`}
              >
                {market.price.toFixed(2)}
              </span>

              <span className="lg:hidden font-inter font-thin text-white/50 text-[8px]">
                {market.price.toFixed(2)} USD
              </span>
            </div>

            <div className="grid gap-[2px] col-span-1">
              <span
                className={`w-fit h-fit max-lg:my-auto max-lg:ml-auto max-lg:p-1 max-lg:px-2 max-lg:rounded-sm max-lg:font-semibold col-span-1 text-right text-xs ${
                  market.change >= 0
                    ? 'lg:text-green-400 max-lg:bg-green-600'
                    : 'lg:text-red-400 max-lg:bg-red-500'
                }`}
              >
                {market.change.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketList;
