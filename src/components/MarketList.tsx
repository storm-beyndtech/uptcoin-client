import React from 'react';
import { useNavigate } from 'react-router-dom';

type Market = {
  symbol: string;
  price: number;
  change: number;
};

type MarketListProps = {
  markets: Market[];
  selectedMarket: string;
  setSelectedMarket: React.Dispatch<React.SetStateAction<string>>;
  setMarginModal?: React.Dispatch<React.SetStateAction<boolean>>;
};

const MarketList: React.FC<MarketListProps> = ({
  markets,
  selectedMarket,
  setSelectedMarket,
  setMarginModal,
}) => {
  const navigate = useNavigate();

  const handleClick = (symbol: string) => {
    if (!setMarginModal) {
      if (window.innerWidth < 1024) navigate(`/exchange/${symbol}`);
    }

    if (setMarginModal && window.innerWidth < 1024) setMarginModal(true);
    setSelectedMarket(symbol);
  };

  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar max-lg:px-4">
      <h2 className="text-sm font-semibold text-white/60 mb-2 max-lg:hidden">
        Market
      </h2>
      <div className="text-xs grid grid-cols-3 gap-2 max-lg:gap-3 border-b border-white/10 p-2 text-white/50">
        <span className="col-span-1">Pair</span>
        <span className="col-span-1 ml-auto">Price</span>
        <span className="col-span-1 ml-auto">24h%</span>
      </div>
      <div className="mt-2 font-medium leading-3">
        {markets.map((market) => (
          <div
            key={market.symbol}
            className={`grid grid-cols-3 gap-2 max-lg:gap-3 p-2 py-4 cursor-pointer rounded-sm text-white ${
              selectedMarket === market.symbol
                ? 'bg-bodydark1'
                : 'hover:bg-bodydark1'
            }`}
            onClick={() => handleClick(market.symbol)}
          >
            <div className="grid gap-[1px] col-span-1">
              <span className=" text-xs">
                {market.symbol}{' '}
                <span className="lg:hidden font-inter font-light text-white/50 ">
                  / USDT
                </span>
              </span>

              <span className=" text-[10px] lg:hidden font-inter font-light text-white/50">
                {market.symbol} <span> = USDT</span>
              </span>
            </div>

            <div className="grid gap-[1px] col-span-1">
              <span
                className={`col-span-1 text-xs ml-auto ${
                  market.change >= 0 ? 'lg:text-green-400' : 'lg:text-red-400'
                }`}
              >
                {market.price.toFixed(2)}
              </span>

              <span className="lg:hidden font-inter ml-auto font-light text-white/50 text-[10px]">
                {market.price.toFixed(2)} USDT
              </span>
            </div>

            <div className="grid col-span-1">
              <span
                className={`w-fit h-fit max-lg:my-auto ml-auto max-lg:p-1 max-lg:px-2 max-lg:rounded-sm max-lg:font-semibold col-span-1 text-right text-xs ${
                  market.change >= 0
                    ? 'text-green-400 max-lg:bg-green-600/10'
                    : 'text-red-400 max-lg:bg-red-500/10'
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
