export interface TradingPair {
  symbol: string;
  price: string;
  change: number;
}

interface HotPairsProps {
  hotList: TradingPair[];
}

export default function HotPairs({ hotList }: HotPairsProps) {
  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4 text-white/90">
        🔥 Hot Trading Pairs
      </h2>
      <div className="grid gap-4">
        {hotList.map((pair, index) => (
          <div
            key={index}
            className="grid grid-cols-3 text-xs tracking-wide p-3 bg-bodydark2 rounded-lg"
          >
            <span className="col-span-1 text-white/60">{pair.symbol}</span>
            <span className="col-span-1 text-white/60">${pair.price}</span>
            <span
              className={`col-span-1 ml-auto font-semibold ${
                pair.change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {pair.change >= 0 ? `+${pair.change}%` : `${pair.change}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
