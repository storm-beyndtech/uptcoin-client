import Chart from '@/components/Chart';
import MarketLabel from '@/components/MarketLabel';
import MarketList from '@/components/MarketList';
import MobileNav from '@/components/MobileNav';
import Navbar from '@/components/Navbar';
import OrderBook from '@/components/OrderBook';
import OrderHistory from '@/components/OrderHistory';
import TradePanel from '@/components/TradePanel';
import { useCrypto } from '@/context/CoinContext';
import React, { useState } from 'react';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  low: string;
  high: string;
  volume: string;
}

const Exchange: React.FC = () => {
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

  return (
    <section className="w-full bg-[#151617] pt-20">
      <Navbar />
      <MobileNav />
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
          <div className="col-span-6 max-lg:col-span-10 flex flex-col gap-10">
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
            <div className="flex max-lg:flex-wrap gap-4">
              <TradePanel market={selectedMarket} tradeType="buy" />
              <TradePanel market={selectedMarket} tradeType="sell" />
            </div>
          </div>

          {/* Order Book */}
          <div className="col-span-2 max-lg:col-span-10 bg-[#1a1b1c] p-4 rounded-sm">
            <OrderBook
              marketData={marketData.find(
                (market) => market.symbol === selectedMarket,
              )}
            />
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

export default Exchange;
