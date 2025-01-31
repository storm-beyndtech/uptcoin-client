import Chart from '@/components/Chart';
import MarginTrade from '@/components/MarginTrade';
import MarketLabel from '@/components/MarketLabel';
import MarketList from '@/components/MarketList';
import Navbar from '@/components/Navbar';
import OrderHistory from '@/components/OrderHistory';
import { symbols } from '@/context/DataContext';
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
          <div className="col-span-2 bg-[#1a1b1c] p-4 rounded-sm">
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
