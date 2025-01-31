import Chart from '@/components/Chart';
import MarketLabel from '@/components/MarketLabel';
import MarketList from '@/components/MarketList';
import Navbar from '@/components/Navbar';
import OrderBook from '@/components/OrderBook';
import OrderHistory from '@/components/OrderHistory';
import TradePanel from '@/components/TradePanel';
import { symbols } from '@/context/DataContext';
import React, { useEffect, useState } from 'react';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  low: string;
  high: string;
  volume: string;
}

const Exchange: React.FC = () => {
  const [selectedMarket, setSelectedMarket] = useState<string>('BTC');
  const [marketData, setMarketData] = useState<MarketData[]>([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false',
        );
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid API response');
        }

        // Filter data to match symbols and adjust price
        const updatedData: MarketData[] = symbols
          .map((item) => {
            const coin = data.find(
              (coin) => coin.symbol.toUpperCase() === item.symbol,
            );
            return coin
              ? {
                  symbol: coin.symbol.toUpperCase(),
                  price: Number(coin.current_price * (1 + item.margin / 100)),
                  change: Number(coin.price_change_percentage_24h),
                  low: coin.low_24h.toFixed(2),
                  high: coin.high_24h.toFixed(2),
                  volume: coin.total_volume.toLocaleString(),
                }
              : null;
          })
          .filter(Boolean) as MarketData[];

        setMarketData(updatedData);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };

    fetchMarketData();
  }, []);

  return (
    <section className="w-full bg-[#151617] pt-20">
      <Navbar />
      <div className="max-ctn !max-w-[1300px] text-white">
        <div className="w-full grid grid-cols-10 gap-4 py-5">
          {/* Market List */}
          <div className="col-span-2 bg-[#1a1b1c] p-4 rounded-sm">
            <MarketList
              markets={marketData}
              selectedMarket={selectedMarket}
              setSelectedMarket={setSelectedMarket}
            />
          </div>

          {/* Main Trading Section */}
          <div className="col-span-6 flex flex-col gap-10">
            <MarketLabel
              market={marketData.find(
                (market) => market.symbol === selectedMarket,
              ) || {price: 0, symbol: selectedMarket, high: '---', low: '---', volume: '---'}}
            />
            <Chart symbol={selectedMarket} />
            <div className="flex max-lg:flex-wrap gap-4">
              <TradePanel market={selectedMarket} tradeType="buy" />
              <TradePanel market={selectedMarket} tradeType="sell" />
            </div>
          </div>

          {/* Order Book */}
          <div className="col-span-2 bg-[#1a1b1c] p-4 rounded-sm">
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
