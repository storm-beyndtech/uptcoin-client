import { formatChange, formatTradePrice } from "@/lib/utils";

export interface TradingPair {
  symbol: string;
  price: number;
  change: number;
}

interface HotPairsProps {
  hotList: TradingPair[];
}

export default function HotPairs({ hotList }: HotPairsProps) {
  return (
    <div className="max-ctn p-4">
      <h2 className="text-lg font-semibold mb-4 text-white">
        🔥 Hot Trading Pairs
      </h2>
      <div className="grid gap-4">
        {hotList.map((pair, index) => (
          <div
            key={index}
            className="grid grid-cols-3 text-xs tracking-wide p-3 bg-bodydark2 rounded-lg"
          >
            <span className="col-span-1 text-white/90">{pair.symbol}</span>
            <span className="col-span-1 text-white/90">${formatTradePrice(pair.price)}</span>
            <span
              className={`col-span-1 ml-auto font-semibold ${
                pair.change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {pair.change >= 0 ? `${formatChange(pair.change)}` : `${formatChange(pair.change)}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
