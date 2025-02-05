import Chart from '@/components/Chart';
import MarginTrade from '@/components/MarginTrade';
import MarketLabel from '@/components/MarketLabel';
import MarketList from '@/components/MarketList';
import Navbar from '@/components/Navbar';
import OrderHistory from '@/components/OrderHistory';
import { useCrypto } from '@/context/CoinContext';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  low: string;
  high: string;
  volume: string;
}

const QuickMargin: React.FC = () => {
  const { symbol } = useParams();
  const { cryptoData } = useCrypto();
  const [selectedMarket, setSelectedMarket] = useState<string>('BTC');

  const marketData: MarketData[] = cryptoData.map(
    ({ symbol, price, change, low, high, volume }) => ({
      symbol,
      price: Number(price),
      change: parseFloat(change),
      low,
      high,
      volume,
    }),
  );

  useEffect(() => {
    console.log(symbol);
    if (symbol !== undefined) {
      setSelectedMarket(symbol);
    }
  }, [symbol]);

  return (
    <section className="w-full bg-[#151617] pt-20">
      <Navbar />
      <div className="max-ctn !max-w-[1300px] text-white">
        <div className="w-full grid grid-cols-10 gap-4 py-5">
          {/* Market List */}
          <div className="col-span-2 max-lg:col-span-10 bg-[#1a1b1c] p-4 rounded-sm">
            <MarketList
              markets={marketData}
              selectedMarket={selectedMarket}
              setSelectedMarket={setSelectedMarket}
            />
          </div>

          {/* Main Trading Section */}
          <div className="col-span-5 flex flex-col gap-10">
            <MarketLabel
              market={
                marketData.find(
                  (market) => market.symbol === selectedMarket,
                ) || {
                  price: 0,
                  symbol: selectedMarket,
                  high: '---',
                  low: '---',
                  volume: '---',
                }
              }
            />
            <Chart symbol={selectedMarket} />
          </div>

          {/* Order Book */}
          <div className="col-span-3 bg-[#1a1b1c] p-4 rounded-sm">
            <MarginTrade />
          </div>
        </div>

        {/* Order History */}
        <div className="w-full bg-[#151617] p-2 rounded-sm">
          <OrderHistory />
        </div>
      </div>
    </section>
  );
};

export default QuickMargin;
